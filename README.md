# JetHR | Payroll Simulator 🚀

Prototipo di calcolatore RAL-Netto sviluppato per lo Skill Test di JetHR.

## 📌 Funzionalità
Lo strumento permette di trasformare la Retribuzione Annua Lorda (RAL) in stipendio netto mensile e annuale, simulando le trattenute fiscali e contributive italiane.

## ⚙️ Parametri e Logiche di Calcolo
Per garantire un risultato realistico, il simulatore integra:
- **Scaglioni IRPEF 2024:** Aliquote del 23%, 35% e 43% applicate sull'imponibile.
- **Esonero Contributivo (Cuneo Fiscale):** Logica condizionale (6% o 7%) basata sulla soglia di reddito mensile.
- **Contributi INPS:** Quota standard a carico del lavoratore (9.19%).
- **Detrazioni Lavoro Dipendente:** Calcolo automatico per abbattere l'imposta lorda.
- **Trattamento Integrativo (Ex Bonus Renzi):** Applicato per redditi fino a 28k €.
- **Addizionali Locali:** Stima basata su Regione e Comune selezionati.

## 🎯 Scelte di Prodotto
- **UX/UI:** Interfaccia ispirata al design system di JetHR per coerenza di brand.
- **Visione HR:** Inclusione del "Costo Totale Azienda" per una panoramica completa del payroll.
- **Semplificazione:** Profilo impostato come tempo indeterminato residente a Milano (default).

## 🛠️ Tech Stack
- React + Tailwind CSS
- Sviluppato tramite Lovable.dev
