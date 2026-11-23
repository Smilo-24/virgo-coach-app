/**
 * Virgo Coach — Telegram Mini App (TMA) V3 Interactive Edition
 * Logica interattiva: Barra Progresso Live, Smart Time Phase, Auto-Reset Giornaliero,
 * Sport (Palestra, Boxe, Corsa, Camminata), Pasti, Spesa con Contatore & Ricette,
 * Carriera S07, Guerrieri, Fede e Check-in con Storico Locale.
 */

// Inizializza Telegram Web App
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  if (tg.setHeaderColor) tg.setHeaderColor("#08090d");
  if (tg.setBackgroundColor) tg.setBackgroundColor("#08090d");
}

function haptic(type = "light") {
  if (tg?.HapticFeedback) {
    if (type === "success") tg.HapticFeedback.notificationOccurred("success");
    else if (type === "warning") tg.HapticFeedback.notificationOccurred("warning");
    else if (type === "selection") tg.HapticFeedback.selectionChanged();
    else tg.HapticFeedback.impactOccurred(type);
  }
}

// =============================================================================
// SPORT & WORKOUT MODALITÀ (Palestra, Boxe, Corsa, Camminata)
// =============================================================================
const SPORT_MODES = {
  palestra: {
    badge: "🏋️ PALESTRA & FORZA FUNZIONALE",
    name: "Sessione di Carico & Costruzione Muscolare",
    desc: "Progressione controllata sui grandi movimenti, macchine/pesi liberi, tenuta del core e stimolo metabolico pulito.",
    tips: [
      "10' Riscaldamento articolare dinamico (spalle, anche, caviglie).",
      "Esecuzione chirurgica: zero compensi o ego-lifting.",
      "Post-allenamento: 10' stretching di scarico e sauna per abbassare il cortisolo."
    ]
  },
  boxe: {
    badge: "🥊 BOXE & COMBATTIMENTO (18:30 – 19:30)",
    name: "Tecnica, Sacco & Condizionamento",
    desc: "Coordinazione, guardia alta, lavoro al sacco e combinazioni per scaricare ogni tensione mentale e forgiare il fiato.",
    tips: [
      "Ore 17:45: Mangia 1 banana + 20g mandorle per avere glicogeno rapido.",
      "Fasciatura mani ben salda e spalle morbide nei colpi.",
      "Fine sessione: 10' di sauna e idratazione abbondante con sali."
    ]
  },
  corsa: {
    badge: "🏃 CORSA AEROBICA (30' – 45')",
    name: "Corsa su Strada / Lungo il Po",
    desc: "Ritmo continuo e sciolto (145–155 bpm) per ossigenare il cervello, sviluppare la base aerobica e scaricare le tensioni.",
    tips: [
      "Bevi un bicchiere d'acqua 15 min prima di allacciare le scarpe.",
      "Respirazione ritmica e cadenza costante senza strappi.",
      "Doccia di contrasto caldo/freddo alle gambe al rientro."
    ]
  },
  camminata: {
    badge: "🚶 CAMMINATA RIGENERANTE (45' – 60')",
    name: "Recupero Attivo & Sincronizzazione Circadiana",
    desc: "Passo svelto e continuo all'aria aperta senza cuffie né schermi: reset psicologico, digestione e mobilità naturale.",
    tips: [
      "Lascia il telefono in tasca o senza notifiche.",
      "Luce solare naturale per azzerare lo stress e allineare il sonno.",
      "Respirazione diaframmatica nasale profonda."
    ]
  }
};

let currentSportMode = "palestra";

function switchSportMode(mode) {
  haptic("light");
  currentSportMode = mode;
  ["palestra", "boxe", "corsa", "camminata"].forEach(m => {
    const btn = document.getElementById(`sport-btn-${m}`);
    if (btn) btn.classList.toggle("active", m === mode);
  });

  const data = SPORT_MODES[mode];
  if (!data) return;
  document.getElementById("workout-type-badge").innerText = data.badge;
  document.getElementById("workout-name").innerText = data.name;
  document.getElementById("workout-desc").innerText = data.desc;

  const tipsUl = document.querySelector("#workout-tips ul");
  tipsUl.innerHTML = "";
  data.tips.forEach(t => {
    const li = document.createElement("li");
    li.innerText = t;
    tipsUl.appendChild(li);
  });
}

