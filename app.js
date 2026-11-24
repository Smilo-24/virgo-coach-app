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
      { hour: 9, time: "09:00", title: "Focus Operativo S07", desc: "Costruzione contatti, appuntamenti e prodotti in Sede S07." },
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
      { hour: 9, time: "09:00", title: "Focus Professionale S07", desc: "Operatività sul campo, prodotti Reale Group e clienti." },
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
// PIN 1212 (Richiesto solo la prima volta sul dispositivo)
// =============================================================================
const USER_PIN = "1212";

function checkPinAccess() {
  if (localStorage.getItem("virgo_pin_1212_ok") === "1") {
    unlockAppUI();
  }
}

function unlockWithPin() {
  const val = document.getElementById("pin-input")?.value.trim();
  if (val === USER_PIN) {
    haptic("success");
    localStorage.setItem("virgo_pin_1212_ok", "1");
    unlockAppUI();
  } else {
    haptic("warning");
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
  checkPinAccess();
  checkDailyAutoReset();
  renderSmartPhase();
  renderToday();
  selectDayWorkout(currentDayIdx);
  loadChecklistState();
  updateAllCounters();
  renderCheckinHistory();

  // Deep-link diretto alla scheda richiesta (es. ?tab=checkin, ?tab=workout, ?tab=cibo, ?tab=q360)
  const params = new URLSearchParams(window.location.search);
  const tabParam = params.get("tab");
  if (tabParam && ["oggi", "workout", "cibo", "mentori", "checkin", "q360"].includes(tabParam)) {
    switchTab(tabParam);
  }
  const foodViewParam = params.get("food");
  if (foodViewParam && ["daily", "weekly", "recipes"].includes(foodViewParam)) {
    switchFoodView(foodViewParam);
  }

  initQ360();
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

// =============================================================================
// 🧬 TAB 6: QUESTIONARIO 360° (100 DOMANDE & SYNC COL VAULT)
// =============================================================================
const Q360_QUESTIONS = [
  // AREA 1: Piatti Preferiti & Cucina (1-10)
  { id: "Q001", cat: 1, title: "I tuoi 5 piatti preferiti in assoluto", prompt: "Quali sono i 5 piatti che ami di più al mondo (oltre alla tua Gambero Pork e alle Tigelle)?" },
  { id: "Q002", cat: 1, title: "Cosa NON ti piace mangiare (Cibi che odi)", prompt: "Quali sono gli alimenti, le verdure, i condimenti o i piatti che proprio non sopporti nel piatto?" },
  { id: "Q003", cat: 1, title: "La tua colazione preferita (dolce vs salata)", prompt: "Al mattino cosa ti dà più soddisfazione mangiare quando hai tempo, e cosa nei giorni veloci?" },
  { id: "Q004", cat: 1, title: "I tuoi pranzi veloci preferiti da settimana", prompt: "Quali sono i 3-4 pranzi puliti che mangi più volentieri durante la settimana senza annoiarti?" },
  { id: "Q005", cat: 1, title: "Le tue cene preferite con Angela", prompt: "Cosa vi piace mangiare la sera a cena quando siete insieme a casa tranquilli?" },
  { id: "Q006", cat: 1, title: "I tuoi cavalli di battaglia ai fornelli", prompt: "Quando cucini tu, quali sono i piatti che ti vengono meglio e ti diverte di più preparare?" },
  { id: "Q007", cat: 1, title: "Il tuo Sgarro Reale / Comfort Food preferito", prompt: "Quando decidi di sgarrare sul serio (pizza, burger, sushi, dolci...), cosa scegli?" },
  { id: "Q008", cat: 1, title: "I cibi-trappola sotto stress o stanchezza", prompt: "Quali sono gli snack o i cibi che ti fregano di più quando torni a casa stanco o nervoso?" },
  { id: "Q009", cat: 1, title: "Cibi che ti gonfiano o ti tolgono energia", prompt: "Hai notato alimenti specifici che ti danno sonnolenza o pesantezza?" },
  { id: "Q010", cat: 1, title: "Bevande, Caffè e Ristoranti preferiti a Torino", prompt: "Quanti caffè bevi, cosa bevi a tavola e quali sono i tuoi locali preferiti a Torino?" },

  // AREA 2: Corpo, Palestra, Boxe & Corsa (11-20)
  { id: "Q011", cat: 2, title: "Altezza e Peso Forma Ideale ('Tirato')", prompt: "Quanto sei alto esattamente e a quale peso ti sei visto davvero asciutto, forte e in forma?" },
  { id: "Q012", cat: 2, title: "Cosa fai concretamente in Sala Pesi", prompt: "Che scheda o divisione muscolare segui in palestra e quali sono i tuoi esercizi fissi?" },
  { id: "Q013", cat: 2, title: "I tuoi punti di forza muscolari e carichi", prompt: "In quali esercizi (panca, trazioni, squat, manubri, dip...) ti senti più forte e che carichi usi?" },
  { id: "Q014", cat: 2, title: "Punti fisici dove vuoi migliorare", prompt: "Qual è la parte del corpo (addome/fianchi, petto, spalle, gambe) su cui vuoi spingere nei prossimi 90 giorni?" },
  { id: "Q015", cat: 2, title: "Vecchi infortuni o fastidi articolari", prompt: "Hai articolazioni o zone delicate (spalle, schiena, ginocchia, polsi) a cui fare attenzione?" },
  { id: "Q016", cat: 2, title: "La Boxe per te", prompt: "Cosa fai durante l'ora di boxe (sacco, vuoto, corda, guanti) e cosa ti dà mentalmente?" },
  { id: "Q017", cat: 2, title: "La Corsa e il Fiato", prompt: "Dove corri a Torino, qual è la tua distanza ideale (5-10 km) e corri con musica o senza?" },
  { id: "Q018", cat: 2, title: "Il tuo Sonno reale e Risveglio", prompt: "Cosa ti aiuta a dormire profondo e cosa ti rovina il sonno? Al mattino carburi subito?" },
  { id: "Q019", cat: 2, title: "Integratori e Recupero", prompt: "Usi integratori (whey, creatina, magnesio, vitamine) e cosa senti che funziona su di te?" },
  { id: "Q020", cat: 2, title: "Obiettivo Fisico a 6 Mesi", prompt: "Come vuoi vederti e sentirti fisicamente tra 6 mesi esatti?" },

  // AREA 3: YouTube, Podcast, Jim Rohn & Mentori (21-30)
  { id: "Q021", cat: 3, title: "Link YouTube e Video da farmi studiare", prompt: "Incolla qui i link dei video YouTube da cui vuoi che estragga le regole per il Vault:" },
  { id: "Q022", cat: 3, title: "Jim Rohn: i concetti che ti hanno colpito di più", prompt: "Quali insegnamenti di Jim Rohn (4 Stagioni, Semina, Disciplina, Valore...) senti più tuoi?" },
  { id: "Q023", cat: 3, title: "Podcast che ascolti o vorresti seguire", prompt: "Quali podcast italiani o stranieri ascolti quando cammini o viaggi?" },
  { id: "Q024", cat: 3, title: "Canali YouTube preferiti", prompt: "Quali sono i 4-5 canali YouTube (crescita, finanza, tech, sport) che apri più volentieri?" },
  { id: "Q025", cat: 3, title: "Il video o discorso per quando sei a terra", prompt: "C'è un video motivazionale o discorso preciso che metti in cuffia per ritrovare la fame?" },
  { id: "Q026", cat: 3, title: "Giuseppe ('Il Vero Drago') — Ricordi e consigli", prompt: "Oltre a 'nessuno deve dirti quanto vali', quali altri consigli di Giuseppe porti con te?" },
  { id: "Q027", cat: 3, title: "Luca Cucciatti e i riferimenti in S07", prompt: "Cosa apprezzi del metodo di Luca Cucciatti in Via Garibaldi 7 e cosa vuoi rubargli del mestiere?" },
  { id: "Q028", cat: 3, title: "Il Guerriero più vicino a te oggi", prompt: "Tra Goggins, Kobe, Tyson, Bruce Lee, Robbins e Dispenza, chi senti più affine a te oggi?" },
  { id: "Q029", cat: 3, title: "Un personaggio nuovo da aggiungere al Pantheon", prompt: "C'è un imprenditore, atleta o figura storica che ammiri e vuoi aggiungere al Vault?" },
  { id: "Q030", cat: 3, title: "La tua Massima Personale", prompt: "Se dovessi scrivere una frase tua da rileggere ogni mattina, quale sarebbe?" },

  // AREA 4: Libri, Film, Serie TV & Musica (31-40)
  { id: "Q031", cat: 4, title: "I 3 Libri che ti hanno cambiato la testa", prompt: "Quali sono i libri che hai letto che ti hanno lasciato il segno più profondo?" },
  { id: "Q032", cat: 4, title: "Libri sul comodino o da leggere", prompt: "Quali sono i prossimi 2-3 libri che hai a casa o vorresti leggere?" },
  { id: "Q033", cat: 4, title: "I tuoi 5 Film preferiti della vita", prompt: "Oltre a The Founder, Rocky e Cinderella Man, quali film rivedresti dieci volte?" },
  { id: "Q034", cat: 4, title: "La scena cinematografica che ti dà i brividi", prompt: "Qual è la scena specifica di un film in cui ti identifichi di più?" },
  { id: "Q035", cat: 4, title: "Serie TV, Documentari o Anime preferiti", prompt: "Quali serie TV (es. The Chosen, Peaky Blinders, Suits, Billions...) o anime ami di più?" },
  { id: "Q036", cat: 4, title: "La tua Musica da Guerra (Palestra & Boxe)", prompt: "Che generi, artisti o canzoni metti in cuffia quando spingi sotto i pesi o al sacco?" },
  { id: "Q037", cat: 4, title: "La tua Musica da Concentrazione o Relax", prompt: "Cosa ascolti quando studi/lavori al PC o quando vuoi rilassare la mente?" },
  { id: "Q038", cat: 4, title: "Una canzone che rappresenta la tua storia", prompt: "Quale canzone racconta meglio chi sei e da dove vieni?" },
  { id: "Q039", cat: 4, title: "Biografie e Storie di Underdog", prompt: "Quale storia vera di riscatto (nello sport o nel business) ti ispira di più?" },
  { id: "Q040", cat: 4, title: "Il tuo metodo ideale di apprendimento", prompt: "Quando studi una materia nuova, impari meglio da video, schemi pratici, libri o quiz?" },

  // AREA 5: Viaggi, Esperienze & Stile di Vita (41-50)
  { id: "Q041", cat: 5, title: "Il viaggio più bello che hai fatto finora", prompt: "Qual è stato il viaggio o il posto che ti è rimasto più nel cuore e perché?" },
  { id: "Q042", cat: 5, title: "Gli anni dei viaggi e festival in Europa (2022–2024)", prompt: "Dove sei stato in quegli anni, quali festival/città hai visto e cosa ti hanno lasciato?" },
  { id: "Q043", cat: 5, title: "I 3 viaggi che sogni di fare con Angela", prompt: "Quali sono le prime 3 mete dove vuoi portare Angela appena le finanze girano forte?" },
  { id: "Q044", cat: 5, title: "Mare, Montagna o Città?", prompt: "Quando hai una settimana di vacanza vera, quale ambiente ti ricarica di più?" },
  { id: "Q045", cat: 5, title: "La tua Domenica perfetta a Torino", prompt: "Come si svolge dalla mattina alla sera una domenica ideale per te e Angela?" },
  { id: "Q046", cat: 5, title: "I tuoi luoghi del cuore a Torino", prompt: "Quali sono i parchi, le vie o i quartieri di Torino dove ti piace di più camminare?" },
  { id: "Q047", cat: 5, title: "Passioni e Hobby fuori dal lavoro", prompt: "Cosa ti appassiona (cucina, motori, orologi, scacchi, gaming, natura...) quando stacchi?" },
  { id: "Q048", cat: 5, title: "Un'esperienza da fare almeno una volta nella vita", prompt: "Qual è un'esperienza speciale che vuoi assolutamente vivere nei prossimi anni?" },
  { id: "Q049", cat: 5, title: "La tua Casa Ideale", prompt: "Come immagini la casa in cui vorrai vivere con Angela e i vostri figli?" },
  { id: "Q050", cat: 5, title: "Stile, Auto e Oggetti che ti piacciono", prompt: "Come ti piace vestirti e qual è l'auto o l'oggetto che vorrai comprarti coi primi grandi risultati?" },

  // AREA 6: Angela, Coppia & Futuro Familiare (51-60)
  { id: "Q051", cat: 6, title: "Il lavoro di Angela (Specializzazione & Ritmi)", prompt: "In quale reparto/specializzazione medica lavora Angela e che orari/turni fa?" },
  { id: "Q052", cat: 6, title: "Date Importanti (Compleanno Angela & Anniversario)", prompt: "Qual è la data del compleanno di Angela e qual è la data del vostro anniversario?" },
  { id: "Q053", cat: 6, title: "Cosa ami di più di Angela", prompt: "Quali sono i 3 lati del carattere di Angela che ti hanno fatto capire che è la donna della tua vita?" },
  { id: "Q054", cat: 6, title: "Cosa fa felice Angela nei piccoli gesti", prompt: "Qual è l'attenzione a casa o il piatto preparato da te che le strappa subito il sorriso?" },
  { id: "Q055", cat: 6, title: "La vostra organizzazione domestica", prompt: "Come vi dividete spesa, cucina e casa, e dove dai il tuo meglio nella convivenza?" },
  { id: "Q056", cat: 6, title: "Come superate i momenti di stanchezza/tensione", prompt: "Qual è il modo migliore tra voi per parlarvi e sciogliere subito lo stress?" },
  { id: "Q057", cat: 6, title: "La famiglia di Angela", prompt: "Come si chiamano i genitori/familiari di Angela e che rapporto hai con loro?" },
  { id: "Q058", cat: 6, title: "I vostri 3 Obiettivi di Coppia per il 2027", prompt: "Quali sono i 3 traguardi concreti che volete raggiungere insieme entro fine 2027?" },
  { id: "Q059", cat: 6, title: "Matrimonio e Paternità", prompt: "Come immagini il vostro matrimonio e che tipo di papà vuoi essere per i tuoi figli?" },
  { id: "Q060", cat: 6, title: "La promessa a te stesso per Angela", prompt: "Qual è la sicurezza materiale e umana che vuoi garantire ad Angela nei prossimi 3 anni?" },

  // AREA 7: Radici, Mamma, Famiglia & Amicizie (61-70)
  { id: "Q061", cat: 7, title: "Le tue origini e dove sei cresciuto", prompt: "Dove sei nato esattamente, in che quartiere/città sei cresciuto e che ricordi hai?" },
  { id: "Q062", cat: 7, title: "Tua Mamma", prompt: "Come si chiama tua mamma, quanti anni ha, che lavoro ha fatto e che legame avete?" },
  { id: "Q063", cat: 7, title: "Il tuo sogno per tua Mamma", prompt: "Cosa vuoi fare concretamente per 'sistemare tua madre' appena avrai solidità finanziaria?" },
  { id: "Q064", cat: 7, title: "Tuo Papà", prompt: "Qual è la storia di tuo papà, che rapporto hai con lui e cosa ti ha insegnato?" },
  { id: "Q065", cat: 7, title: "Fratelli o Sorelle", prompt: "Come si chiama tua sorella (o fratelli), cosa fa nella vita e che rapporto avete?" },
  { id: "Q066", cat: 7, title: "L'episodio di gioventù che ti ha forgiato", prompt: "C'è un momento preciso di quando eri ragazzo che ti ha fatto crescere in fretta?" },
  { id: "Q067", cat: 7, title: "Valori e limiti familiari", prompt: "Qual è il valore più bello ricevuto dalla tua famiglia e quale limite vuoi spezzare?" },
  { id: "Q068", cat: 7, title: "Gli Amici Veri di oggi", prompt: "Chi sono oggi i 2-3 amici fidati che senti davvero vicini e puliti?" },
  { id: "Q069", cat: 7, title: "Le qualità del tuo cerchio ristretto", prompt: "Quali qualità deve avere oggi una persona per meritare il tuo tempo e la tua fiducia?" },
  { id: "Q070", cat: 7, title: "Il tuo compleanno (24 Agosto) e anno di nascita", prompt: "Qual è il tuo anno di nascita esatto e come ti piace festeggiare i traguardi?" },

  // AREA 8: Passato Lavorativo, Spese Fisse & Trincea (71-80)
  { id: "Q071", cat: 8, title: "I lavori fatti prima dell'informatica", prompt: "Quali lavori hai svolto tra i 16 e i 23 anni (cucina/ristorazione, turni, altro)?" },
  { id: "Q072", cat: 8, title: "Cosa ti ha insegnato il lavoro duro", prompt: "Cosa ti hanno lasciato quei lavori sulla fatica fisica, la velocità e il valore dei soldi?" },
  { id: "Q073", cat: 8, title: "Il meglio dei tuoi anni nell'IT", prompt: "Tra Pitagora, Targa Telematics, Wave e Bootcamp, qual è la competenza migliore che ti porti dietro?" },
  { id: "Q074", cat: 8, title: "Spese Fisse Mensili esatte (Voce per Voce)", prompt: "Quanto ti esce ogni mese (quota affitto/bollette, spesa, palestra, telefono, trasporti)?" },
  { id: "Q075", cat: 8, title: "Soglia di Pareggio e Soglia di Tranquillità", prompt: "Qual è la cifra netta mensile minima per stare in pareggio e quale per respirare?" },
  { id: "Q076", cat: 8, title: "Allocazione accredito S07 e prime provvigioni", prompt: "Appena entrano i 500 € dell'Academy e le prime provvigioni, come li dividi?" },
  { id: "Q077", cat: 8, title: "Il primo 'Respiro' sopra i 3.000–5.000 €", prompt: "Quando il conto tornerà sopra i 3-5k€ sicuri, qual è il primo regalo che farai a te e Angela?" },
  { id: "Q078", cat: 8, title: "Il tuo rapporto profondo con il denaro", prompt: "Cosa rappresentano per te i soldi (non dipendere da nessuno, rispetto, protezione, libertà)?" },
  { id: "Q079", cat: 8, title: "Il tuo punto di forza naturale coi clienti", prompt: "Nella consulenza in S07, qual è la tua dote migliore quando parli faccia a faccia con le persone?" },
  { id: "Q080", cat: 8, title: "L'abilità commerciale su cui vuoi diventare letale", prompt: "Su quale fase (chiamata, referenze, chiusura, gestione obiezioni) vuoi migliorare di più?" },

  // AREA 9: Psicologia, Trigger, Carattere & Punti Ciechi (81-90)
  { id: "Q081", cat: 9, title: "I tuoi 3 Trigger Negativi principali", prompt: "Quali sono le 3 situazioni o comportamenti che ti fanno salire il nervoso più in fretta?" },
  { id: "Q082", cat: 9, title: "Cosa ti spegne l'energia silenziosamente", prompt: "Quali sono le cose che ti svuotano di energia mentale e ti portano a chiuderti in silenzio?" },
  { id: "Q083", cat: 9, title: "La tua mente sotto pressione estrema", prompt: "Quando sei a 100 € sul conto e sotto pressione, a cosa pensi appena sveglio o la sera a letto?" },
  { id: "Q084", cat: 9, title: "Il segnale d'allarme del sovraccarico", prompt: "Qual è il primo campanello che indica che stai tirando troppo la corda?" },
  { id: "Q085", cat: 9, title: "Il tuo più grande Pregio Caratteriale", prompt: "Qual è la qualità di Simone di cui vai più fiero e che nessuno potrà mai toglierti?" },
  { id: "Q086", cat: 9, title: "Il Difetto o Punto Cieco da governare", prompt: "Qual è il lato del tuo carattere (impazienza, tutto-o-niente, orgoglio...) che vuoi domare?" },
  { id: "Q087", cat: 9, title: "Cosa non tolleri negli altri", prompt: "Qual è l'atteggiamento umano (vittimismo, scuse, mancanza di parola) che ti fa chiudere subito?" },
  { id: "Q088", cat: 9, title: "Cosa ti rimette in bolla in 30 minuti", prompt: "Dopo una giornata pesantissima, qual è l'azione concreta che in mezz'ora ti riporta centrato?" },
  { id: "Q089", cat: 9, title: "Rivincita sugli altri vs Vittoria per te", prompt: "Quanto conta (1-10) dimostrare chi sei a chi dubitava, rispetto a vincere per te e Angela?" },
  { id: "Q090", cat: 9, title: "Come vuoi che Virgo ti parli nei giorni duri", prompt: "Oltre a zero compassione, quali domande o ordini operativi ti sbloccano più velocemente?" },

  // AREA 10: Fede, Operatività S07 & Visione 5-10 Anni (91-100)
  { id: "Q091", cat: 10, title: "La tua Preghiera e il dialogo con Dio", prompt: "Come vivi la fede nella giornata reale (preghi al mattino/sera, parli con Dio camminando)?" },
  { id: "Q092", cat: 10, title: "Il Versetto o Episodio Biblico più tuo", prompt: "C'è un episodio della vita di Gesù (o di The Chosen) che ti dà più forza nella fatica?" },
  { id: "Q093", cat: 10, title: "Dove hai sentito la mano di Dio nella tua vita", prompt: "Guardando indietro (es. l'incontro con Angela), dove hai sentito che non era un caso?" },
  { id: "Q094", cat: 10, title: "I primi 10 Contatti Caldi su Torino per S07", prompt: "Chi sono le prime persone (amici, conoscenti, parenti a Torino) da incontrare per S07?" },
  { id: "Q095", cat: 10, title: "I Prodotti Reale Group su cui vuoi puntare subito", prompt: "Tra Protezione Persona (TCM/Salute), Welfare e Risparmio, quale senti più forte per iniziare?" },
  { id: "Q096", cat: 10, title: "Obiettivo Numerico S07 a 90 giorni", prompt: "Quanti appuntamenti a settimana e quanti primi contratti ti poni come target entro febbraio?" },
  { id: "Q097", cat: 10, title: "Traguardo Esame OCF (Consulente Finanziario)", prompt: "Entro quale mese del 2027 vuoi sostenere e superare l'esame OCF?" },
  { id: "Q098", cat: 10, title: "Il ruolo futuro del Trading Quantitativo (Neo)", prompt: "Una volta stabilizzate le entrate S07, che posto avrà il trading nella tua settimana?" },
  { id: "Q099", cat: 10, title: "Dove sarai tra 12 Mesi (24 Novembre 2027)", prompt: "Descrivi la tua giornata, il tuo conto, il tuo fisico e la tua casa con Angela tra un anno esatto:" },
  { id: "Q100", cat: 10, title: "Messaggio del Simone di oggi (a 100 €) al Simone del 2031", prompt: "Cosa vuoi lasciare scritto oggi dal fondo della trincea al te stesso che avrà costruito tutto?" }
];

let q360FilterMode = "all"; // all | todo | done
let q360Answers = {};
let q360DebounceTimer = null;

function initQ360() {
  try {
    q360Answers = JSON.parse(localStorage.getItem("virgo_q360_answers") || "{}");
  } catch (e) {
    q360Answers = {};
  }
  const savedYt = localStorage.getItem("virgo_q360_yt_links") || "";
  const ytEl = document.getElementById("q360-yt-links");
  if (ytEl) ytEl.value = savedYt;

  renderQ360List();
  updateQ360Progress();

  // Se siamo su PC col bot attivo, carica eventuali risposte già presenti nel Vault
  fetch("http://127.0.0.1:8765/api/q360", { method: "GET" })
    .then(r => r.ok ? r.json() : null)
    .then(data => {
      if (data && data.answers) {
        let changed = false;
        Object.keys(data.answers).forEach(k => {
          if (data.answers[k] && !q360Answers[k]) {
            q360Answers[k] = data.answers[k];
            changed = true;
          }
        });
        if (data.yt_links && !localStorage.getItem("virgo_q360_yt_links")) {
          localStorage.setItem("virgo_q360_yt_links", data.yt_links);
          if (ytEl) ytEl.value = data.yt_links;
        }
        if (changed) {
          localStorage.setItem("virgo_q360_answers", JSON.stringify(q360Answers));
          renderQ360List();
          updateQ360Progress();
        }
      }
    })
    .catch(() => {});
}

function setQ360Filter(mode) {
  haptic("light");
  q360FilterMode = mode;
  ["all", "todo", "done"].forEach(m => {
    const btn = document.getElementById(`qfilter-${m}`);
    if (btn) btn.classList.toggle("active", m === mode);
  });
  renderQ360List();
}

function renderQ360List() {
  const container = document.getElementById("q360-questions-container");
  if (!container) return;
  const catVal = document.getElementById("q360-cat-select")?.value || "all";

  container.innerHTML = "";
  const filtered = Q360_QUESTIONS.filter(q => {
    if (catVal !== "all" && String(q.cat) !== String(catVal)) return false;
    const ans = (q360Answers[q.id] || "").trim();
    if (q360FilterMode === "todo" && ans.length > 0) return false;
    if (q360FilterMode === "done" && ans.length === 0) return false;
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="card"><p class="card-sub" style="margin:0;">Nessuna domanda in questo filtro.</p></div>`;
    return;
  }

  filtered.forEach(q => {
    const val = q360Answers[q.id] || "";
    const isAnswered = val.trim().length > 0;
    const card = document.createElement("div");
    card.className = "q360-item-card" + (isAnswered ? " answered" : "");
    card.id = `card-${q.id}`;
    card.innerHTML = `
      <div class="q360-item-top">
        <span class="q360-code">${q.id}</span>
        <span class="q360-status-badge" id="badge-${q.id}">${isAnswered ? "✅ Salvata" : "⬜ Da compilare"}</span>
      </div>
      <div class="q360-title">${q.title}</div>
      <div class="q360-prompt">${q.prompt}</div>
      <textarea class="q360-input" id="input-${q.id}" placeholder="Scrivi qui la tua risposta (anche a voce col microfono della tastiera)..." oninput="onQ360Input('${q.id}', this.value)"></textarea>
    `;
    container.appendChild(card);
    const ta = card.querySelector("textarea");
    if (ta) ta.value = val;
  });
}

function onQ360Input(qid, val) {
  const clean = val.trim();
  if (clean) {
    q360Answers[qid] = val;
  } else {
    delete q360Answers[qid];
  }
  localStorage.setItem("virgo_q360_answers", JSON.stringify(q360Answers));

  const card = document.getElementById(`card-${qid}`);
  const badge = document.getElementById(`badge-${qid}`);
  if (card) card.classList.toggle("answered", clean.length > 0);
  if (badge) badge.innerText = clean.length > 0 ? "✅ Salvata" : "⬜ Da compilare";

  updateQ360Progress();
  scheduleLocalVaultAutoSync();
}

function saveQ360YoutubeLinks(val) {
  localStorage.setItem("virgo_q360_yt_links", val);
  scheduleLocalVaultAutoSync();
}

function updateQ360Progress() {
  const answeredCount = Q360_QUESTIONS.filter(q => (q360Answers[q.id] || "").trim().length > 0).length;
  const pct = Math.round((answeredCount / 100) * 100);
  const pText = document.getElementById("q360-progress-text");
  const pFill = document.getElementById("q360-progress-fill");
  if (pText) pText.innerText = `${answeredCount} / 100 (${pct}%)`;
  if (pFill) pFill.style.width = `${pct}%`;
}

function scheduleLocalVaultAutoSync() {
  if (q360DebounceTimer) clearTimeout(q360DebounceTimer);
  q360DebounceTimer = setTimeout(() => {
    pushQ360ToLocalServer(false);
  }, 900);
}

function pushQ360ToLocalServer(showFeedback = false) {
  const ytLinks = localStorage.getItem("virgo_q360_yt_links") || "";
  return fetch("http://127.0.0.1:8765/api/q360", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers: q360Answers, yt_links: ytLinks })
  })
    .then(r => r.ok ? r.json() : Promise.reject("non raggiungibile"))
    .then(res => {
      if (showFeedback) {
        showQ360Feedback(`✅ Salvato direttamente in 05_mente/QUESTIONARIO_360.md (${res.updated || 0} risposte)!`);
      }
      return true;
    })
    .catch(() => false);
}

function showQ360Feedback(htmlMsg) {
  const fb = document.getElementById("q360-sync-feedback");
  if (!fb) return;
  fb.className = "feedback-msg success";
  fb.style.display = "block";
  fb.innerHTML = htmlMsg;
  setTimeout(() => {
    fb.style.display = "none";
  }, 5500);
}

async function syncQ360ToVault() {
  haptic("success");
  const ytLinks = (localStorage.getItem("virgo_q360_yt_links") || "").trim();
  const cleanAnswers = {};
  Object.keys(q360Answers).forEach(k => {
    const v = (q360Answers[k] || "").trim();
    if (v) cleanAnswers[k] = v;
  });

  const count = Object.keys(cleanAnswers).length;
  if (count === 0 && !ytLinks) {
    showQ360Feedback("✍️ Compila almeno una risposta o incolla un link YouTube prima di sincronizzare!");
    return;
  }

  // 1. Prova il salvataggio diretto locale su PC (http://127.0.0.1:8765/api/q360)
  const localOk = await pushQ360ToLocalServer(true);
  if (localOk) return;

  // 2. Se siamo da Telefono (Telegram Mini App), invia via tg.sendData (fino a 4000 byte)
  const payloadObj = { answers: cleanAnswers, yt: ytLinks };
  const payloadStr = "Q360_SYNC:" + JSON.stringify(payloadObj);

  if (tg?.sendData && payloadStr.length <= 4000) {
    try {
      tg.sendData(payloadStr);
      showQ360Feedback(`✅ ${count} risposte inviate a @VirgoCoach_bot per il Vault!`);
      return;
    } catch (e) {
      console.warn("tg.sendData fallback:", e);
    }
  }

  // 3. Fallback universale: copia negli appunti il blocco formattato pronto da incollare in chat Telegram
  await copyQ360Answers(true);
}

async function copyQ360Answers(fromSyncFallback = false) {
  haptic("light");
  const ytLinks = (localStorage.getItem("virgo_q360_yt_links") || "").trim();
  const lines = ["Q360_BATCH:"];
  if (ytLinks) {
    lines.push(`YT: ${ytLinks.replace(/\n+/g, " | ")}`);
  }
  Q360_QUESTIONS.forEach(q => {
    const v = (q360Answers[q.id] || "").trim();
    if (v) {
      lines.push(`${q.id}: ${v.replace(/\n+/g, " ")}`);
    }
  });

  if (lines.length <= 1) {
    showQ360Feedback("Nessuna risposta ancora compilata da copiare.");
    return;
  }

  const textToCopy = lines.join("\n");
  try {
    await navigator.clipboard.writeText(textToCopy);
    if (fromSyncFallback) {
      showQ360Feedback(`📋 Risposte salvate sul telefono e copiate negli appunti! Incollale nella chat di @VirgoCoach_bot per scriverle subito nel Vault.`);
    } else {
      showQ360Feedback(`📋 ${lines.length - 1} risposte copiate! Puoi incollarle nella chat di @VirgoCoach_bot.`);
    }
  } catch (e) {
    showQ360Feedback("✅ Risposte salvate nella memoria del dispositivo!");
  }
}
