import crypto from 'crypto'

export function verifyMercadoPagoSignature(req) {
  const xSignature = req.headers['x-signature']
  const xRequestId = req.headers['x-request-id']

  if (!xSignature || !xRequestId) {
    return {
      valid: false,
      error: 'Missing headers'
    }
  }

  const signatureParts = xSignature.split(',')

  let ts = ''
  let v1 = ''

  signatureParts.forEach((part) => {
    const [key, value] = part.split('=')

    if (key.trim() === 'ts') {
      ts = value.trim()
    }

    if (key.trim() === 'v1') {
      v1 = value.trim()
    }
  })

  if (!ts || !v1) {
    return {
      valid: false,
      error: 'Invalid signature format'
    }
  }

  // Mercado Pago envia data.id via query
  const dataId = req.query['data.id']

  let manifest = ''

  if (dataId) {
    manifest += `id:${dataId};`
  }

  manifest += `request-id:${xRequestId};`
  manifest += `ts:${ts};`

  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET

  const generatedHash = crypto
    .createHmac('sha256', secret)
    .update(manifest)
    .digest('hex')

  return {
    valid: generatedHash === v1
  }
}