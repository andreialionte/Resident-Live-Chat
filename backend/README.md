# Backend - Resident Live Chat

Server Node.js cu Express și Socket.io pentru chat live.

## Instalare

```bash
npm install
```

## Pornire server

```bash
npm start
```

## Pornire server în modul development (cu nodemon)

```bash
npm run dev
```

## Endpoints Socket.io

- `send-message` - Trimite un mesaj
- `user-connected` - Notifică conectarea unui utilizator
- `new-message` - Primește mesaje noi
- `user-joined` - Notificare când se alătură un utilizator
- `user-left` - Notificare când părăsește un utilizator

## Port

Server rulează pe portul 3000 (default)
