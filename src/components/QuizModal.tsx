import { useState, useEffect, useMemo, useCallback, type FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGamepad,
  faTrophy,
  faClock,
  faCheck,
  faTimes,
  faRedo,
  faTimes as faClose,
  faFire,
  faBrain,
  faLightbulb,
  faPlay,
  faArrowLeft,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import { type ElementData } from "../types/element";
import {
  type QuizMode,
  type Difficulty,
  type QuizStats,
  type QuizState,
  type WrongAnswerRecord,
} from "../types/quiz";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  elements: ElementData[];
}

const STORAGE_KEY = "tavola_periodica_quiz_best_score";
const TOTAL_QUESTIONS = 10;
const DEFAULT_TIME_PER_QUESTION = 15;

const QuizModal: FC<QuizModalProps> = ({ isOpen, onClose, elements }) => {
  const [quizState, setQuizState] = useState<QuizState>("setup");
  const [mode, setMode] = useState<QuizMode>("symbol_to_name");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [useTimer, setUseTimer] = useState<boolean>(true);
  const [timePerQuestion] = useState<number>(DEFAULT_TIME_PER_QUESTION);

  const [questionList, setQuestionList] = useState<ElementData[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_TIME_PER_QUESTION);

  const [stats, setStats] = useState<QuizStats>({
    score: 0,
    streak: 0,
    totalQuestions: TOTAL_QUESTIONS,
    correctAnswers: 0,
    bestStreak: 0,
  });

  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswerRecord[]>([]);
  const [bestRecord, setBestRecord] = useState<number>(0);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);

  // Caricamento del record storico al montaggio
  useEffect(() => {
    const savedRecord = localStorage.getItem(STORAGE_KEY);
    if (savedRecord) {
      setBestRecord(Number(savedRecord));
    }
  }, []);

  // Selezione pool di elementi in base alla difficoltà
  const pool = useMemo(() => {
    if (difficulty === "easy") {
      return elements.filter((el) => el.number <= 20);
    }
    if (difficulty === "medium") {
      return elements.filter((el) =>
        [1, 2, 13, 14, 15, 16, 17, 18].includes(el.group)
      );
    }
    return elements;
  }, [elements, difficulty]);

  // Generazione opzioni a scelta multipla per la domanda corrente
  const generateOptionsForQuestion = useCallback(
    (currentEl: ElementData, poolElements: ElementData[], currentMode: QuizMode): string[] => {
      if (currentMode === "find_on_table") {
        return [];
      }
      const correctAnswer = currentMode === "symbol_to_name" ? currentEl.name : currentEl.symbol;
      const otherElements = poolElements.filter((el) => el.number !== currentEl.number);

      // Mescola e prendi 3 distrattori
      const shuffledOthers = [...otherElements].sort(() => Math.random() - 0.5);
      const distractors = shuffledOthers.slice(0, 3).map((el) =>
        currentMode === "symbol_to_name" ? el.name : el.symbol
      );

      const allOpts = [correctAnswer, ...distractors];
      return allOpts.sort(() => Math.random() - 0.5);
    },
    []
  );

  // Avvio di una nuova sessione di gioco
  const handleStartQuiz = () => {
    if (pool.length < 4) return;

    // Seleziona casualmente 10 elementi dal pool
    const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffledPool.slice(0, TOTAL_QUESTIONS);

    setQuestionList(selectedQuestions);
    setCurrentIndex(0);
    setStats({
      score: 0,
      streak: 0,
      totalQuestions: selectedQuestions.length,
      correctAnswers: 0,
      bestStreak: 0,
    });
    setWrongAnswers([]);
    setIsNewRecord(false);
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(timePerQuestion);

    const firstOpts = generateOptionsForQuestion(selectedQuestions[0], pool, mode);
    setOptions(firstOpts);
    setQuizState("playing");
  };

  // Transizione alla domanda successiva
  const nextQuestion = useCallback(
    (
      nextIdx: number,
      qList: ElementData[],
      currentStats: QuizStats
    ) => {
      if (nextIdx >= qList.length) {
        // Fine del Quiz
        setQuizState("ended");
        if (currentStats.score > bestRecord) {
          setBestRecord(currentStats.score);
          setIsNewRecord(true);
          localStorage.setItem(STORAGE_KEY, String(currentStats.score));
        }
        return;
      }

      setCurrentIndex(nextIdx);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(timePerQuestion);

      const nextOpts = generateOptionsForQuestion(qList[nextIdx], pool, mode);
      setOptions(nextOpts);
    },
    [bestRecord, generateOptionsForQuestion, mode, pool, timePerQuestion]
  );

  // Valutazione della risposta
  const handleAnswer = useCallback(
    (userAnswer: string, answerElement?: ElementData) => {
      if (isAnswered) return;
      setIsAnswered(true);
      setSelectedOption(userAnswer);

      const currentEl = questionList[currentIndex];
      let correctAnswer = "";

      if (mode === "symbol_to_name") {
        correctAnswer = currentEl.name;
      } else if (mode === "name_to_symbol") {
        correctAnswer = currentEl.symbol;
      } else if (mode === "find_on_table") {
        correctAnswer = currentEl.name;
      }

      const isCorrect =
        mode === "find_on_table"
          ? answerElement?.number === currentEl.number
          : userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

      let newScore = stats.score;
      let newStreak = stats.streak;
      let newCorrect = stats.correctAnswers;
      let newBestStreak = stats.bestStreak;
      const newWrongs = [...wrongAnswers];

      if (isCorrect) {
        newStreak += 1;
        newCorrect += 1;
        if (newStreak > newBestStreak) {
          newBestStreak = newStreak;
        }

        const timeBonus = useTimer ? timeLeft * 10 : 0;
        const streakBonus = (newStreak - 1) * 25;
        const basePoints = 100;
        newScore += basePoints + timeBonus + streakBonus;
      } else {
        newStreak = 0;
        newWrongs.push({
          element: currentEl,
          userAnswer: userAnswer || "Nessuna risposta",
          correctAnswer: correctAnswer,
        });
      }

      const updatedStats: QuizStats = {
        score: newScore,
        streak: newStreak,
        totalQuestions: stats.totalQuestions,
        correctAnswers: newCorrect,
        bestStreak: newBestStreak,
      };

      setStats(updatedStats);
      setWrongAnswers(newWrongs);

      // Ritardo prima di passare alla domanda successiva
      setTimeout(() => {
        nextQuestion(currentIndex + 1, questionList, updatedStats);
      }, 1300);
    },
    [isAnswered, questionList, currentIndex, mode, stats, wrongAnswers, useTimer, timeLeft, nextQuestion]
  );

  // Gestione del Timer durante la risposta libera/scelta multipla
  useEffect(() => {
    if (quizState !== "playing" || !useTimer || isAnswered) return;

    if (timeLeft <= 0) {
      handleAnswer("Tempo scaduto!");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [quizState, useTimer, isAnswered, timeLeft, handleAnswer]);

  if (!isOpen) return null;

  const currentElement = questionList[currentIndex];

  // Helper per classe pulsante opzione
  const getOptionClass = (opt: string): string => {
    if (!isAnswered) {
      return "bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-white shadow-md hover:border-sky-400 hover:scale-[1.01]";
    }

    const correctAnswer =
      mode === "symbol_to_name" ? currentElement?.name : currentElement?.symbol;

    if (opt === correctAnswer) {
      return "bg-emerald-600/90 border-emerald-400 text-white font-bold ring-2 ring-emerald-300 shadow-lg shadow-emerald-900/50 scale-[1.02]";
    }

    if (opt === selectedOption) {
      return "bg-rose-600/90 border-rose-400 text-white font-bold ring-2 ring-rose-300 shadow-lg shadow-rose-900/50";
    }

    return "bg-slate-900/50 border-slate-800 text-slate-500 opacity-50";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl border border-slate-700/80 bg-slate-900/95 p-6 text-white shadow-2xl backdrop-blur-xl">
        {/* Pulsante chiusura */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
          title="Chiudi quiz"
        >
          <FontAwesomeIcon icon={faClose} className="w-5 h-5" />
        </button>

        {/* 1. SCHERMATA SETUP */}
        {quizState === "setup" && (
          <div className="flex flex-col gap-6 py-2">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 mb-3 shadow-lg shadow-sky-500/30">
                <FontAwesomeIcon icon={faGraduationCap} className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-sky-300 via-cyan-200 to-fuchsia-300 bg-clip-text text-transparent">
                Modalità Quiz Interattiva
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Metti alla prova le tue conoscenze sulla Tavola Periodica
              </p>
            </div>

            {/* Record Personale */}
            {bestRecord > 0 && (
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faTrophy} className="text-amber-400 text-xl" />
                  <div>
                    <div className="text-xs text-amber-300 font-semibold uppercase tracking-wider">
                      Miglior Record Storico
                    </div>
                    <div className="text-xl font-bold text-white">
                      {bestRecord + " Punti"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Selezione Modalità */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-2">
                <FontAwesomeIcon icon={faGamepad} />
                {"Modalità di Gioco"}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setMode("symbol_to_name")}
                  className={
                    "p-4 rounded-xl border text-left transition-all duration-200 " +
                    (mode === "symbol_to_name"
                      ? "bg-sky-600/30 border-sky-400 text-white ring-2 ring-sky-400/50 shadow-lg shadow-sky-900/40"
                      : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-700/60")
                  }
                >
                  <div className="font-bold text-base">{"Simbolo → Nome"}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    {"Indovina il nome dell'elemento dato il simbolo."}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMode("name_to_symbol")}
                  className={
                    "p-4 rounded-xl border text-left transition-all duration-200 " +
                    (mode === "name_to_symbol"
                      ? "bg-sky-600/30 border-sky-400 text-white ring-2 ring-sky-400/50 shadow-lg shadow-sky-900/40"
                      : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-700/60")
                  }
                >
                  <div className="font-bold text-base">{"Nome → Simbolo"}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    {"Indovina il simbolo chimico dato il nome."}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMode("find_on_table")}
                  className={
                    "p-4 rounded-xl border text-left transition-all duration-200 " +
                    (mode === "find_on_table"
                      ? "bg-sky-600/30 border-sky-400 text-white ring-2 ring-sky-400/50 shadow-lg shadow-sky-900/40"
                      : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-700/60")
                  }
                >
                  <div className="font-bold text-base">{"Trova sulla Tavola"}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    {"Seleziona l'elemento direttamente sulla mappa."}
                  </div>
                </button>
              </div>
            </div>

            {/* Selezione Difficoltà */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-2">
                <FontAwesomeIcon icon={faBrain} />
                {"Livello di Difficoltà"}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setDifficulty("easy")}
                  className={
                    "p-3 rounded-xl border transition-all text-center font-bold text-sm " +
                    (difficulty === "easy"
                      ? "bg-emerald-600/30 border-emerald-400 text-emerald-300 ring-2 ring-emerald-400/50 shadow-md"
                      : "bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-700/60")
                  }
                >
                  <div>{"Facile"}</div>
                  <div className="text-[11px] font-normal text-slate-400">
                    {"Primi 20 elementi"}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDifficulty("medium")}
                  className={
                    "p-3 rounded-xl border transition-all text-center font-bold text-sm " +
                    (difficulty === "medium"
                      ? "bg-amber-600/30 border-amber-400 text-amber-300 ring-2 ring-amber-400/50 shadow-md"
                      : "bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-700/60")
                  }
                >
                  <div>{"Medio"}</div>
                  <div className="text-[11px] font-normal text-slate-400">
                    {"Gruppi principali"}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDifficulty("hard")}
                  className={
                    "p-3 rounded-xl border transition-all text-center font-bold text-sm " +
                    (difficulty === "hard"
                      ? "bg-rose-600/30 border-rose-400 text-rose-300 ring-2 ring-rose-400/50 shadow-md"
                      : "bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-700/60")
                  }
                >
                  <div>{"Difficile"}</div>
                  <div className="text-[11px] font-normal text-slate-400">
                    {"Tutti i 118 elementi"}
                  </div>
                </button>
              </div>
            </div>

            {/* Opzione Timer */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faClock} className="text-sky-400 text-lg" />
                <div>
                  <div className="font-semibold text-sm">{"Timer a Tempo (15 secondi)"}</div>
                  <div className="text-xs text-slate-400">
                    {"Ottieni punti extra in base ai secondi rimanenti."}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUseTimer(!useTimer)}
                className={
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors " +
                  (useTimer ? "bg-sky-500" : "bg-slate-700")
                }
              >
                <span
                  className={
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform " +
                    (useTimer ? "translate-x-6" : "translate-x-1")
                  }
                />
              </button>
            </div>

            {/* Pulsante Avvio */}
            <button
              type="button"
              onClick={handleStartQuiz}
              className="mt-2 w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-600 to-fuchsia-600 text-white font-extrabold text-lg shadow-xl shadow-indigo-600/40 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-3"
            >
              <FontAwesomeIcon icon={faPlay} />
              {"Inizia Quiz (" + TOTAL_QUESTIONS + " Domande)"}
            </button>
          </div>
        )}

        {/* 2. SCHERMATA GIOCO */}
        {quizState === "playing" && currentElement && (
          <div className="flex flex-col gap-6 py-2">
            {/* Header del Gioco */}
            <div className="flex items-center justify-between bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuizState("setup")}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Torna al menu"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {"Domanda " + (currentIndex + 1) + " / " + TOTAL_QUESTIONS}
                  </div>
                  <div className="text-lg font-bold text-sky-300">
                    {"Punteggio: " + stats.score}
                  </div>
                </div>
              </div>

              {/* Indicatore Streak */}
              {stats.streak > 1 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-sm animate-pulse shadow-lg shadow-amber-500/20">
                  <FontAwesomeIcon icon={faFire} className="text-amber-400" />
                  {"Streak x" + stats.streak}
                </div>
              )}

              {/* Timer Visivo */}
              {useTimer && (
                <div
                  className={
                    "flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono font-bold text-sm " +
                    (timeLeft <= 5
                      ? "bg-rose-500/20 border-rose-500/50 text-rose-300 animate-bounce"
                      : "bg-slate-900/80 border-slate-700 text-sky-300")
                  }
                >
                  <FontAwesomeIcon icon={faClock} />
                  {timeLeft + "s"}
                </div>
              )}
            </div>

            {/* Barra di avanzamento domande */}
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/50">
              <div
                className="bg-gradient-to-r from-sky-400 to-indigo-500 h-full transition-all duration-300"
                style={{
                  width: ((currentIndex + 1) / TOTAL_QUESTIONS) * 100 + "%",
                }}
              />
            </div>

            {/* Card Domanda */}
            <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/90 border border-slate-700 shadow-inner text-center">
              <div className="text-xs font-semibold uppercase tracking-widest text-sky-400 mb-2">
                {mode === "symbol_to_name" && "Qual è il nome di questo elemento?"}
                {mode === "name_to_symbol" && "Qual è il simbolo chimico di questo elemento?"}
                {mode === "find_on_table" && "Seleziona questo elemento sulla tavola:"}
              </div>

              {mode === "symbol_to_name" && (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-6xl font-black tracking-tight text-white drop-shadow-md">
                    {currentElement.symbol}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {"Numero Atomico: " + currentElement.number}
                  </span>
                </div>
              )}

              {mode === "name_to_symbol" && (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-3xl font-extrabold text-white tracking-wide">
                    {currentElement.name}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {"Categoria: " + currentElement.category}
                  </span>
                </div>
              )}

              {mode === "find_on_table" && (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-3xl font-extrabold text-white">
                    {currentElement.name + " (" + currentElement.symbol + ")"}
                  </span>
                  <span className="text-xs text-slate-400">
                    {"Numero atomico " + currentElement.number + " · Categoria: " + currentElement.category}
                  </span>
                </div>
              )}
            </div>

            {/* Risposte a scelta multipla (per Symbol->Name e Name->Symbol) */}
            {mode !== "find_on_table" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {options.map((opt, idx) => (
                  <button
                    key={opt + "_" + idx}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleAnswer(opt)}
                    className={
                      "p-4 rounded-xl border transition-all duration-200 font-semibold text-base flex items-center justify-between " +
                      getOptionClass(opt)
                    }
                  >
                    <span>{opt}</span>
                    {isAnswered && (
                      <span>
                        {opt ===
                        (mode === "symbol_to_name" ? currentElement.name : currentElement.symbol) ? (
                          <FontAwesomeIcon icon={faCheck} className="text-white" />
                        ) : opt === selectedOption ? (
                          <FontAwesomeIcon icon={faTimes} className="text-white" />
                        ) : null}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Selezione da Griglia per la modalità "Trova sulla tavola" */}
            {mode === "find_on_table" && (
              <div className="flex flex-col gap-3">
                <div className="text-xs text-slate-400 text-center">
                  {"Fai click sull'elemento corretto nell'elenco sottostante:"}
                </div>
                <div className="max-h-60 overflow-y-auto grid grid-cols-3 sm:grid-cols-6 gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800 custom-scrollbar">
                  {pool.map((el) => {
                    const isSelected = selectedOption === el.name;
                    const isTarget = el.number === currentElement.number;
                    let btnStyle = "bg-slate-800/80 border-slate-700 hover:bg-slate-700 text-white";

                    if (isAnswered) {
                      if (isTarget) {
                        btnStyle = "bg-emerald-600 border-emerald-400 text-white font-bold ring-2 ring-emerald-300";
                      } else if (isSelected) {
                        btnStyle = "bg-rose-600 border-rose-400 text-white font-bold ring-2 ring-rose-300";
                      } else {
                        btnStyle = "bg-slate-900/40 border-slate-800 text-slate-600 opacity-40";
                      }
                    }

                    return (
                      <button
                        key={el.number}
                        type="button"
                        disabled={isAnswered}
                        onClick={() => handleAnswer(el.name, el)}
                        className={
                          "p-2 rounded-lg border text-center transition-all flex flex-col items-center justify-center " +
                          btnStyle
                        }
                      >
                        <span className="text-[10px] text-slate-400 leading-none">
                          {el.number}
                        </span>
                        <span className="text-base font-extrabold leading-tight">
                          {el.symbol}
                        </span>
                        <span className="text-[9px] truncate w-full leading-none opacity-80">
                          {el.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. SCHERMATA FINALE / RISULTATI */}
        {quizState === "ended" && (
          <div className="flex flex-col gap-6 py-2 text-center">
            {/* Titolo e Icona Celebrativa */}
            <div>
              <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 mb-3 shadow-xl shadow-amber-500/30">
                <FontAwesomeIcon icon={faTrophy} className="w-10 h-10 text-slate-950" />
              </div>
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-amber-300 via-yellow-200 to-sky-300 bg-clip-text text-transparent">
                Quiz Completato!
              </h2>
              {isNewRecord && (
                <div className="mt-2 inline-block px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-extrabold uppercase tracking-wider animate-bounce">
                  {"Nuovo Record Personale!"}
                </div>
              )}
            </div>

            {/* Griglia Statistiche */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 flex flex-col items-center">
                <span className="text-xs font-semibold text-slate-400 uppercase">
                  {"Punteggio Finale"}
                </span>
                <span className="text-2xl font-black text-sky-300 mt-1">
                  {stats.score}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 flex flex-col items-center">
                <span className="text-xs font-semibold text-slate-400 uppercase">
                  {"Risposte Esatte"}
                </span>
                <span className="text-2xl font-black text-emerald-400 mt-1">
                  {stats.correctAnswers + " / " + TOTAL_QUESTIONS}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 flex flex-col items-center">
                <span className="text-xs font-semibold text-slate-400 uppercase">
                  {"Accuratezza"}
                </span>
                <span className="text-2xl font-black text-indigo-300 mt-1">
                  {Math.round((stats.correctAnswers / TOTAL_QUESTIONS) * 100) + "%"}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 flex flex-col items-center">
                <span className="text-xs font-semibold text-slate-400 uppercase">
                  {"Miglior Streak"}
                </span>
                <span className="text-2xl font-black text-amber-400 mt-1">
                  {stats.bestStreak}
                </span>
              </div>
            </div>

            {/* Riepilogo Errori se presenti */}
            {wrongAnswers.length > 0 && (
              <div className="flex flex-col gap-2 text-left mt-2">
                <div className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-2">
                  <FontAwesomeIcon icon={faLightbulb} />
                  {"Elementi da Ripassare (" + wrongAnswers.length + ")"}
                </div>
                <div className="max-h-48 overflow-y-auto flex flex-col gap-2 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 custom-scrollbar">
                  {wrongAnswers.map((w, idx) => (
                    <div
                      key={w.element.number + "_" + idx}
                      className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-1 rounded-md bg-slate-800 font-extrabold text-sky-300 text-sm">
                          {w.element.symbol}
                        </span>
                        <div>
                          <div className="font-bold text-white text-sm">{w.element.name}</div>
                          <div className="text-slate-400">
                            {"La tua risposta: "}
                            <span className="text-rose-400 font-semibold">{w.userAnswer}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-500 uppercase">{"Corretto"}</div>
                        <div className="text-emerald-400 font-bold text-sm">
                          {w.correctAnswer}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Azioni */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                type="button"
                onClick={handleStartQuiz}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-extrabold text-base shadow-lg shadow-indigo-600/30 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faRedo} />
                {"Gioca di Nuovo"}
              </button>
              <button
                type="button"
                onClick={() => setQuizState("setup")}
                className="flex-1 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-base border border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faGamepad} />
                {"Cambia Impostazioni"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizModal;
