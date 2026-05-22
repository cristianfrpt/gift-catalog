import crypto from 'crypto'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { createClient } from '@supabase/supabase-js'
import { rateLimit } from '../lib/rate-limit.js'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
})

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
   const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

  const allowed = rateLimit(ip, 5)

  if (!allowed) {
    return res.status(429).json({
      error: 'Too many requests'
    })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Método não permitido',
    })
  }

  try {
    const { amount, productId } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: 'Valor inválido',
      })
    }

    if (!productId) {
      return res.status(400).json({
        error: 'Produto inválido',
      })
    }

    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, available')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      return res.status(404).json({
        error: 'Produto não encontrado',
      })
    }

    if (!product.available) {
      return res.status(400).json({
        error: 'Produto indisponível',
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

        notification_url:
          'https://cha-camila.vercel.app/api/webhook',
      },
    })

    const publicToken = crypto.randomUUID()
    
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        payment_id: String(result.id),
        product_id: productId,
        public_token: publicToken,
        amount,
        status: 'pending',
      })

    if (paymentError) {
      console.error(paymentError)

      return res.status(500).json({
        error: 'Erro ao salvar pagamento',
      })
    }

    return res.status(200).json({
      id: result.id,

      qr_code:
        result.point_of_interaction.transaction_data.qr_code,

      qr_code_base64:
        result.point_of_interaction.transaction_data
          .qr_code_base64,

      paymentToken: publicToken,
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      error: 'Erro ao gerar PIX',
    })
  }
}