# Tavola Periodica degli Elementi

Applicazione React + TypeScript + Tailwind CSS con 118 elementi, tavola 18×7, lantanidi/attinidi, legenda, schede modali, accessibilità di base e link a Wikipedia italiana.

## Avvio

```bash
npm install
npm run dev
```

Build di produzione:

```bash
npm run build
npm run preview
```

Type-check:

```bash
npm run typecheck
```

## Dipendenze principali

- React / React DOM
- Vite
- TypeScript
- Tailwind CSS 4 + `@tailwindcss/vite`
- Font Awesome React + Solid Icons

## Decisioni tecniche

- React Router non è necessario: l'applicazione ha una sola vista e la scheda dell'elemento è una modal locale.
- La tavola è generata esclusivamente dai dati: nessuna duplicazione di 118 componenti.
- La griglia principale mantiene una larghezza minima su mobile e usa overflow orizzontale controllato invece di comprimere le celle fino a renderle illeggibili.
- Le serie f e la posizione degli asterischi seguono la convenzione della tavola lunga a 18 gruppi.
- La categoria, il colore e tutti i dati degli elementi sono separati dai componenti UI.

## Font Awesome

Le icone sono importate da `@fortawesome/free-solid-svg-icons`, in particolare l'icona di radioattività, chiusura e link esterno.

## Fonti scientifiche

La scelta dei pesi atomici segue la tavola IUPAC/CIAAW 2021 pubblicata nel 2022. Per gli elementi senza abbondanza isotopica terrestre caratteristica viene mostrato un numero di massa tra parentesi quadre. Le prime energie di ionizzazione inserite per gli elementi leggeri e medi sono espresse in kJ/mol e vanno ricondotte alle valutazioni NIST ASD; per i superpesanti non viene mostrato un numero se non è disponibile un valore critico affidabile nel dataset usato.

Fonti di riferimento:
- IUPAC Periodic Table: https://iupac.org/what-we-do/periodic-table-of-elements/
- NIST Atomic Spectra Database: https://physics.nist.gov/asd

## Immagini

Il componente `ElementImage` supporta immagini future tramite il campo `image`. In assenza di una risorsa verificata, la UI mostra intenzionalmente un placeholder elegante invece di collegare immagini esterne non verificate.
