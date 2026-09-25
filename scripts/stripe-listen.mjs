/**
 * `pnpm stripe:listen` — trimite evenimentele Stripe spre webhook-ul local.
 *
 * Cheia se ia din `.env.local`, nu din `stripe login`: CLI-ul poate fi
 * autentificat pe alt cont Stripe (e cazul pe mașina de dezvoltare), iar atunci
 * ar asculta evenimentele altcuiva, cu alt secret de semnătură.
 *
 * Secretul `whsec_…` afișat la pornire e stabil pentru aceeași cheie, deci cel
 * din `STRIPE_WEBHOOK_SECRET` rămâne valabil de la o rulare la alta.
 *
 * Portul implicit e 3000; dacă `next dev` a pornit pe altul: `PORT=3001 pnpm stripe:listen`.
 */
import { spawn } from 'node:child_process'

try {
  process.loadEnvFile('.env.local')
} catch {
  // Fără fișier: rămâne ce e deja în mediu.
}

const key = process.env.STRIPE_SECRET_KEY
if (!key) {
  console.error('STRIPE_SECRET_KEY lipsește din .env.local.')
  process.exit(1)
}

const events = [
  'checkout.session.completed',
  'checkout.session.async_payment_succeeded',
  'charge.refunded',
].join(',')

const port = process.env.PORT ?? '3000'
const forward = `localhost:${port}/api/stripe/webhook`

// Pe Windows, `stripe` poate fi un shim .cmd, care cere shell. Comanda se dă
// ca un singur șir: valorile de mai sus nu conțin spații sau caractere speciale.
const child = spawn(
  `stripe listen --api-key ${key} --events ${events} --forward-to ${forward}`,
  { stdio: 'inherit', shell: true },
)
child.on('exit', (code) => process.exit(code ?? 0))
