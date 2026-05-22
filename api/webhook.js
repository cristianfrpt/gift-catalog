import { MercadoPagoConfig, Payment } from 'mercadopago'
import { createClient } from '@supabase/supabase-js'

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
})

const paymentApi = new Payment(mercadopago)

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  console.log('[MP WEBHOOK] recebido')

  try {
    if (req.method !== 'POST') {
      console.warn('[MP WEBHOOK] método inválido:', req.method)
      return res.status(405).send('Method not allowed')
    }

    const body = req.body
    console.log('[MP WEBHOOK] body:', JSON.stringify(body))

    const paymentId = body?.data?.id
    const type = body?.type || 'unknown'

    console.log('[MP WEBHOOK] type:', type)
    console.log('[MP WEBHOOK] paymentId:', paymentId)

    if (!paymentId) {
      console.warn('[MP WEBHOOK] evento sem paymentId')
      return res.status(200).send('ok - no paymentId')
    }

    console.log('[MP WEBHOOK] buscando pagamento no Mercado Pago...')

    const payment = await paymentApi.get({ id: paymentId })

    console.log('[MP WEBHOOK] status MP:', payment.status)
    console.log('[MP WEBHOOK] approved_at:', payment.date_approved)

    const isApproved =
      payment.status === 'approved' ||
      payment.date_approved !== null

    if (!isApproved) {
      console.log('[MP WEBHOOK] pagamento ainda não aprovado')
      return res.status(200).send('pending')
    }

    console.log('[MP WEBHOOK] buscando pagamento no Supabase...')

    const { data: paymentRecord, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('payment_id', String(paymentId))
      .single()

    if (paymentError) {
      console.error('[MP WEBHOOK] erro ao buscar pagamento:', paymentError)
      return res.status(500).send('Erro supabase select')
    }

    if (!paymentRecord) {
      console.warn('[MP WEBHOOK] pagamento não encontrado')
      return res.status(404).send('Pagamento não encontrado')
    }

    console.log('[MP WEBHOOK] pagamento encontrado:', paymentRecord.id)

    if (paymentRecord.status === 'approved') {
      console.log('[MP WEBHOOK] pagamento já processado')
      return res.status(200).send('already processed')
    }

    console.log('[MP WEBHOOK] atualizando pagamento...')

    const { error: updatePaymentError } = await supabase
      .from('payments')
      .update({
        status: 'approved',
        paid_at: new Date().toISOString(),
      })
      .eq('payment_id', String(paymentId))

    if (updatePaymentError) {
      console.error('[MP WEBHOOK] erro update payment:', updatePaymentError)
      return res.status(500).send('Erro update payment')
    }

    console.log('[MP WEBHOOK] pagamento atualizado')

    console.log('[MP WEBHOOK] atualizando produto...')

    const { error: productError } = await supabase
      .from('products')
      .update({ available: false })
      .neq('type', 'gift')
      .eq('id', paymentRecord.product_id)

    if (productError) {
      console.error('[MP WEBHOOK] erro update product:', productError)
      return res.status(500).send('Erro update product')
    }

    console.log('[MP WEBHOOK] produto atualizado')

    return res.status(200).send('ok')
  } catch (error) {
    console.error('[MP WEBHOOK] erro geral:', error)
    return res.status(500).send('Erro webhook')
  }
}