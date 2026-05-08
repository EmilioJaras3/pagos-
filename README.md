# Vulturus

Pasarela de pagos con Stripe.

## Ejecutar en local

### Con Docker

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env
docker compose up
```

Backend en `http://localhost:3001`, frontend en `http://localhost:5173`.

### Sin Docker

```bash
npm install
cd frontend && npm install && cd ..
cp .env.example .env
cp frontend/.env.example frontend/.env

npm run dev
cd frontend && npm run dev
```

## Variables de entorno

`.env` en la raiz:

```
PORT=3001
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

`frontend/.env`:

```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
VITE_API_URL=http://localhost:3001
```

## Webhooks locales

```bash
stripe listen --forward-to localhost:3001/api/payments/webhook
stripe trigger payment_intent.succeeded
```

## Tests

```bash
npm test
```

## Tarjetas de prueba

| Tarjeta | Resultado |
|---------|-----------|
| 4242 4242 4242 4242 | Exitosa |
| 4000 0025 0000 3155 | 3D Secure |
| 4000 0000 0000 9995 | Rechazada |
