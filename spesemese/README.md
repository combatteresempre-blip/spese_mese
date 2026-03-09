# 💰 SpeseMese

Dashboard interattiva per gestire le spese mensili.

## ✨ Funzionalità
- Aggiungi spese con descrizione, importo e categoria
- Naviga tra i mesi con le frecce
- Visualizza la ripartizione a torta o a barre
- Le spese vengono salvate automaticamente nel browser (localStorage)
- Design responsive, funziona su mobile e desktop

---

## 🚀 Deploy su Vercel (consigliato)

### Metodo 1 — GitHub + Vercel (più semplice)

1. Crea un account gratuito su [github.com](https://github.com)
2. Crea un nuovo repository e carica tutti i file di questa cartella
3. Vai su [vercel.com](https://vercel.com) e accedi con GitHub
4. Clicca **"Add New Project"** → seleziona il tuo repository
5. Vercel rileva automaticamente Vite → clicca **Deploy**
6. In 1 minuto hai il tuo link pubblico! 🎉

### Metodo 2 — Vercel CLI (da terminale)

```bash
# Installa dipendenze
npm install

# Installa Vercel CLI
npm install -g vercel

# Deploy
vercel

# Segui le istruzioni → ottieni il link pubblico
```

---

## 💻 Sviluppo locale

```bash
# Installa dipendenze
npm install

# Avvia in locale (http://localhost:5173)
npm run dev

# Build per produzione
npm run build
```

---

## 📁 Struttura progetto

```
spesemese/
├── index.html          # Entry point HTML
├── package.json        # Dipendenze
├── vite.config.js      # Configurazione Vite
└── src/
    ├── main.jsx        # Entry point React
    └── SpeseMese.jsx   # Componente principale
```

---

## 🛠 Tecnologie usate
- [React 18](https://react.dev)
- [Vite](https://vitejs.dev)
- [Recharts](https://recharts.org) — grafici
- [Lucide React](https://lucide.dev) — icone