function markWorkoutDone() {
  haptic("success");
  const mv2 = document.getElementById("mv-2");
  if (mv2 && !mv2.checked) {
    mv2.checked = true;
    toggleCheck(mv2);
  }
  switchTab("oggi");
}

// =============================================================================
// ROUTINE SETTIMANALE DEI GIORNI (Timeline Oggi)
// =============================================================================
const WEEK_DATA = [
  {
    dayName: "LUNEDÌ — RITMO E RING",
    quote: "«Nessuno deve dirti quanto vali. Rialzati e cammina a testa alta.»",
    workoutType: "🥊 Boxe / 🏋️ Palestra 18:30",
    timeline: [
      { hour: 6, time: "06:40", title: "Sveglia & 500 ml Acqua", desc: "Idratazione cellulare immediata, 10' mobilità a terra. Zero schermi." },
      { hour: 9, time: "09:00", title: "Welfare Coach Academy", desc: "Sede Reale Group S07 (Via Garibaldi 7, Torino). Focus Strada B." },
      { hour: 13, time: "13:00", title: "Pranzo da Atleta", desc: "100g riso basmati + 150g pollo ai ferri + zucchine + olio EVO." },
      { hour: 17, time: "17:45", title: "Snack Pre-Workout", desc: "1 banana + 20g mandorle (glicogeno rapido)." },
      { hour: 18, time: "18:30", title: "🥊 Boxe / Palestra", desc: "Lavoro ad alta intensità + 10' sauna e stretching." },
      { hour: 20, time: "20:30", title: "Cena di Recupero", desc: "Pesce/uova + spinaci/broccoli + pane integrale." },
      { hour: 22, time: "22:15", title: "Curfew Elettronico", desc: "Schermi OFF. Letto ore 23:00." }
    ]
  },
  {
    dayName: "MARTEDÌ — CORSA E FOCUS",
    quote: "«Riposati alla fine, non nel mezzo. La vittoria è figlia delle ore noiose fatte con maestria.»",
    workoutType: "🏃 Corsa 30' Aerobica",
    timeline: [
      { hour: 6, time: "06:40", title: "Sveglia & Acqua", desc: "500 ml d'acqua fresca, tapparelle aperte." },
      { hour: 7, time: "07:10", title: "🏃 Corsa 30' Mattutina", desc: "Passo sciolto e continuo, scarico pensieri." },
      { hour: 8, time: "08:00", title: "Colazione Atleta", desc: "Skyr 200g + 40g avena + frutti rossi + noci." },
      { hour: 9, time: "09:00", title: "Focus Academy & Studio IVASS", desc: "Studio moduli e casi clienti in Sede S07." },
      { hour: 13, time: "13:00", title: "Pranzo Anti-Crash", desc: "80g pasta integrale + tonno + pomodorini e rucola." },
      { hour: 20, time: "20:30", title: "Cena & Spazio Sacro", desc: "Cena pulita, tempo di qualità con Angela." },
      { hour: 22, time: "22:15", title: "Curfew Notturno", desc: "Schermi OFF." }
    ]
  },
  {
    dayName: "MERCOLEDÌ — FORZA E RING",
    quote: "«Non temo l'uomo che ha fatto 10.000 calci una volta, ma chi ha fatto un calcio 10.000 volte.»",
    workoutType: "🥊 Boxe / 🏋️ Palestra Tecnica",
    timeline: [
      { hour: 6, time: "06:40", title: "Sveglia & Mobilità", desc: "20 minuti di allungamento e respirazione a casa." },
      { hour: 9, time: "09:00", title: "Focus Sede Reale Group", desc: "Attività sul campo in Via Garibaldi 7." },
      { hour: 13, time: "13:00", title: "Pranzo di Guerra", desc: "90g riso + 150g macinato magro + fagiolini." },
      { hour: 17, time: "17:45", title: "Snack Pre-Sessione", desc: "Yogurt greco + miele o banana." },
      { hour: 18, time: "18:30", title: "🥊 Boxe / Palestra", desc: "Sessione di forza e tecnica + sauna." },
      { hour: 20, time: "20:30", title: "Cena Condivisa", desc: "Orata al forno + patate lesse + insalata mista con Angela." },
      { hour: 22, time: "22:15", title: "Riposo Rigenerante", desc: "Stacco totale." }
    ]
  },
  {
    dayName: "GIOVEDÌ — CORSA E RESISTENZA",
    quote: "«Quando la mente ti dice che hai finito, in realtà sei solo al 40% del tuo potenziale reale.»",
    workoutType: "🏃 Corsa 30' Costante",
    timeline: [
      { hour: 6, time: "06:40", title: "Sveglia & Idratazione", desc: "Bicchiere d'acqua grande." },
      { hour: 7, time: "07:10", title: "🏃 Corsa 30'", desc: "Cadenza costante aerobica." },
      { hour: 8, time: "08:00", title: "Colazione Proteica", desc: "3 uova strapazzate + pane di segale + caffè amaro." },
      { hour: 9, time: "09:00", title: "Focus Professionale", desc: "Attività Academy S07 e preparazione IVASS/OCF." },
      { hour: 13, time: "13:00", title: "Pranzo Leggero", desc: "Riso integrale + gamberetti/legumi + verdure." },
      { hour: 20, time: "20:30", title: "Cena Leggera", desc: "Frittata con verdure + abbondante insalata mista." },
      { hour: 22, time: "22:15", title: "Curfew Elettronico", desc: "Lettura su carta e sonno profondo." }
    ]
  },
  {
    dayName: "VENERDÌ — CHIUSURA E MOBILITÀ",
    quote: "«La disciplina è fare ciò che odi fare, ma farlo come se lo amassi.»",
    workoutType: "🏋️ Palestra / Core a Terra",
    timeline: [
      { hour: 6, time: "06:40", title: "Sveglia & Acqua", desc: "Idratazione e luce naturale." },
      { hour: 7, time: "07:15", title: "💪 Core & Mobilità 20'", desc: "Plank, flessioni perfette e stretching." },
      { hour: 9, time: "09:00", title: "Chiusura Task Settimana", desc: "Bilancio settimanale e archiviazione." },
      { hour: 13, time: "13:00", title: "Pranzo Pulito", desc: "Petto di pollo + riso basmati + melanzane grigliate." },
      { hour: 20, time: "20:30", title: "Cena Relax con Angela", desc: "Pesce, Gambero Pork o pizza artigianale di qualità." },
      { hour: 22, time: "22:30", title: "Riposo Sereno", desc: "Stacco dagli impegni lavorativi." }
    ]
  },
  {
    dayName: "SABATO — CORSA LUNGA E RESET",
    quote: "«Al mattino abbi presente questo: mi alzo per compiere il mio dovere di essere umano.»",
    workoutType: "🏃 Corsa Lunga 40-45'",
    timeline: [
      { hour: 7, time: "07:30", title: "Sveglia Naturale", desc: "500 ml acqua, niente telefono a letto." },
      { hour: 8, time: "08:15", title: "🏃 Corsa 40-45' al Parco", desc: "Rigenerazione e ossigenazione completa lungo il Po." },
      { hour: 9, time: "09:30", title: "Colazione Ricca", desc: "Pancake di avena e albumi con frutta fresca o uova." },
      { hour: 10, time: "10:30", title: "🛒 Spesa Pulita della Settimana", desc: "Rifornimento carburante sano al supermercato." },
      { hour: 15, time: "Pomeriggio", title: "Tempo Libero con Angela", desc: "Passeggiata a Torino, stacco totale." },
      { hour: 20, time: "Sera", title: "Tigelle / Serata Speciale", desc: "Spazio conviviale e sfizioso pulito." }
    ]
  },
  {
    dayName: "DOMENICA — RECUPERO E MEAL PREP",
    quote: "«La disciplina è il ponte tra gli obiettivi e la loro realizzazione.»",
    workoutType: "🚶 Camminata 45' & Meal Prep",
    timeline: [
      { hour: 8, time: "08:00", title: "Risveglio Dolce", desc: "Idratazione e colazione rilassata." },
      { hour: 9, time: "09:00", title: "🚶 Camminata 45' all'Aperto", desc: "Recupero attivo senza cuffie né notifiche." },
      { hour: 10, time: "10:30", title: "🍳 Meal Prep (1h30)", desc: "Cuocere riso, verdure e pollo per i pranzi della settimana." },
      { hour: 15, time: "Pomeriggio", title: "Riposo Attivo & Famiglia", desc: "Lettura su carta, chiamata a casa." },
      { hour: 21, time: "21:30", title: "Rito di Chiusura", desc: "Borsa pronta per lunedì e check-in della settimana." }
    ]
  }
];

