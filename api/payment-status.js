import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  const { id } = req.query

  if (!id) {
    return res.status(400).json({
      error: 'Missing payment id',
    })
  }

  const { data, error } = await supabase
    .from('payments')
    .select('status')
    .eq('payment_id', String(id))
    .single()

  if (error) {
    return res.status(500).json({
      error: 'Erro ao buscar pagamento',
    })
  }

  return res.status(200).json({
    status: data.status,
  })
}