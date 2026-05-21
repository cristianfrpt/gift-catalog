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
  try {
    if (req.method !== 'POST') {
      return res.status(405).send('Method not allowed')
    }

    const paymentId = req.body?.data?.id

    if (!paymentId) {
      return res.status(200).send('ok')
    }

    const payment = await paymentApi.get({
      id: paymentId,
    })

    if (payment.status !== 'approved') {
      return res.status(200).send('Pagamento não aprovado')
    }

    const { data: paymentRecord, error: paymentError } =
      await supabase
        .from('payments')
        .select('*')
        .eq('payment_id', String(paymentId))
        .single()

    if (paymentError || !paymentRecord) {
      console.error(paymentError)

      return res.status(404).send('Pagamento não encontrado')
    }

    if (paymentRecord.status === 'approved') {
      return res.status(200).send('Pagamento já processado')
    }

    const { error: updatePaymentError } = await supabase
      .from('payments')
      .update({
        status: 'approved',
        paid_at: new Date(),
      })
      .eq('payment_id', String(paymentId))

    if (updatePaymentError) {
      console.error(updatePaymentError)

      return res.status(500).send('Erro ao atualizar pagamento')
    }

    const { error: productError } = await supabase
      .from('products')
      .update({
        available: false,
      })
      .eq('id', paymentRecord.product_id)

    if (productError) {
      console.error(productError)

      return res.status(500).send('Erro ao atualizar produto')
    }

    return res.status(200).send('ok')
  } catch (error) {
    console.error(error)

    return res.status(500).send('Erro webhook')
  }
}