import type { Eyebrow, ImageSlotContent, WorkshopEntry, WorkshopsPageContent } from './types'

/**
 * Catalogul de workshopuri de performanță umană.
 *
 * Aceeași regulă ca la homepage și la paginile interioare: acesta este ȘI
 * fallback-ul când CMS-ul n-a fost completat, ȘI sursa din care `pnpm seed`
 * populează colecția `workshops`. Un singur text, deci cele două nu pot devia.
 *
 * Textul vine din catalogul livrat de clientă („Catalog Workshopuri Performanță
 * Umană"), rescris pentru web: fraza de deschidere a fiecărui workshop este
 * autonomă și citabilă fără context, pentru că exact aceea o extrag motoarele
 * de răspuns (brief §9.1).
 *
 * ## De ce partea comună stă separat
 *
 * În catalogul original, fiecare dintre cele 14 workshopuri repetă cuvânt cu
 * cuvânt aceleași cinci blocuri: durata, pauza de prânz, ce e inclus, prețul,
 * „Cum se desfășoară" și „Pentru cine este potrivit". Puse toate în pagină, ar
 * însemna paisprezece copii ale aceluiași paragraf pe o singură adresă — adică
 * exact tiparul pe care Google îl tratează ca umplutură.
 *
 * Aici sunt scrise O SINGURĂ DATĂ, în `WORKSHOP_COMMON`, și se randează o
 * singură dată, în capul paginii. Fiecare workshop păstrează doar ce îl
 * deosebește de celelalte, inclusiv fraza proprie despre ce se lucrează în
 * ziua respectivă (`workMethod`).
 *
 * Diacritice cu virgulă: ș (U+0219), ț (U+021B). Niciodată sedilă.
 */

/** Prețul unui loc, în lei. Identic pentru toate workshopurile din serie. */
export const WORKSHOP_PRICE = 510

export const WORKSHOP_CURRENCY = 'RON'

/**
 * Câte workshopuri se pot cumpăra la un moment dat.
 *
 * Regula clientei: sunt de vânzare întotdeauna doar următoarele trei ediții
 * programate. Restul catalogului rămâne vizibil, fără buton de plată — se pot
 * anunța interesul, iar Adriana programează ediția când se strânge un grup.
 *
 * Fereastra se mută singură: nu există „workshopul 1, 2 și 3", ci „primele trei
 * cu dată în viitor". Când 17 octombrie trece, locul lui în fereastră îl ia
 * următorul workshop căruia i s-a pus o dată în admin. Nimeni nu trebuie să
 * bifeze sau să debifeze nimic.
 */
export const PURCHASABLE_WINDOW = 3

/** Partea identică pentru toate workshopurile din serie. Se scrie o dată. */
export const WORKSHOP_COMMON = {
  duration: '8 ore',
  schedule: '09:00–17:00',
  lunchBreak: '13:00–14:00 — masa de prânz nu este inclusă',
  included: 'Coffee break între module și materialele de curs',
  location: 'Timișoara, în grup restrâns',
  format: 'Fizic, față în față',

  /**
   * Textul lui „Cum se desfășoară", identic în catalog la toate cele 14.
   * Aici apare o singură dată, deasupra listei.
   */
  howItWorks:
    'Fiecare workshop se desfășoară fizic, în Timișoara, într-un grup restrâns, între orele 09:00 și 17:00. Ziua este împărțită în patru module de lucru, cu pauze de cafea între ele și pauză de prânz între 13:00 și 14:00. Masa de prânz nu este inclusă. Sunt asigurate coffee break-ul între module și materialele de curs.',

  /** „Pentru cine este potrivit", tot identic la toate cele 14. */
  forWho:
    'Pentru antreprenori, manageri, profesioniști și persoane care vor să își dezvolte competențe aplicabile în business și în viața profesională, pornind de la modul în care gândesc, decid, comunică și acționează.',

  differentiators: [
    'Accent pe aplicare, nu pe acumularea de teorie.',
    'Exerciții, reflecție, studii de caz, simulări și situații reale.',
    'Instrumente transferabile imediat în activitatea profesională.',
    'Lucru cu omul din spatele rolului de antreprenor, manager sau profesionist.',
    'Materiale de curs incluse și coffee break între module.',
  ],

  /** Programul orientativ al zilei. Se randează ca `<table>` semantic. */
  agenda: [
    { time: '09:00–11:00', body: 'Modul I — înțelegere, concepte și autoevaluare' },
    { time: '11:00–11:15', body: 'Coffee break' },
    { time: '11:15–13:00', body: 'Modul II — exerciții, analiză și aplicare' },
    { time: '13:00–14:00', body: 'Pauză de prânz — masa nu este inclusă' },
    { time: '14:00–15:30', body: 'Modul III — studii de caz, simulări și practică' },
    { time: '15:30–15:45', body: 'Coffee break' },
    { time: '15:45–17:00', body: 'Modul IV — integrare, feedback și plan personal de aplicare' },
  ],
} as const

