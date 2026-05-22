import { createClient } from '@supabase/supabase-js'
import { rateLimit } from '../lib/rate-limit.js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

  const allowed = rateLimit(ip, 25)

  if (!allowed) {
    return res.status(429).json({
      error: 'Too many requests'
    })
  }
  
  const url = new URL(req.url, `https://${req.headers.host}`)
  const token = url.searchParams.get('token')


  if (!token) {
    return res.status(400).json({
      error: 'Missing payment id',
    })
  }

  const { data, error } = await supabase
    .from('payments')
    .select('status')
    .eq('public_token', token)
    .single()

  if (!data) {
    return res.status(404).json({
      error: 'Pagamento não encontrado',
    })
  }
  
  if (error) {
    return res.status(500).json({
      error: 'Erro ao buscar pagamento',
    })
  }

  return res.status(200).json({
    status: data.status,
  })
}