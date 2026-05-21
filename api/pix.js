import { MercadoPagoConfig, Payment } from "mercadopago"

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Método não permitido',
    })
  }

  try {
    const { amount, description } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: "Valor inválido",
      })
    }

    const payment = new Payment(client)

    const result = await payment.create({
      body: {
        transaction_amount: Number(amount),
        description: 'Cha de casa nova',
        payment_method_id: 'pix',

        payer: {
          email: 'test_user_123@testuser.com',
        },
      },
    })

    return res.status(200).json({
      id: result.id,
      qr_code: result.point_of_interaction.transaction_data.qr_code,
      qr_code_base64:
        result.point_of_interaction.transaction_data.qr_code_base64,
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      error: 'Erro ao gerar PIX',
    })
  }
}