/* -------------------------------------------------------------------------- */
/* Cele 14 workshopuri                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Ordinea din catalog: firul logic al seriei, de la autocunoaștere la
 * performanță sustenabilă. NU este ordinea în care se afișează în pagină —
 * acolo urcă întâi cele cu dată, în ordinea desfășurării (vezi `lib/workshops`).
 *
 * `sessionDate` este ISO, fără oră: ziua e aceeași în orice fus, iar ora de
 * început e oricum aceeași pentru toate (09:00) și stă în `WORKSHOP_COMMON`.
 */
export const workshopEntries: WorkshopEntry[] = [
  {
    slug: 'busola-interna',
    title: 'Busola internă',
    subtitle: 'Valori, priorități și decizii pentru antreprenori și profesioniști',
    sessionDate: '2026-10-17',
    summary:
      'Un workshop practic despre criteriile invizibile după care alegi. Lucrăm cu valorile, prioritățile și conflictele dintre ceea ce consideri important și ceea ce faci în realitate.',
    what: 'Busola internă este un workshop practic despre criteriile invizibile care ne conduc alegerile. Lucrăm cu valori, priorități, identitate profesională și conflictele dintre ceea ce considerăm important și ceea ce facem în realitate.',
    problems:
      'Când toate par urgente și importante, devine dificil să alegi. Poți amâna decizii, poți spune „da" unor proiecte care nu te mai reprezintă, poți lua decizii pentru a evita dezamăgirea altora sau poți construi un business care crește, dar nu mai este în acord cu viața pe care vrei să o ai.',
    workMethod:
      'Vei lucra pe situații reale de decizie, vei identifica valorile care îți influențează alegerile, vei analiza conflictele dintre roluri și priorități și vei construi criterii personale de decizie.',
    outcomes: [
      'o hartă mai clară a valorilor și priorităților tale',
      'criterii concrete pentru decizii importante',
      'identificarea conflictelor dintre ceea ce vrei și ceea ce faci',
      'un instrument personal de clarificare a alegerilor',
    ],
    keywords: [
      'workshop valori personale',
      'curs luarea deciziilor',
      'claritate în business',
      'priorități antreprenori',
      'curs dezvoltare profesională Timișoara',
    ],
  },
  {
    slug: 'sub-presiune',
    title: 'Sub presiune',
    subtitle: 'Inteligență emoțională și autoreglare în business și viața profesională',
    sessionDate: '2026-11-14',
    summary:
      'Inteligența emoțională tratată ca o competență de performanță, nu ca teorie despre emoții: cum recunoști ce se întâmplă emoțional înainte ca emoția să preia conducerea comportamentului.',
    what: 'Sub presiune este un workshop despre capacitatea de a recunoaște ceea ce se întâmplă emoțional înainte ca emoția să preia conducerea comportamentului. Inteligența emoțională este tratată ca o competență de performanță, nu ca simplă teorie despre emoții.',
    problems:
      'Un client pleacă, un angajat greșește, încasările scad, apare un conflict sau o decizie dificilă. În astfel de momente, frica, furia, vinovăția, frustrarea sau nevoia de control pot influența comportamentul și calitatea deciziilor.',
    workMethod:
      'Identificăm triggerii, reacțiile automate și legătura dintre interpretare, emoție și comportament, apoi exersăm instrumente de autoreglare și de schimbare a perspectivei.',
    outcomes: [
      'o hartă a principalilor tăi declanșatori',
      'o mai bună diferențiere între emoție și acțiune',
      'instrumente de autoreglare în situații tensionate',
      'mai mult spațiu între ceea ce simți și ceea ce alegi să faci',
    ],
    keywords: [
      'curs inteligență emoțională',
      'workshop gestionarea emoțiilor',
      'autoreglare emoțională',
      'stres antreprenori',
      'inteligență emoțională Timișoara',
    ],
  },
  {
    slug: 'spatiul-dintre-stimul-si-raspuns',
    title: 'Spațiul dintre stimul și răspuns',
    subtitle: 'De la reactivitate la proactivitate și responsabilitate personală',
    sessionDate: '2026-12-12',
    summary:
      'Proactivitatea nu înseamnă optimism forțat, ci capacitatea de a identifica ce depinde de tine și de a-ți asuma răspunsul pe care îl alegi.',
    what: 'Acest workshop explorează mecanismul dintre stimul și răspuns. Proactivitatea nu înseamnă optimism forțat, ci capacitatea de a identifica ce depinde de tine și de a-ți asuma răspunsul pe care îl alegi.',
    problems:
      '„Nu am ce să fac", „piața este de vină", „angajatul m-a făcut să reacționez așa". Există multe lucruri pe care nu le putem controla. Problema apare când investim toată energia în ele și pierdem din vedere zona în care încă putem alege și acționa.',
    workMethod:
      'Lucrăm cu cercul controlului, limbajul reactiv, responsabilitatea personală, justificările și situațiile în care reacția automată poate fi înlocuită cu un răspuns ales.',
    outcomes: [
      'claritate asupra lucrurilor pe care le poți influența',
      'identificarea propriului limbaj reactiv',
      'un model pentru transformarea reacției în alegere',
      'un plan de acțiune pentru o situație reală în care ai rămas blocat',
    ],
    keywords: [
      'curs proactivitate',
      'workshop reactivitate proactivitate',
      'responsabilitate personală',
      'comportament proactiv',
      'dezvoltare profesională Timișoara',
    ],
  },
  {
    slug: 'dincolo-de-prima-concluzie',
    title: 'Dincolo de prima concluzie',
    subtitle: 'Gândire critică pentru decizii mai bune în business',
    sessionDate: null,
    summary:
      'Un workshop despre diferența dintre fapt, interpretare și presupunere, și despre cum se verifică informația înainte de a decide pe baza ei.',
    what: 'Dincolo de prima concluzie este un workshop despre diferența dintre fapt, interpretare și presupunere. Dezvoltă capacitatea de a verifica informația, de a analiza alternative și de a evita concluziile automate.',
    problems:
      '„Clientul nu cumpără pentru că prețul este prea mare." „Angajatului nu îi pasă." „Piața nu merge." Poate fi adevărat. Dar poate exista și o altă explicație. O decizie bună construită pe o problemă definită greșit rămâne o decizie costisitoare.',
    workMethod:
      'Folosim situații de business, întrebări critice, exerciții de perspectivă și analiză pentru a observa filtrele mentale și modul în care acestea influențează decizia.',
    outcomes: [
      'un proces de separare a faptelor de interpretări',
      'întrebări pentru verificarea presupunerilor',
      'mai multe perspective înaintea unei decizii',
      'un cadru de analiză pentru situații complexe',
    ],
    keywords: [
      'curs gândire critică',
      'critical thinking training',
      'decizii antreprenori',
      'gândire critică Timișoara',
      'workshop luarea deciziilor',
    ],
  },
  {
    slug: 'din-problema-in-directie',
    title: 'Din problemă în direcție',
    subtitle: 'Problem solving: de la blocaj la soluție, decizie și acțiune',
    sessionDate: null,
    summary:
      'Un mod structurat de a analiza o problemă: simptom, cauză, opțiuni, criterii, decizie, acțiune și evaluare.',
    what: 'Workshopul dezvoltă un mod structurat de a analiza o problemă: simptom, cauză, opțiuni, criterii, decizie, acțiune și evaluare.',
    problems:
      'Antreprenorii și managerii rezolvă probleme zilnic. Dar există o diferență între a stinge permanent incendii și a înțelege de ce apar. Problemele prost definite generează soluții temporare, consum de timp și repetarea acelorași situații.',
    workMethod:
      'Lucrăm pe probleme reale, identificăm cauza versus simptomul, generăm alternative, stabilim criterii de alegere și transformăm soluția într-un plan de acțiune.',
    outcomes: [
      'un proces practic: problemă → cauză → opțiuni → decizie → acțiune → evaluare',
      'capacitatea de a formula mai bine problema',
      'instrumente pentru generarea alternativelor',
      'un plan aplicat pe o problemă concretă',
    ],
    keywords: [
      'curs problem solving',
      'rezolvarea problemelor',
      'workshop soluționarea problemelor',
      'decizii în business',
      'curs antreprenori Timișoara',
    ],
  },
  {
    slug: 'cand-planul-nu-mai-functioneaza',
    title: 'Când planul nu mai funcționează',
    subtitle: 'Reziliență pentru antreprenori, manageri și profesioniști',
    sessionDate: null,
    summary:
      'Reziliența ca abilitate de revenire, recalibrare și continuare — nu ca negare a dificultății.',
    what: 'Când planul nu mai funcționează este un workshop despre reziliență ca abilitate de revenire, recalibrare și continuare, nu despre negarea dificultății.',
    problems:
      'Eșecul, pierderea unui client, o investiție care nu produce rezultatul anticipat, schimbarea pieței sau o perioadă dificilă fac parte din realitatea profesională. Diferența o face și timpul de care ai nevoie pentru a reveni la funcționare.',
    workMethod:
      'Analizăm răspunsul personal la dificultate, toleranța la incertitudine, resursele disponibile, perspectiva și strategiile prin care revenim la acțiune.',
    outcomes: [
      'o mai bună înțelegere a răspunsului tău la dificultate',
      'identificarea resurselor personale de revenire',
      'instrumente pentru gestionarea perioadelor de presiune',
      'un model personal de revenire și recalibrare',
    ],
    keywords: [
      'curs reziliență',
      'workshop reziliență Timișoara',
      'reziliență antreprenori',
      'gestionarea stresului',
      'performanță sub presiune',
    ],
  },
  {
    slug: 'schimba-strategia-nu-directia',
    title: 'Schimbă strategia, nu direcția',
    subtitle: 'Adaptabilitate și flexibilitate în contexte profesionale în schimbare',
    sessionDate: null,
    summary:
      'Adaptabilitatea ca abilitate de a păstra direcția, dar de a modifica strategia atunci când contextul o cere.',
    what: 'Workshopul dezvoltă adaptabilitatea ca abilitate de a păstra direcția, dar de a modifica strategia atunci când contextul o cere.',
    problems:
      'Piața, tehnologia, clienții și echipele se schimbă. Uneori ceea ce a produs succes ieri poate deveni blocajul de mâine. Rigiditatea, atașamentul de o strategie veche și nevoia de certitudine pot încetini adaptarea.',
    workMethod:
      'Lucrăm cu rezistența la schimbare, flexibilitatea cognitivă, scenariile alternative, experimentarea și identificarea strategiilor care trebuie păstrate, ajustate sau abandonate.',
    outcomes: [
      'claritate asupra modului în care reacționezi la schimbare',
      'identificarea zonelor de rigiditate',
      'un cadru pentru evaluarea strategiilor',
      'mai multă flexibilitate în fața incertitudinii',
    ],
    keywords: [
      'curs adaptabilitate',
      'workshop adaptabilitate',
      'gestionarea schimbării',
      'flexibilitate profesională',
      'change management personal Timișoara',
    ],
  },
  {
    slug: 'dincolo-de-cuvinte',
    title: 'Dincolo de cuvinte',
    subtitle: 'Ascultare activă pentru relații profesionale, leadership și business',
    sessionDate: null,
    summary:
      'Ascultarea activă ca instrument de înțelegere, relaționare și colectare a informației relevante înainte de intervenție.',
    what: 'Dincolo de cuvinte dezvoltă ascultarea activă ca instrument de înțelegere, relaționare și colectare a informației relevante înainte de intervenție.',
    problems:
      'Când ești obișnuit să găsești soluții, poți ajunge să asculți doar pentru a răspunde. Clientul vorbește și pregătești oferta. Angajatul vorbește și pregătești soluția. Partenerul vorbește și pregătești contraargumentul.',
    workMethod:
      'Exersăm nivelurile ascultării, întrebările, reformularea, clarificarea, observarea presupunerilor și principalele blocaje ale ascultării.',
    outcomes: [
      'instrumente pentru conversații mai clare',
      'capacitatea de a verifica dacă ai înțeles corect',
      'întrebări mai bune',
      'mai multă informație înainte de a răspunde, negocia sau decide',
    ],
    keywords: [
      'curs ascultare activă',
      'workshop ascultare activă',
      'comunicare interpersonală',
      'leadership și comunicare',
      'curs soft skills Timișoara',
    ],
  },
  {
    slug: 'mesajul-care-ajunge',
    title: 'Mesajul care ajunge',
    subtitle: 'Comunicare eficientă: de la intenție la impact',
    sessionDate: null,
    summary:
      'Un workshop practic despre construirea mesajului astfel încât intenția, conținutul și impactul să fie cât mai apropiate.',
    what: 'Mesajul care ajunge este un workshop practic despre construirea mesajului astfel încât intenția, conținutul și impactul să fie cât mai apropiate.',
    problems:
      '„Dar eu i-am spus" nu garantează că mesajul a fost înțeles. Ambiguitatea, presupunerile, mesajele incomplete și diferențele de interpretare pot produce erori, conflicte și rezultate slabe.',
    workMethod:
      'Lucrăm cu structura mesajului, comunicarea verbală și nonverbală, întrebările, clarificarea așteptărilor, feedbackul și comunicarea asertivă.',
    outcomes: [
      'o mai bună înțelegere a stilului tău de comunicare',
      'o structură pentru mesaje clare',
      'instrumente pentru feedback și conversații dificile',
      'reducerea diferenței dintre ce ai vrut să spui și ce a înțeles celălalt',
    ],
    keywords: [
      'curs comunicare eficientă',
      'workshop comunicare Timișoara',
      'comunicare profesională',
      'abilități de comunicare',
      'curs soft skills',
    ],
  },
  {
    slug: 'cand-nu-vedem-lucrurile-la-fel',
    title: 'Când nu vedem lucrurile la fel',
    subtitle: 'Gestionarea conflictelor și a conversațiilor dificile',
    sessionDate: null,
    summary:
      'Conflictul privit ca o situație care poate fi analizată și gestionată, nu doar evitată sau câștigată.',
    what: 'Acest workshop privește conflictul ca pe o situație care poate fi analizată și gestionată, nu doar evitată sau câștigată.',
    problems:
      'Conflictul cu asociatul, clientul, angajatul sau colegul nu apare doar din diferențe de opinii, ci și din felul în care interpretăm intențiile, apărăm poziții și reacționăm emoțional.',
    workMethod:
      'Analizăm anatomia conflictului, stilurile de reacție, escaladarea, pozițiile perceptuale, limitele și separarea persoanei de problemă, apoi exersăm conversații dificile și alternative de răspuns.',
    outcomes: [
      'înțelegerea propriului stil în conflict',
      'instrumente pentru reducerea escaladării',
      'o structură pentru conversații dificile',
      'capacitatea de a căuta soluția fără a transforma diferența într-un atac personal',
    ],
    keywords: [
      'curs gestionarea conflictelor',
      'workshop conflicte',
      'managementul conflictului',
      'comunicare în conflict',
      'rezolvarea conflictelor Timișoara',
    ],
  },
  {
    slug: 'omul-din-spatele-liderului',
    title: 'Omul din spatele liderului',
    subtitle: 'Leadership pentru antreprenori și manageri: de la funcție la influență',
    sessionDate: null,
    summary:
      'Un workshop despre comportamentul celui care conduce: decizie, responsabilizare, limite, încredere, feedback și reacția sub presiune.',
    what: 'Omul din spatele liderului este un workshop despre comportamentul celui care conduce: decizie, responsabilizare, limite, încredere, feedback și reacția sub presiune.',
    problems:
      'Mulți antreprenori cresc businessuri înainte să crească în rolul de lider. Angajează oameni, dar continuă să lucreze ca atunci când erau singuri: decid tot, verifică tot și rezolvă tot. Managerii pot avea funcția, dar pot evita deciziile sau conversațiile dificile.',
    workMethod:
      'Folosim studii de caz și situații manageriale pentru a analiza stilul personal de leadership, nevoia de control, asumarea și modul în care comportamentul liderului influențează echipa.',
    outcomes: [
      'o imagine mai clară asupra stilului tău de leadership',
      'identificarea comportamentelor care limitează autonomia echipei',
      'instrumente pentru decizie, feedback și responsabilizare',
      'priorități concrete pentru dezvoltarea ta ca lider',
    ],
    keywords: [
      'curs leadership Timișoara',
      'workshop leadership',
      'leadership antreprenori',
      'dezvoltare manageri',
      'competențe de leadership',
    ],
  },
  {
    slug: 'nu-trebuie-sa-faci-tu-totul',
    title: 'Nu trebuie să faci tu totul',
    subtitle: 'Delegare, autonomie și responsabilitate în echipă',
    sessionDate: null,
    summary:
      'Delegarea tratată ca transfer clar de responsabilitate, nu ca simplă distribuire de sarcini.',
    what: 'Workshopul tratează delegarea ca transfer clar de responsabilitate, nu ca simplă distribuire de sarcini.',
    problems:
      '„Mai repede fac eu." „Nimeni nu face ca mine." „Trebuie să verific tot." Aceste convingeri pot transforma antreprenorul sau managerul în blocajul propriei echipe și pot limita creșterea businessului.',
    workMethod:
      'Lucrăm cu alegerea sarcinilor, alegerea persoanei, nivelul de autonomie, rezultatul așteptat, standardele, verificarea, feedbackul și micromanagementul.',
    outcomes: [
      'un sistem practic de delegare',
      'criterii pentru nivelul de autonomie',
      'o structură clară pentru transmiterea rezultatului așteptat',
      'identificarea activităților pe care nu ar mai trebui să le faci tu',
    ],
    keywords: [
      'curs delegare',
      'workshop delegare manageri',
      'delegare eficientă',
      'autonomie echipă',
      'management echipă Timișoara',
    ],
  },
  {
    slug: 'ce-ii-pune-pe-oameni-in-miscare',
    title: 'Ce îi pune pe oameni în mișcare',
    subtitle: 'Motivație, implicare și responsabilitate în echipe',
    sessionDate: null,
    summary:
      'Motivația fără rețete universale: ce poate susține implicarea unor oameni diferiți, în aceeași echipă.',
    what: 'Workshopul explorează motivația fără rețete universale. Scopul este să înțelegi mai bine ce poate susține implicarea unor oameni diferiți.',
    problems:
      '„Îl plătesc bine. De ce nu este motivat?" Oamenii nu funcționează după aceeași formulă. Salariul contează, dar implicarea poate fi influențată și de autonomie, recunoaștere, progres, sens, relații, responsabilitate și valori.',
    workMethod:
      'Analizăm motivația intrinsecă și extrinsecă, valorile, autonomia, recunoașterea, progresul, responsabilitatea și conversațiile prin care managerul poate afla ce contează pentru omul din fața lui.',
    outcomes: [
      'o perspectivă mai realistă asupra motivației',
      'întrebări pentru conversațiile cu oamenii din echipă',
      'identificarea diferențelor individuale',
      'idei de intervenție adaptate, în locul unei singure formule pentru toți',
    ],
    keywords: [
      'curs motivarea angajaților',
      'workshop motivație',
      'engagement angajați',
      'motivarea echipei',
      'leadership motivațional Timișoara',
    ],
  },
  {
    slug: 'cat-te-costa-sa-fii-mereu-disponibil',
    title: 'Cât te costă să fii mereu disponibil?',
    subtitle: 'Energie, limite și performanță sustenabilă pentru antreprenori și profesioniști',
    sessionDate: null,
    summary:
      'Discuția se mută de la formula rigidă de work-life balance către managementul resurselor: energie, limite, roluri, priorități și recuperare.',
    what: 'Acest workshop mută discuția de la formula rigidă de work-life balance către managementul resurselor: energie, limite, roluri, priorități și recuperare.',
    problems:
      'Telefonul rămâne deschis, mintea continuă să lucreze după program, vacanța devine birou într-o altă locație, iar pauza produce vinovăție. Performanța construită pe disponibilitate permanentă are un cost.',
    workMethod:
      'Analizăm consumatorii de energie, rolurile, limitele, prioritățile, disponibilitatea permanentă și modul în care poți construi un sistem de lucru mai sustenabil.',
    outcomes: [
      'o hartă a consumului tău de energie',
      'identificarea limitelor care trebuie clarificate',
      'priorități mai realiste',
      'un plan personal de recuperare și protejare a resurselor',
    ],
    keywords: [
      'work life balance antreprenori',
      'echilibru viață profesională personală',
      'managementul energiei',
      'limite profesionale',
      'performanță sustenabilă Timișoara',
    ],
  },
]