// =============================================================================
// GUERRIERI & FEDE
// =============================================================================
const WARRIORS = [
  {
    author: "🐉 GIUSEPPE — Il Vero Drago (Pitagora)",
    quote: "«Simo, nessuno deve dirti quanto vali.»",
    focus: "Nessun momento no, nessun calo di forma e nessun ostacolo ha il potere di definire il tuo valore. Rialzati e cammina a testa alta."
  },
  {
    author: "🐉 GIUSEPPE — La Trincea",
    quote: "«Chi ha fame si vede da come guarda il piatto, non da quanto urla di aver fame. Lavora in silenzio.»",
    focus: "Meno parole, più esecuzione. Risultati tangibili, rispetto della parola data."
  },
  {
    author: "🐍 KOBE BRYANT — Mamba Mentality",
    quote: "«Riposati alla fine, non nel mezzo. La vittoria è figlia delle ore noiose fatte con maestria.»",
    focus: "La vittoria è la conseguenza inevitabile di migliaia di ore noiose, silenziose e ripetitive eseguite alla perfezione."
  },
  {
    author: "🥋 BRUCE LEE — Il Maestro",
    quote: "«Non temo l'uomo che ha praticato 10.000 calci una volta, ma temo l'uomo che ha praticato un calcio 10.000 volte. Be water, my friend.»",
    focus: "La maestria è la ripetizione chirurgica dei fondamentali basilari. Fai ciò che devi fare con calma impassibile."
  },
  {
    author: "🔥 DAVID GOGGINS — Resilienza Pura",
    quote: "«Quando la tua mente ti dice che hai finito, sei sfinito e non ce la fai più, in realtà sei solo al 40% del tuo potenziale reale.»",
    focus: "La mente mente per farti risparmiare energia e tenerti comodo. Spegni le scuse ed esci fuori."
  },
  {
    author: "🥊 MIKE TYSON — Il Ring",
    quote: "«La disciplina è fare ciò che odi fare, ma farlo come se lo amassi.»",
    focus: "Non aspettare la voglia. L'atleta agisce per sistema e dovere verso se stesso, non per umore."
  },
  {
    author: "📚 JIM ROHN — Maestria Personale",
    quote: "«O sopporti il dolore della disciplina, o sopporterai il dolore del rimpianto.»",
    focus: "Ogni scelta quotidiana ha un peso. Scegli il peso che ti rende fiero stasera prima di dormire."
  },
  {
    author: "🏛️ MARCO AURELIO — Stoicismo di Governo",
    quote: "«Al mattino, quando ti svegli malvolentieri, abbi presente questo pensiero: mi alzo per compiere il mio dovere di essere umano.»",
    focus: "Ciò che è accaduto è passato. Ciò che mangi, pensi e fai nel prossimo minuto appartiene solo a te."
  }
];

