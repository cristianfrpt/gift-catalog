import { MercadoPagoConfig, Payment } from 'mercadopago'
import { createClient } from '@supabase/supabase-js'
import { verifyMercadoPagoSignature } from '../lib/webhook-auth.js'

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
})

const paymentApi = new Payment(mercadopago)

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  const type = req.body?.type

  if (type !== 'payment') {
    return res.status(200).send('ignored')
  }

  const validation = verifyMercadoPagoSignature(req)
  if (!validation.valid) {
    console.log('[MP WEBHOOK] invalid signature -> 401')
    return res.status(401).json({
      error: 'Invalid signature'
    })
  }

  try {
    if (req.method !== 'POST') {
      console.log('[MP WEBHOOK] invalid method:', req.method)
      return res.status(405).send('Method not allowed')
    }

    const paymentId = req.body?.data?.id

    if (!paymentId) {
      console.log('[MP WEBHOOK] missing paymentId -> ignoring')
      return res.status(200).send('ok')
    }

    console.log('[MP WEBHOOK] fetching payment from MP API...')

    const payment = await paymentApi.get({
      id: paymentId
    })

    const isApproved =
      payment.status === 'approved' ||
      payment.date_approved !== null

    if (!isApproved) {
      return res.status(200).send('pending')
    }

    const { data: paymentRecord, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('payment_id', String(paymentId))
      .maybeSingle()

    if (paymentError) {
      console.error('[MP WEBHOOK] supabase select error', paymentError)
      return res.status(500).send('Erro supabase')
    }

    if (!paymentRecord) {
      console.log('[MP WEBHOOK] payment not found in DB')
      return res.status(404).send('Pagamento não encontrado')
    }

    if (paymentRecord.status === 'approved') {
      console.log('[MP WEBHOOK] already processed')
      return res.status(200).send('already processed')
    }

    const { error: updatePaymentError } = await supabase
      .from('payments')
      .update({
        status: 'approved',
        paid_at: new Date().toISOString(),
      })
      .eq('payment_id', String(paymentId))

    if (updatePaymentError) {
      console.error('[MP WEBHOOK] update payment error', updatePaymentError)
      return res.status(500).send('Erro update payment')
    }

    const { error: productError } = await supabase
      .from('products')
      .update({
        available: false
      })
      .neq('type', 'gift')
      .eq('id', paymentRecord.product_id)

    if (productError) {
      console.error('[MP WEBHOOK] product update error', productError)
      return res.status(500).send('Erro update product')
    }

    console.log('[MP WEBHOOK] product updated successfully')
    return res.status(200).send('ok')
  } catch (error) {
    console.error('[MP WEBHOOK] fatal error', error)
    return res.status(500).send('Erro webhook')
  }
}