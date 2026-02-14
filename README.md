# Resident Live Chat

Aplicatie de chat in timp real pentru blocuri de locuinte, construita cu Angular si Node.js.

## Tehnologii utilizate

### Backend
- Node.js v22.15.0
- Express 4.18.2
- Socket.io 4.6.1
- TypeScript 5.1.6
- CORS 2.8.5

### Frontend
- Angular 20.1.0
- Socket.io-client 4.6.1
- Tailwind CSS 4.1.18
- RxJS 7.8.0

## Instalare

### Cerinte preliminare
- Node.js v22.15.0
- npm 

### Pasii de instalare

#### 1. Instalare dependinte backend

```bash
cd backend
npm install
```

#### 2. Instalare dependinte frontend

```bash
cd frontend
npm install
```

## Rulare aplicatie

### Pornire backend

```bash
cd backend
npm run dev
```

Backend-ul va rula pe portul 3000 (http://localhost:3000)

### Pornire frontend

Intr-un terminal separat:

```bash
cd frontend
npm start
```

Frontend-ul va fi disponibil pe portul indicat de Angular CLI (de obicei http://localhost:4200)

## Utilizare

1. Deschide aplicatia in browser
2. Introdu un username (obligatoriu pentru trimitere mesaje)
3. Scrie mesajul si apasa Enter sau butonul "Trimite"
4. Mesajele tale apar in dreapta (albastru inchis)
5. Mesajele altora apar in stanga (albastru deschis)
6. Notificarile de join/leave apar centrate

## Functionalitati

- Chat in timp real intre multiple tab-uri/utilizatori
- Validare username (obligatoriu pentru trimitere)
- Username blocat dupa primirea primului mesaj
- Timestamp pentru fiecare mesaj
- Avatare cu initiale pentru fiecare utilizator
- Notificari cand utilizatori se alatura sau parasesc chat-ul
- Design responsive (mobil friendly)
- Diferentiere vizuala intre mesajele proprii si ale altora

## Structura proiect

```
project/
├── backend/
│   ├── src/
│   │   └── server.ts          # Server Express + Socket.io
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── chat/          # Componenta de chat
│   │   │   └── services/      # Socket service
│   │   └── styles.css         
│   ├── package.json
│   └── tailwind.config.cjs
└── README.md
```

## Comenzi disponibile

### Backend
- `npm run dev` - Porneste serverul in modul development cu hot-reload
- `npm run build` - Compileaza TypeScript in JavaScript
- `npm start` - Porneste serverul din fisierele compilate

### Frontend
- `npm start` - Porneste dev server-ul Angular
- `npm run build` - Construieste aplicatia pentru productie
- `npm test` - Ruleaza testele unitare

## Note

- Nu exista baza de date - toate mesajele sunt temporare
- La refresh, istoricul mesajelor se pierde
- Username-ul se blocheaza dupa trimiterea primului mesaj
- Toate tab-urile deschise primesc mesajele in timp real
