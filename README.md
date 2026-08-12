# Tavola Periodica Interattiva

Un'applicazione web moderna, reattiva e scientificamente accurata per l'esplorazione degli elementi della tavola periodica, sviluppata con **React 18**, **TypeScript**, **Vite** e **TailwindCSS**.

---

## 🌟 Funzionalità Principali

- **Visualizzazione Completa della Tavola Periodica**:
  - Tutti i **118 elementi** organizzati in 18 gruppi e 7 periodi, compresi i blocchi separati dei **Lantanoidi** e degli **Attinoidi**.
  - Codifica a colori basata su 10 categorie chimiche standard (Metalli alcalini, Metalli alcalino terrosi, Lantanoidi, Attinoidi, Elementi di transizione, Metalli del blocco p, Semimetalli, Non metalli, Alogeni, Gas nobili).

- **Modalità Heatmap (Mappe di Calore)**:
  - Visualizzazione gradiente per confrontare visivamente le proprietà atomiche e fisiche tra gli elementi:
    - Raggio atomico ($\text{pm}$)
    - Densità ($\text{g/cm}^3$)
    - Anno di scoperta
    - Prima energia di ionizzazione ($\text{kJ/mol}$)
    - Elettronegatività (scala di Pauling)

- **Ricerca e Filtraggio Rapido**:
  - Ricerca istantanea per nome dell'elemento, simbolo o numero atomico ($Z$).
  - Filtro per stato della materia a temperatura ambiente ($20^\circ\text{C}$): Solido, Liquido, Gassoso, Sintetico.

- **Scheda di Dettaglio Elemento (Modale 3D)**:
  - Apertura al click di una scheda approfondita con animazioni fluide 3D (*Framer Motion*).
  - Mostra peso atomico, stati di ossidazione principali, raggio atomico, densità, anno di scoperta, configurazione elettronica e nota sugli isotopi.
  - Collegamento diretto alla pagina Wikipedia in italiano e anteprima visuale dell'elemento.

- **Modalità Quiz Educativo**:
  - Modulo di valutazione per testare l'apprendimento con 4 modalità di gioco:
    - Da Simbolo a Nome
    - Da Nome a Simbolo
    - Trova la Posizione sulla Tavola Periodica
    - Quiz Misto
  - 3 livelli di difficoltà (Facile, Medio, Difficile), supporto per timer a tempo e salvataggio automatico del miglior record nel *local storage*.

---

## 🔬 Accuratezza Scientifica e Fonti dei Dati

Dataset validato e aggiornato a partire dalle fonti ufficiali della chimica mondiale:

1. **IUPAC / CIAAW (Commission on Isotopic Abundances and Atomic Weights)**:
   - Pesi atomici standard convenzionali e mono-isotopici accurati.
   - Per gli elementi radioattivi privi di isotopi stabili in natura, l'IUPAC/CIAAW non assegna un peso atomico standard: il valore numerico viene racchiuso tra parentesi quadre `[...]` ed equivale al numero di massa dell'isotopo più stabile.

2. **NIST ASD (Atomic Spectra Database)**:
   - Energie di ionizzazione e configurazioni elettroniche verificate.
   - Per le proprietà non ancora misurate sperimentalmente o non criticamente valutate (in particolare per gli elementi sintetici superpesanti $Z \ge 99$), il dato viene presentato in trasparenza come `N/D` (*Non Disponibile / Non Misurato*) anziché fornire stime teoriche come valori certi.

---

## 🛠️ Tech Stack

- **Core**: React 18, TypeScript, Vite
- **Styling**: TailwindCSS, CSS Moderno, Glassmorphic UI
- **Animazioni**: Framer Motion
- **Icone**: FontAwesome (React)

---

## 🚀 Installazione e Avvio Locale

### Requisiti
- Node.js 18+ e npm

### Comandi

1. **Clona la repository o accedi alla cartella di progetto**:
   ```bash
   cd TavolaPeriodica-vr-main
   ```

2. **Installa le dipendenze**:
   ```bash
   npm install
   ```

3. **Avvia il server di sviluppo**:
   ```bash
   npm run dev
   ```

4. **Compila il bundle di produzione**:
   ```bash
   npm run build
   ```

5. **Anteprima della build di produzione**:
   ```bash
   npm run preview
   ```

---

## 📁 Struttura del Progetto

```
src/
├── components/          # Componenti UI (PeriodicTable, ElementCell, ElementModal, SearchBar, QuizModal, ecc.)
├── data/                # Dataset chimico (elementsData.ts)
├── types/               # Definizione delle interfacce TypeScript (element.ts, quiz.ts)
├── utils/               # Funzioni di utilità e colori gradienti (colors.ts)
├── App.tsx              # Componente principale dell'applicazione
├── index.css            # Stili globali TailwindCSS
└── main.tsx             # Entry point dell'applicazione React
```

---

## 📄 Licenza

Questo progetto è distribuito sotto licenza MIT.
