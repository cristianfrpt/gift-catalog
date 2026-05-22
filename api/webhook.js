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
    console.log('[MP WEBHOOK] invalid signature')
    return res.status(200).send('invalid signature')
  }

  if (req.method !== 'POST') {
    return res.status(405).send('method not allowed')
  }

  const paymentId = req.body?.data?.id

  if (!paymentId) {
    return res.status(200).send('missing paymentId')
  }

  try {
    const payment = await paymentApi.get({ id: paymentId })

    const isApproved =
      payment.status === 'approved' ||
      payment.date_approved !== null

    if (!isApproved) {
      return res.status(200).send('pending')
    }

    const { data: paymentRecord, error } = await supabase
      .from('payments')
      .select('id, status, product_id')
      .eq('payment_id', String(paymentId))
      .maybeSingle()

    if (error) {
      console.log('[MP WEBHOOK] supabase error')
      return res.status(500).send('supabase error')
    }

    if (!paymentRecord) {
      return res.status(200).send('not found')
    }

    if (paymentRecord.status === 'approved') {
      return res.status(200).send('already processed')
    }

    await supabase
      .from('payments')
      .update({
        status: 'approved',
        paid_at: new Date().toISOString(),
      })
      .eq('payment_id', String(paymentId))

    await supabase
      .from('products')
      .update({ available: false })
      .neq('type', 'gift')
      .eq('id', paymentRecord.product_id)

    console.log('[MP WEBHOOK] payment processed:', paymentId)

    return res.status(200).send('ok')
  } catch (error) {
    console.log('[MP WEBHOOK] error')
    return res.status(500).send('error')
  }
}