const FAITH_VERSES = [
  {
    ref: "✝️ ISAIA 43:2 — Presenza & Protezione",
    quote: "«Se dovrai attraversare le acque, io sarò con te. I fiumi non ti sommergeranno. Se dovrai camminare nel fuoco, non ti scotterai. La fiamma non ti brucerà.»",
    focus: "Non sei solo nella trincea. La forza che cerchi è già dentro di te. Respira e ritrova la pace."
  },
  {
    ref: "✝️ PROVERBI 19:21 — Il Disegno Superiore",
    quote: "«Se viene da Dio, ti troverà anche se scappi. Se non viene da Dio, non importa quanto tu lo insegua: prima o poi crollerà.»",
    focus: "Fai la tua parte con eccellenza, lascia a Dio l'esito. Serenità e discernimento."
  },
  {
    ref: "✝️ ISAIA 6:8 — La Chiamata",
    quote: "«Poi udii la voce del Signore che diceva: “Chi manderò, e chi andrà per noi?” E io ho risposto: “Eccomi, manda me.”»",
    focus: "Prenditi la responsabilità della tua vita, del tuo corpo e della tua casa. Eccomi, manda me."
  },
  {
    ref: "✝️ SALMO 23:1-3 — Il Buon Pastore",
    quote: "«Il Signore è il mio pastore: non manco di nulla. Su pascoli erbosi mi fa riposare, ad acque tranquille mi conduce. Rinfranca l'anima mia.»",
    focus: "Scarica il cortisolo e le ansie. Hai tutto ciò che serve per vincere questa giornata."
  },
  {
    ref: "✝️ LA CROCE — Non Gettare la Croce",
    quote: "«Can you imagine Jesus dropping the cross? La forza suprema non è nella fuga o nel risentimento, ma nel trasformare la fatica in amore, portando avanti la propria missione con dignità.»",
    focus: "Non fuggire dal dovere. Trasforma la fatica in grandezza interiore."
  }
];

