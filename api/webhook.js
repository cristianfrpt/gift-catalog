export default async function handler(req, res) {
  console.log("WEBHOOK RECEBIDO")

  console.log(req.body)

  return res.status(200).send("ok")
}