# Backend - Resident Live Chat

Server TypeScript cu Express și Socket.io pentru chat live.

## Instalare

```bash
npm install
```

## Build

```bash
npm run build
```

## Pornire server

```bash
npm start
```

## Development (cu ts-node-dev)

```bash
npm run dev
```

## Socket.io Events

- `send-message` - Trimite un mesaj
- `user-connected` - Notifică conectarea unui utilizator
- `new-message` - Primește mesaje noi
- `user-joined` - Notificare când se alătură un utilizator
- `user-left` - Notificare când părăsește un utilizator

## Port

Server rulează pe portul 3000 (default)
