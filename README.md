# Montalbano Elicona — Piattaforma Digitale Turistica (PWA)

Realizzato secondo l'offerta commerciale AM ADVISORY / Pro Loco Montalbano Elicona APS.

## Stack
- Next.js 15 (App Router) + Tailwind — PWA installabile (manifest + service worker)
- Prisma + SQLite (file locale, nessun database esterno da pagare)
- Notifiche push web (VAPID), file audio/video caricati manualmente (nessuna generazione AI/TTS, nessun costo per richiesta)

## Avvio in locale

```bash
npm install
cp .env.example .env.local   # poi genera SESSION_SECRET e le chiavi VAPID
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Sito pubblico: http://localhost:3000/it (redirect automatico dalla lingua)
Admin: http://localhost:3000/admin/login — credenziali di default create dal seed:
- email: `admin@prolocomontalbano.it`
- password: `montalbano2026`

**Cambiare subito email/password admin dopo il primo accesso** (per ora si aggiornano direttamente nel database; se serve una pagina "cambia password" te la aggiungo).

## Generare le chiavi VAPID (notifiche push)

```bash
npx web-push generate-vapid-keys
```

Copia `Public Key` in `VAPID_PUBLIC_KEY` e `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, e `Private Key` in `VAPID_PRIVATE_KEY`.

## Contenuti da fornire (vedi punto 6 dell'offerta)

Tutti i contenuti attualmente nel sito sono **segnaposto** da sostituire:
- Logo e colori ufficiali della Pro Loco (icone PWA e palette sono provvisorie)
- Testi, foto, audio (podcast) e video per ogni punto di interesse (max 15, gestibili da `/admin/poi`)
- Numeri di emergenza/farmacie/uffici reali (`/admin/info`)
- Contatti Pro Loco (`/admin/contatti` — attualmente statico, da aggiornare nel codice o su richiesta reso gestibile da pannello)

## Deploy su Render

Config in `render.yaml` (Blueprint dedicato a questo progetto, come per pizza-saas). Servizio Node unico con disco persistente per il database SQLite e i file caricati (audio/video/immagini) — nessun database a pagamento necessario.

Variabili d'ambiente da impostare su Render dopo il deploy: `SESSION_SECRET`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_CONTACT_EMAIL`, opzionalmente `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD` per l'utente admin iniziale.

## QR Code

Generati automaticamente in `/admin/qrcodes` per ogni punto di interesse pubblicato, pronti da scaricare e stampare.