// =============================================================================
// STATO APPLICAZIONE
// =============================================================================
let currentDayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1; // 0=Lun, 6=Dom
let currentWarriorIdx = 0;
let currentFaithIdx = 0;

const DAILY_IDS = [
  "chk-acqua", "chk-occhi", "chk-social", "chk-movimento",
  "mv-1", "mv-2", "mv-3", "mv-4", "mv-5", "mv-6"
];
const GROCERY_IDS = [
  "gr-1", "gr-2", "gr-3", "gr-4", "gr-5", "gr-6", "gr-7", "gr-8",
  "gr-9", "gr-10", "gr-11", "gr-12", "gr-13", "gr-14", "gr-15", "gr-16"
];

// =============================================================================
// SCUDO PRIVACY (Auto-Unlock per Simone ID 262089602 su Telegram, PIN fuori)
// =============================================================================
const AUTHORIZED_TG_ID = 262089602;
const FALLBACK_PIN = "2407";

function checkPrivacyAccess() {
  const tgUserId = tg?.initDataUnsafe?.user?.id;
  const savedUnlock = localStorage.getItem("virgo_privacy_unlocked") === "1";

  if (tgUserId === AUTHORIZED_TG_ID || savedUnlock) {
    unlockAppUI();
  }
}

function unlockWithPin() {
  const val = document.getElementById("pin-input")?.value.trim();
  if (val === FALLBACK_PIN) {
    localStorage.setItem("virgo_privacy_unlocked", "1");
    unlockAppUI();
  } else {
    const err = document.getElementById("pin-error");
    if (err) err.style.display = "block";
  }
}

function unlockAppUI() {
  const lock = document.getElementById("privacy-lock-screen");
  const app = document.getElementById("app");
  if (lock) lock.style.display = "none";
  if (app) app.style.display = "flex";
}

// =============================================================================
// INIZIALIZZAZIONE UI
// =============================================================================
document.addEventListener("DOMContentLoaded", () => {
  checkPrivacyAccess();
  checkDailyAutoReset();
  renderSmartPhase();
  renderToday();
  selectDayWorkout(currentDayIdx);
  loadChecklistState();
  updateAllCounters();
  renderCheckinHistory();
});