/* -------------------------------------------------------------------------- */
/* Antetul paginii                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Fotografia din antet.
 *
 * Până pe 7 septembrie 2026, pagina împrumuta `adriana-servicii.jpg`, adică
 * exact fotografia de pe `/servicii`. Acum are una proprie, din aceeași ședință
 * foto, deci regula proiectului — câte o fotografie pe pagină, niciuna
 * repetată — se ține din nou.
 *
 * Slotul este `page-portrait` (2:3), fiindcă fișierul are chiar raportul
 * acesta: 1067×1600. `object-cover` nu taie nimic, deci nu are nevoie nici de
 * `objectPosition`. Antetul o randează la 380px, ca pe `/blog` și `/contact`.
 */
const workshopsImage: ImageSlotContent = {
  slot: 'page-portrait',
  src: '/images/adriana-workshopuri.jpg',
  alt: 'Adriana Chira, portret în picioare lângă fereastră, în alb și negru',
  width: 1067,
  height: 1600,
  placeholderLabel: 'Fotografie · Workshopuri',
}

/**
 * Textul paginii de catalog.
 *
 * Titlul, descrierea și adresa urmează recomandările SEO din documentul
 * clientei, cu o singură abatere: `h1`-ul din pagină este cel de mai jos, iar
 * titlul din Google („Workshopuri de performanță umană…") stă în `metaTitle`.
 * Un `h1` care repetă cuvânt cu cuvânt title-tag-ul nu aduce nimic în plus și
 * citește prost pentru om, care e primul destinatar al paginii.
 */
