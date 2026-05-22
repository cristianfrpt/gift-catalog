import crypto from 'crypto'

export function verifyMercadoPagoSignature(req) {
  const xSignature = req.headers['x-signature']
  const xRequestId = req.headers['x-request-id']

  console.log('\n========== MERCADO PAGO WEBHOOK ==========')

  console.log('URL:')
  console.log(req.url)

  console.log('\nHEADERS:')
  console.log({
    'x-signature': xSignature,
    'x-request-id': xRequestId,
    host: req.headers.host
  })

  if (!xSignature || !xRequestId) {
    console.log('\nERROR: Missing headers')

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

  console.log('\nSIGNATURE PARTS:')
  console.log({
    ts,
    v1
  })

  if (!ts || !v1) {
    console.log('\nERROR: Invalid signature format')

    return {
      valid: false,
      error: 'Invalid signature format'
    }
  }

  // Mercado Pago envia data.id via query
  const url = new URL(req.url, `https://${req.headers.host}`)

  const dataId =
  url.searchParams.get('data.id') ||
  url.searchParams.get('id')  

  console.log('\nQUERY PARAMS:')
  console.log(Object.fromEntries(url.searchParams.entries()))

  console.log('\nDATA ID:')
  console.log(dataId)

  let manifest = ''

  if (dataId) {
    manifest += `id:${dataId};`
  }

  manifest += `request-id:${xRequestId};`
  manifest += `ts:${ts};`

  console.log('\nMANIFEST:')
  console.log(manifest)

  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET

  console.log('\nSECRET EXISTS:')
  console.log(!!secret)

  console.log('\nSECRET LENGTH:')
  console.log(secret?.length)

  const generatedHash = crypto
    .createHmac('sha256', secret)
    .update(manifest)
    .digest('hex')

  console.log('\nHASHES:')
  console.log({
    generatedHash,
    receivedHash: v1
  })

  const valid = generatedHash === v1

  console.log('\nVALID:')
  console.log(valid)

  console.log('=========================================\n')

  return {
    valid,
    generatedHash,
    receivedHash: v1,
    manifest,
    dataId
  }
}