function checkDailyAutoReset() {
  const todayStr = new Date().toISOString().slice(0, 10);
  const lastDate = localStorage.getItem("virgo_last_active_date");
  if (lastDate && lastDate !== todayStr) {
    // Nuovo giorno: azzera le spunte giornaliere (ma NON la lista della spesa!)
    DAILY_IDS.forEach(id => localStorage.removeItem(`virgo_chk_${id}`));
  }
  localStorage.setItem("virgo_last_active_date", todayStr);
}

function renderSmartPhase() {
  const h = new Date().getHours();
  const iconEl = document.getElementById("phase-icon");
  const titleEl = document.getElementById("phase-title");
  const descEl = document.getElementById("phase-desc");

  if (h >= 5 && h < 12) {
    iconEl.innerText = "🌅";
    titleEl.innerText = "SLANCIO MATTUTINO";
    descEl.innerText = "Idratazione 500ml, luce solare e attacco deciso ai task.";
  } else if (h >= 12 && h < 17) {
    iconEl.innerText = "🏛️";
    titleEl.innerText = "FOCUS SEDE S07 & ACADEMY";
    descEl.innerText = "Pranzo pulito anti-crash e massima presenza professionale.";
  } else if (h >= 17 && h < 21) {
    iconEl.innerText = "⚡";
    titleEl.innerText = "FASE SERALE: WORKOUT & RECUPERO";
    descEl.innerText = "Scarica il cortisolo con l'allenamento e goditi una cena nutriente.";
  } else {
    iconEl.innerText = "🌙";
    titleEl.innerText = "CHIUSURA & CURFEW ELETTRONICO";
    descEl.innerText = "Registra il Check-in di oggi, stacca gli schermi e proteggi il sonno.";
  }
}

function renderToday() {
  const data = WEEK_DATA[currentDayIdx];
  const dayNames = ["LUN", "MAR", "MER", "GIO", "VEN", "SAB", "DOM"];
  const currentHour = new Date().getHours();
  
  document.getElementById("current-date-badge").innerText = dayNames[currentDayIdx] + " • OGGI";
  document.getElementById("day-tag").innerText = data.dayName;
  document.getElementById("day-title").innerText = data.workoutType;
  document.getElementById("day-quote").innerText = data.quote;

  // Timeline con evidenziazione slot attuale
  const tlContainer = document.getElementById("day-timeline");
  tlContainer.innerHTML = "";

  // Trova lo slot attivo più vicino all'ora corrente
  let activeSlotIdx = 0;
  data.timeline.forEach((item, idx) => {
    if (currentHour >= item.hour) activeSlotIdx = idx;
  });

  data.timeline.forEach((item, idx) => {
    const div = document.createElement("div");
    const isNow = idx === activeSlotIdx;
    div.className = "timeline-item" + (isNow ? " active-slot" : "");
    div.innerHTML = `
      <div class="time-col">${item.time}${isNow ? '<span class="now-tag">ORA</span>' : ''}</div>
      <div class="desc-col">
        <strong>${item.title}</strong>
        <span>${item.desc}</span>
      </div>
    `;
    tlContainer.appendChild(div);
  });
}

// =============================================================================
// TAB SWITCHING
// =============================================================================
function switchTab(tabId) {
  haptic("light");
  document.querySelectorAll(".tab-page").forEach(page => page.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));

  const targetPage = document.getElementById(`tab-${tabId}`);
  const targetNav = document.getElementById(`nav-${tabId}`);

  if (targetPage) targetPage.classList.add("active");
  if (targetNav) targetNav.classList.add("active");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// =============================================================================
// WORKOUT SELECTOR (Giorni)
// =============================================================================
function selectDayWorkout(dayIdx) {
  haptic("light");
  const chips = document.querySelectorAll(".day-chip");
  chips.forEach((c, idx) => {
    c.classList.toggle("active", idx === dayIdx);
  });

  // Seleziona la modalità sport ideale per quel giorno
  if (dayIdx === 0 || dayIdx === 2) {
    switchSportMode("boxe");
  } else if (dayIdx === 1 || dayIdx === 3 || dayIdx === 5) {
    switchSportMode("corsa");
  } else if (dayIdx === 6) {
    switchSportMode("camminata");
  } else {
    switchSportMode("palestra");
  }
}