export const workshopsPage: WorkshopsPageContent = {
  eyebrow: { text: 'Human Performance Workshops', ornament: 'pulse' } satisfies Eyebrow,
  title: 'Workshopuri practice de performanță umană',
  lead: 'Workshopuri de o zi pentru antreprenori, manageri și profesioniști — de la omul care conduce rezultatul, la competențele care susțin performanța.',
  intro:
    'O serie de workshopuri practice de 8 ore, construite într-un fir logic: autocunoaștere, autoreglare, gândire și decizie, adaptare, relaționare, leadership și performanță sustenabilă. Fiecare workshop se poate face separat, în funcție de competența pe care vrei să o dezvolți. Parcurse în ordine, formează un traseu coerent de dezvoltare a performanței umane: mai întâi înțelegi cum funcționezi, apoi înveți să te conduci, să iei decizii mai bune, să lucrezi cu oamenii și să construiești performanță pe care o poți susține.',
  positioning:
    'Nu dezvoltăm competențe izolate. Construim, etapă cu etapă, capacitatea omului de a produce rezultate. Performanța nu începe doar cu strategia, ci cu omul care trebuie să o transforme în comportament, decizie și acțiune.',
  image: workshopsImage,
  metaTitle: 'Workshopuri de performanță umană pentru antreprenori și manageri | Timișoara',
  metaDescription:
    'Workshopuri practice de 8 ore în Timișoara, pentru antreprenori, manageri și profesioniști: leadership, comunicare, reziliență, decizie, adaptabilitate, delegare și performanță sustenabilă.',
  /**
   * Întrebările frecvente ale paginii. Sunt fallback-ul: dacă cineva scrie în
   * admin întrebări marcate „Pagina de workshopuri", acestea se retrag.
   * Răspunsurile sunt propoziții autonome — forma pe care o extrag motoarele
   * de răspuns (brief §9.1).
   */
  faq: [
    {
      question: 'Cât costă un workshop și ce include prețul?',
      answer:
        'Un loc la orice workshop din serie costă 510 lei de participant. Prețul include cele 8 ore de workshop, materialele de curs și coffee break-ul dintre module. Masa de prânz nu este inclusă; pauza de prânz este între 13:00 și 14:00.',
      defaultOpen: true,
    },
    {
      question: 'De ce pot cumpăra doar la trei workshopuri?',
      answer:
        'Sunt deschise pentru înscriere întotdeauna doar următoarele trei ediții programate, câte una pe lună. Restul catalogului rămâne vizibil, ca să știi ce urmează, iar pentru oricare dintre ele îți poți anunța interesul. Când se strânge un grup, ediția primește dată și intră la rândul ei la înscriere.',
    },
    {
      question: 'Unde se desfășoară workshopurile?',
      answer:
        'Fizic, în Timișoara, în grup restrâns. Workshopurile din această serie nu se desfășoară online: cea mai mare parte a zilei înseamnă exerciții, simulări și lucru în grup, care își pierd din efect la distanță.',
    },
    {
      question: 'Cum arată o zi de workshop?',
      answer:
        'Ziua durează 8 ore, între 09:00 și 17:00, și este împărțită în patru module. Primul modul lămurește conceptele și include o autoevaluare, al doilea aduce exerciții și analiză, al treilea studii de caz și simulări, iar al patrulea integrează totul într-un plan personal de aplicare. Între module sunt două pauze de cafea, iar între 13:00 și 14:00 este pauza de prânz.',
    },
    {
      question: 'Pot plăti prin firmă, cu factură?',
      answer:
        'Da. La finalizarea înscrierii poți trece datele de facturare ale firmei, iar factura se emite pe firmă. Dacă ai nevoie de contract înainte de plată sau înscrii mai mulți participanți, scrie-mi și stabilim procedura.',
    },
    {
      question: 'Ce se întâmplă dacă nu pot ajunge la ediția la care m-am înscris?',
      answer:
        'Anunță-mă cât mai devreme. Locul se poate muta la o ediție următoare a aceluiași workshop sau poate fi preluat de altcineva desemnat de tine. Condițiile de anulare și rambursare sunt cele din politica de retur publicată pe site.',
    },
    {
      question: 'Care este diferența dintre un workshop și programele individuale?',
      answer:
        'Workshopul este o zi de lucru în grup, pe o singură competență, cu instrumente pe care le aplici imediat. Programele individuale — Strategic Performance Assessment, CLAR și Executive Performance Program — pornesc de la situația ta concretă și lucrează pe mai multe dimensiuni deodată, pe săptămâni sau luni. Workshopurile dezvoltă o competență; programele individuale schimbă modul de funcționare.',
    },
  ],
}