// =============================================================================
// ALIMENTAZIONE: SWITCH VISTA GIORNALIERA VS SPESA VS RICETTE
// =============================================================================
function switchFoodView(view) {
  haptic("light");
  ["daily", "weekly", "recipes"].forEach(v => {
    const btn = document.getElementById(`btn-food-${v}`);
    const box = document.getElementById(`view-food-${v}`);
    if (btn) btn.classList.toggle("active", v === view);
    if (box) box.style.display = v === view ? "block" : "none";
  });
}

function resetGroceryList() {
  haptic("warning");
  GROCERY_IDS.forEach(id => {
    localStorage.removeItem(`virgo_chk_${id}`);
    const el = document.getElementById(id);
    if (el) el.checked = false;
  });
  updateAllCounters();
}

// =============================================================================
// CARRIERA, GUERRIERI & FEDE CONTROLLI
// =============================================================================
function switchMentorView(view) {
  haptic("light");
  document.getElementById("btn-sub-career").classList.toggle("active", view === "career");
  document.getElementById("btn-sub-warriors").classList.toggle("active", view === "warriors");
  document.getElementById("btn-sub-faith").classList.toggle("active", view === "faith");

  document.getElementById("view-career").style.display = view === "career" ? "block" : "none";
  document.getElementById("view-warriors").style.display = view === "warriors" ? "block" : "none";
  document.getElementById("view-faith").style.display = view === "faith" ? "block" : "none";
}

function nextWarrior() {
  haptic("medium");
  currentWarriorIdx = (currentWarriorIdx + 1) % WARRIORS.length;
  const w = WARRIORS[currentWarriorIdx];
  document.getElementById("w-author").innerText = w.author;
  document.getElementById("w-quote").innerText = w.quote;
  document.getElementById("w-focus").innerHTML = `💡 <strong>Focus:</strong> ${w.focus}`;
}

function nextFaith() {
  haptic("medium");
  currentFaithIdx = (currentFaithIdx + 1) % FAITH_VERSES.length;
  const f = FAITH_VERSES[currentFaithIdx];
  document.getElementById("f-ref").innerText = f.ref;
  document.getElementById("f-quote").innerText = f.quote;
  document.getElementById("f-focus").innerText = `🕊️ ${f.focus}`;
}

// =============================================================================
// CHECKLISTS PERSISTENZA LOCALE & PROGRESS BAR LIVE
// =============================================================================
function toggleCheck(el) {
  haptic("selection");
  const key = el.id;
  if (key) {
    localStorage.setItem(`virgo_chk_${key}`, el.checked ? "1" : "0");
  }
  updateAllCounters();
}

function loadChecklistState() {
  [...DAILY_IDS, ...GROCERY_IDS].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.checked = localStorage.getItem(`virgo_chk_${id}`) === "1";
    }
  });
}

function updateAllCounters() {
  // 1. Rito Mattina (4)
  const ritualIds = ["chk-acqua", "chk-occhi", "chk-social", "chk-movimento"];
  const ritualDone = ritualIds.filter(id => document.getElementById(id)?.checked).length;
  const rCounter = document.getElementById("ritual-counter");
  if (rCounter) rCounter.innerText = `${ritualDone}/4`;

  // 2. Minimo Vitale (6)
  const mvIds = ["mv-1", "mv-2", "mv-3", "mv-4", "mv-5", "mv-6"];
  const mvDone = mvIds.filter(id => document.getElementById(id)?.checked).length;
  const mvCounter = document.getElementById("mv-counter");
  if (mvCounter) mvCounter.innerText = `${mvDone}/6`;

  // 3. Progresso Totale Giornaliero (10)
  const totalDone = ritualDone + mvDone;
  const pct = Math.round((totalDone / 10) * 100);
  const pText = document.getElementById("daily-progress-text");
  const pFill = document.getElementById("daily-progress-fill");
  if (pText) pText.innerText = `${totalDone} / 10 (${pct}%)`;
  if (pFill) pFill.style.width = `${pct}%`;

  // 4. Carrello Spesa (16)
  const grDone = GROCERY_IDS.filter(id => document.getElementById(id)?.checked).length;
  const grCounter = document.getElementById("grocery-counter");
  if (grCounter) grCounter.innerText = `${grDone}/16`;

  // 5. Streak counter
  const history = JSON.parse(localStorage.getItem("virgo_checkin_history") || "[]");
  const streakEl = document.getElementById("streak-count");
  if (streakEl) {
    streakEl.innerText = Math.max(1, history.length + (totalDone >= 5 ? 1 : 0));
  }
}

// =============================================================================
// CHECK-IN SUBMISSION & STORICO
// =============================================================================
function updateEnergyVal(val) {
  document.getElementById("energy-val").innerText = `${val} / 10`;
}

function renderCheckinHistory() {
  const container = document.getElementById("checkin-history-list");
  if (!container) return;
  const history = JSON.parse(localStorage.getItem("virgo_checkin_history") || "[]");
  if (history.length === 0) {
    container.innerHTML = `<p class="card-sub" style="margin-bottom:0;">Nessun check-in ancora salvato su questo telefono.</p>`;
    return;
  }
  container.innerHTML = "";
  history.slice(-5).reverse().forEach(item => {
    const row = document.createElement("div");
    row.className = "history-item";
    const d = new Date(item.date).toLocaleDateString("it-IT", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
    row.innerHTML = `<div class="history-date">✅ ${d}</div><div class="history-text">${item.text}</div>`;
    container.appendChild(row);
  });
}

function submitCheckin(e) {
  e.preventDefault();
  haptic("success");

  const workoutVal = document.querySelector("input[name='workout_done']:checked")?.value || "Non specificato";
  const foodVal = document.querySelector("input[name='food_score']:checked")?.value || "N/A";
  const energyVal = document.getElementById("energy-slider").value;
  const notesVal = document.getElementById("checkin-notes").value.trim();

  // Spunta anche il punto 6 del Minimo Vitale
  const mv6 = document.getElementById("mv-6");
  if (mv6) {
    mv6.checked = true;
    localStorage.setItem("virgo_chk_mv-6", "1");
  }
  updateAllCounters();

  const ritualDone = ["chk-acqua", "chk-occhi", "chk-social", "chk-movimento"].filter(id => document.getElementById(id)?.checked).length;
  const mvDone = ["mv-1", "mv-2", "mv-3", "mv-4", "mv-5", "mv-6"].filter(id => document.getElementById(id)?.checked).length;

  const formattedMsg = `Check-in App: Attività=${workoutVal} | Cibo=${foodVal} | Energia=${energyVal}/10 | Disciplina=${ritualDone + mvDone}/10${notesVal ? " | Note: " + notesVal : ""}`;

  // Salva sempre nello storico locale del telefono
  const history = JSON.parse(localStorage.getItem("virgo_checkin_history") || "[]");
  history.push({ date: new Date().toISOString(), text: formattedMsg });
  localStorage.setItem("virgo_checkin_history", JSON.stringify(history));
  renderCheckinHistory();

  // Mostra feedback visivo
  const fb = document.getElementById("checkin-feedback");
  fb.className = "feedback-msg success";
  fb.style.display = "block";
  fb.innerHTML = `✅ Check-in registrato con successo!<br><small style="font-weight:400; opacity:0.85;">${formattedMsg}</small>`;

  // Se aperta da tastiera Telegram con supporto sendData, invia al bot
  if (tg?.sendData) {
    try {
      tg.sendData(formattedMsg);
    } catch (err) {
      console.warn("sendData fallback:", err);
    }
  }

  setTimeout(() => {
    fb.style.display = "none";
  }, 5000);
}
