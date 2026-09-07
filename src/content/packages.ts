import type { PackageDetail, PackagePreview, PackageSection } from './types'

/**
 * Cele trei programe individuale.
 *
 * Ca peste tot în `src/content/`, fișierul este ȘI fallback-ul când CMS-ul n-a
 * fost completat, ȘI sursa din care `pnpm seed` populează colecția `packages`.
 *
 * Textul vine din documentele livrate de clientă în septembrie 2026
 * (Strategic Performance Assessment, CLAR Performance Transformation,
 * Executive Performance Program), rescris pentru web după aceleași două reguli
 * ca restul site-ului:
 *
 * 1. **Prima frază a fiecărei secțiuni se susține singură.** Este cea pe care o
 *    extrag motoarele de răspuns, iar ele nu citesc contextul de deasupra.
 * 2. **Nicio promisiune care nu era în document.** Unde clienta a scris că
 *    rezultatul depinde de implicarea clientului, textul spune la fel.
 *
 * ## Ce înlocuiește acest fișier
 *
 * Până acum, cele trei carduri de pe homepage și de pe `/servicii` randau
 * placeholderele din designul aprobat — `[ Nume pachet ]`, `[ 000 ] RON`.
 * Acela era blocajul §7.1 din STATUS.md, iar el s-a ridicat: pachetele au
 * acum nume, conținut, durată și preț.
 *
 * Ordinea este cea a angajamentului crescător: evaluare de 3 ore, program de 8
 * săptămâni, program de 6 luni. Cardul evidențiat rămâne cel din mijloc, ca în
 * designul aprobat.
 *
 * Diacritice cu virgulă: ș (U+0219), ț (U+021B). Niciodată sedilă.
 */

const CURRENCY = 'RON'

/* -------------------------------------------------------------------------- */
/* I. Strategic Performance Assessment™                                        */
/* -------------------------------------------------------------------------- */

const assessmentSections: PackageSection[] = [
  {
    heading: 'Întrebarea de la care pornim',
    paragraphs: [
      'Ai un obiectiv. Vrei să crești businessul, să obții rezultate mai bune, să treci într-un rol de leadership, să iei decizii mai bune sau să câștigi mai mult fără ca singura soluție să fie să muncești și mai mult.',
      'Poate ai citit, ai făcut cursuri, ai schimbat strategii și ai stabilit obiective. Dar rezultatele nu cresc în ritmul în care te-ai aștepta. Sau cresc, dar prețul pe care îl plătești pentru ele devine prea mare.',
      'Atunci întrebarea nu mai este „Ce trebuie să mai fac?", ci: „Ce din modul în care funcționez astăzi mă ajută și ce mă împiedică să ajung la următorul nivel?"',
    ],
  },
  {
    heading: 'Ce este Strategic Performance Assessment™',
    paragraphs: [
      'Strategic Performance Assessment™ este o evaluare individuală aprofundată a performanței umane, de aproximativ trei ore, destinată antreprenorilor, liderilor, managerilor și profesioniștilor care vor să înțeleagă ce susține și ce limitează rezultatele lor actuale.',
      'Nu este un test de personalitate. Nu este o sesiune clasică de coaching. Nu este terapie și nu este încă un curs despre ce „ar trebui" să faci. Este un proces strategic în care analizăm omul care trebuie să producă rezultatul.',
      'Poți avea strategie și să nu o execuți. Poți avea experiență și să amâni decizii importante. Poți avea disciplină și să continui prea mult într-o direcție care nu mai funcționează. Poți avea rezultate excelente și să le obții cu un consum de energie pe care nu îl mai poți susține. Performanța nu depinde de o singură calitate, ci de arhitectura care le pune împreună.',
    ],
  },
  {
    heading: 'Poate fi pentru tine dacă',
    list: [
      'muncești mult, dar rezultatele nu mai cresc proporțional;',
      'businessul a crescut, dar tu ai rămas prins în operațional;',
      'știi ce trebuie să faci, dar amâni anumite decizii importante;',
      'ai succes, dar performanța începe să coste prea mult în energie, timp sau echilibru personal;',
      'ceea ce a funcționat până acum nu mai produce același rezultat;',
      'ești într-un moment de tranziție profesională sau de business;',
      'simți că poți mai mult, dar rezultatele nu reflectă întregul tău potențial.',
    ],
  },
  {
    heading: 'Human Performance Architecture™ — HPA 20',
    paragraphs: [
      'Nu evaluăm doar rezultatul, ci sistemul uman care trebuie să îl producă. Evaluarea folosește Human Performance Architecture™ — HPA 20, o hartă de analiză formată din 20 de atribute asociate performanței, organizate în șase dimensiuni.',
    ],
    steps: [
      {
        index: '01',
        title: 'Direcție',
        body: 'Claritate, viziune, sens și motivație internă. Știi unde mergi și de ce? Analizăm claritatea obiectivului, capacitatea de a vedea dincolo de problemele prezentului și existența unei motivații suficient de puternice pentru a susține efortul.',
      },
      {
        index: '02',
        title: 'Execuție',
        body: 'Disciplină, consecvență, focus și practică deliberată. Poți transforma intenția în rezultat? Analizăm capacitatea de a trece la acțiune, de a menține comportamentele necesare și de a investi atenția în lucrurile care contează.',
      },
      {
        index: '03',
        title: 'Reglare',
        body: 'Autoreglare emoțională, toleranță la disconfort, reziliență și gestionarea energiei. Ce se întâmplă cu tine când apare presiunea? Analizăm reacția la eșec, critică, conflict, incertitudine și perioade în care rezultatele întârzie.',
      },
      {
        index: '04',
        title: 'Adaptare',
        body: 'Capacitate de învățare, adaptabilitate, feedback și decizie. Poți schimba strategia când realitatea arată că nu mai funcționează? Analizăm învățarea, recalibrarea, relația cu feedbackul și decizia în condiții de incertitudine.',
      },
      {
        index: '05',
        title: 'Autonomie',
        body: 'Autocunoaștere, încredere în sine și responsabilitate. Cât de bine te poți conduce pe tine? Analizăm resursele, limitele, nevoia de validare și capacitatea de a acționa asupra lucrurilor pe care le poți controla.',
      },
      {
        index: '06',
        title: 'Expansiune',
        body: 'Curaj și perseverență. Poți susține disconfortul următorului nivel? Analizăm disponibilitatea de a te expune, a risca, a ieși din familiar și a continua când rezultatul nu apare imediat.',
      },
    ],
  },
  {
    heading: 'Cum se desfășoară',
    paragraphs: [
      'Aproximativ trei ore de analiză individuală. Procesul combină analiza strategică, interviul comportamental, autoevaluarea, observația profesională, analiza resurselor, identificarea vulnerabilităților, analiza contradicțiilor de performanță, identificarea gap-urilor și prioritizarea zonelor de dezvoltare.',
      'Pentru fiecare dimensiune urmărim trei niveluri: ce spui despre tine, ce exemple reale poți oferi și ce comportamente produci.',
    ],
    steps: [
      {
        index: '1',
        title: 'Unde ești și unde vrei să ajungi',
        body: 'Situația actuală și rezultatul dorit, ce ai încercat până acum, ce funcționează și ce nu, ce te blochează, ce resurse ai deja și nu folosești suficient și ce te costă menținerea situației actuale.',
      },
      {
        index: '2',
        title: 'Cum funcționezi',
        body: 'Analizăm cele 20 de atribute HPA 20™ și căutăm comportamente, exemple și tipare. Începem să vedem arhitectura din spatele rezultatului actual.',
      },
      {
        index: '3',
        title: 'Unde este gap-ul',
        body: 'Separăm resursele care pot accelera rezultatul, capacitățile care trebuie dezvoltate, elementele care îți pot destabiliza performanța și zonele în care două caracteristici ale modului tău de funcționare intră în tensiune.',
      },
    ],
  },
  {
    heading: 'Uneori calitatea ta poate deveni limitarea ta',
    paragraphs: [
      'Nu căutăm un profil „perfect". Căutăm configurația de care ai nevoie pentru rezultatul pe care vrei să îl produci. Cele mai costisitoare blocaje nu vin din ce îți lipsește, ci din felul în care două calități reale se anulează reciproc.',
    ],
    list: [
      'Perseverență mare și adaptabilitate redusă: poți continua extraordinar de mult într-o direcție pe care ar fi trebuit să o schimbi.',
      'Disciplină mare și autoreglare redusă: poți produce rezultate foarte bune, dar cu un cost personal nesustenabil.',
      'Încredere mare și receptivitate redusă la feedback: poți avea curajul deciziei, dar să ratezi informații importante din exterior.',
      'Focus foarte mare și viziune insuficientă: poți executa impecabil ceva care nu mai este relevant.',
    ],
  },
  {
    heading: 'Ce primești la final',
    list: [
      'Human Performance Map™ — harta celor șase dimensiuni ale performanței tale;',
      'profilul HPA 20™ — analiza celor 20 de atribute;',
      'top strengths — resursele pe care merită să construiești;',
      'development areas — capacitățile care merită dezvoltate;',
      'performance risks — elementele care pot afecta următorul nivel;',
      'performance contradictions — tensiunile dintre componentele modului tău de funcționare;',
      'strategic performance gap — diferența dintre capacitatea actuală și ceea ce cere obiectivul;',
      'top 3 priorități strategice — direcțiile cu cel mai mare impact asupra rezultatului urmărit;',
      'planul de performanță pentru următoarele 90 de zile.',
    ],
  },
  {
    heading: 'Ce nu primești',
    paragraphs: [
      'Nu primești o listă de defecte. Nu primești o etichetă și nu îți spunem că trebuie să devii „alt om". Întrebarea este ce trebuie păstrat, ce trebuie folosit mai bine, ce trebuie dezvoltat și ce trebuie recalibrat pentru următorul tău nivel.',
      'Nu trebuie să ai o problemă ca să faci evaluarea. Este potrivită și pentru oamenii care deja performează, pentru care întrebarea devine: ce m-a adus până aici va fi suficient și pentru următorul nivel? Performanța actuală nu garantează performanța viitoare.',
    ],
  },
  {
    heading: 'După evaluare',
    paragraphs: [
      'Evaluarea poate rămâne un serviciu independent. Primești harta, prioritățile și planul tău și poți continua singur.',
      'Dacă analiza arată o zonă care necesită intervenție mai profundă, evaluarea poate deveni punctul de plecare pentru un proces individual de dezvoltare — programul CLAR™ sau Executive Performance Program™, care o include deja. Întâi diagnosticăm, apoi decidem dacă și unde este necesară intervenția.',
    ],
  },
]

/* -------------------------------------------------------------------------- */
/* II. CLAR™ Performance Transformation                                        */
/* -------------------------------------------------------------------------- */

const clarSections: PackageSection[] = [
  {
    heading: 'Problema nu mai este lipsa de informație',
    paragraphs: [
      'Poate că știi deja ce ai de făcut. Ai citit, ai analizat, ai cerut sfaturi și ai înțeles unde te blochezi. Cu toate acestea, deciziile importante continuă să fie amânate, prioritățile se schimbă, iar comportamentele vechi reapar exact când presiunea crește.',
      'Problema nu mai este lipsa de informație. Este distanța dintre ceea ce știi și ceea ce reușești să aplici consecvent. CLAR™ este construit pentru această distanță.',
    ],
  },
  {
    heading: 'Te poți regăsi în una dintre situațiile acestea',
    list: [
      'amâni o decizie importantă, deși ai suficiente informații;',
      'muncești mult, dar nu înaintezi în direcția care contează;',
      'îți schimbi prioritățile și pierzi consecvența;',
      'îți este greu să pui limite, să spui „nu" sau să susții o poziție fermă;',
      'te blochezi între ceea ce vrei și imaginea pe care simți că trebuie să o protejezi;',
      'ai competențe și potențial, dar rezultatele tale nu le reflectă constant;',
      'înțelegi tiparul, însă îl repeți atunci când apare presiunea;',
      'vrei să crești profesional sau în business, dar modul actual de funcționare nu mai susține următorul nivel.',
    ],
  },
  {
    heading: 'Ce este CLAR™ Performance Transformation',
    paragraphs: [
      'CLAR™ este un program individual de consultanță în performanță umană, desfășurat pe parcursul a opt săptămâni. Procesul este personalizat în jurul unui obiectiv real: o decizie, o tranziție profesională, o provocare de leadership, un blocaj de execuție sau un nivel de performanță pe care vrei să îl poți susține.',
      'Nu primești o rețetă standard și nu lucrăm doar la nivel de discuție. Analizăm felul în care gândești, decizi și acționezi, identificăm mecanismele care îți reduc eficiența și construim comportamente compatibile cu rezultatul urmărit.',
      'Principiul programului: nu lucrăm doar cu obiectivul, ci cu omul care trebuie să devină capabil să îl susțină.',
    ],
  },
  {
    heading: 'Metoda CLAR™, de la claritate la rezultate',
    steps: [
      {
        index: 'C',
        title: 'Clarificare',
        body: 'Definim exact unde ești, ce vrei să obții, ce contează acum și după ce criterii vei recunoaște progresul. Separăm problema reală de simptome, zgomot și presupuneri.',
      },
      {
        index: 'L',
        title: 'Limitări',
        body: 'Identificăm credințele, fricile, conflictele interne, rolurile și tiparele comportamentale care interferează cu obiectivul. Nu căutăm vinovați, ci mecanismul care poate fi schimbat.',
      },
      {
        index: 'A',
        title: 'Acțiune',
        body: 'Transformăm concluziile în decizii, priorități și comportamente concrete. Testăm în viața reală, urmărim ce funcționează și ajustăm ceea ce nu produce efectul dorit.',
      },
      {
        index: 'R',
        title: 'Rezultate',
        body: 'Măsurăm progresul, consolidăm ceea ce funcționează și construim criterii de autoreglare. Scopul final nu este dependența de consultant, ci capacitatea ta de a continua autonom.',
      },
    ],
  },
  {
    heading: 'Ce putem lucra în program',
    paragraphs: [
      'Conținutul nu este identic pentru fiecare client. În funcție de obiectivul și profilul tău, procesul poate include:',
    ],
    list: [
      'clarificarea direcției personale și profesionale;',
      'decizii dificile și reducerea amânării;',
      'prioritizare, focus și disciplină de execuție;',
      'relația cu responsabilitatea și asumarea;',
      'restructurarea perspectivelor care limitează acțiunea;',
      'comunicare, limite și conversații dificile;',
      'leadership personal și comportamente de leadership;',
      'gestionarea timpului, energiei și atenției;',
      'comportamente compatibile cu nivelul de performanță urmărit.',
    ],
  },
  {
    heading: 'Cum se desfășoară',
    paragraphs: [
      'Programul cuprinde șase sesiuni individuale de 90 de minute, distribuite pe parcursul a opt săptămâni. Ritmul oferă suficient spațiu pentru aplicare, observare și calibrare între întâlniri.',
      'Între sesiuni primești exerciții, aplicații și instrumente adaptate obiectivului tău, iar progresul este urmărit pe baza criteriilor stabilite la început.',
    ],
    steps: [
      {
        index: '1',
        title: 'Punctul de plecare',
        body: 'Definim obiectivul, contextul actual și indicatorii după care vom urmări progresul.',
      },
      {
        index: '2',
        title: 'Clarificare și limitări',
        body: 'Separăm problema reală de simptome și identificăm mecanismele care blochează decizia sau execuția.',
      },
      {
        index: '3',
        title: 'Acțiune și implementare',
        body: 'Construim decizii, priorități și experimente comportamentale aplicabile imediat.',
      },
      {
        index: '4',
        title: 'Calibrare și rezultate',
        body: 'Analizăm efectele, ajustăm, consolidăm noile comportamente și realizăm evaluarea finală.',
      },
    ],
  },
  {
    heading: 'Cu ce pleci la final',
    paragraphs: [
      'CLAR™ nu promite o versiune „perfectă" a ta și nici rezultate fără implicare. Îți oferă un cadru riguros de analiză, decizie, aplicare și feedback. La finalul programului vei avea:',
    ],
    list: [
      'o direcție clarificată și un obiectiv formulat concret;',
      'criterii mai bune pentru decizii și priorități;',
      'un plan de acțiune realist și măsurabil;',
      'comportamente noi, testate în contexte reale;',
      'o înțelegere mai exactă a tiparelor care îți reduc performanța;',
      'instrumente prin care îți poți regla singur progresul;',
      'mai multă autonomie în raport cu deciziile și rezultatele tale.',
    ],
  },
  {
    heading: 'Cui i se potrivește și cui nu',
    paragraphs: [
      'Programul este potrivit pentru tine dacă ești antreprenor sau soloprenor care trebuie să treacă de la reacție la conducere, manager sau lider care amână decizii ori evită conversații, profesionist într-o tranziție de rol sau de identitate profesională, ori o persoană competentă care știe mult, dar nu aplică suficient de consecvent. În toate cazurile, e nevoie să îți asumi partea ta de responsabilitate și să lucrezi între sesiuni.',
      'Nu este programul potrivit dacă vrei doar motivație de moment sau o soluție rapidă fără aplicare, dacă vrei ca altcineva să ia deciziile în locul tău, dacă nu ai disponibilitate pentru exercițiile dintre sesiuni sau dacă ai nevoie în primul rând de intervenție medicală, psihiatrică sau psihoterapeutică. CLAR™ este un program de performanță și nu înlocuiește aceste servicii.',
    ],
  },
  {
    heading: 'De ce această abordare',
    paragraphs: [
      'Performanța nu este produsă doar de strategie, competență sau voință. Este influențată de modul în care omul interpretează realitatea, tolerează presiunea, ia decizii, își gestionează resursele și transformă intenția în comportament.',
      'Ca și consultant în performanță umană, integrez experiența de peste 15 ani în training și lucrul cu oamenii cu perspective din management strategic, sociologie, psihologie, coaching și formare în psihoterapie integrativă. Perspectiva aceasta permite lucrul atât cu obiectivul profesional, cât și cu mecanismele umane care îl susțin sau îl blochează, fără a reduce omul la funcția pe care o ocupă.',
    ],
  },
]

/* -------------------------------------------------------------------------- */
/* III. Executive Performance Program™                                         */
/* -------------------------------------------------------------------------- */

const executiveSections: PackageSection[] = [
  {
    heading: 'Întrebarea de la care pornim',
    paragraphs: [
      'Ești într-o perioadă de creștere, schimbare sau presiune ridicată și simți că metodele care te-au adus până aici nu mai sunt suficiente.',
      'Executive Performance Program™ nu pornește de la „care este obiectivul tău?". Pornește de la întrebarea reală: ești construit, în acest moment, să susții obiectivul pe care îl urmărești?',
    ],
  },
  {
    heading: 'Ce este Executive Performance Program™',
    paragraphs: [
      'Executive Performance Program™ este programul cel mai amplu din ecosistemul CHIRA Model™: pornește cu diagnosticul oferit de Strategic Performance Assessment™ și continuă cu un proces individual de dezvoltare și implementare, susținut timp de șase luni.',
      'Nu primești un curriculum fix. Intervenția se construiește pe profilul și obiectivele tale reale, iar direcția se ajustează pe parcurs, pe baza evaluărilor intermediare.',
    ],
  },
  {
    heading: 'Pentru cine este',
    paragraphs: [
      'Pentru antreprenori, executivi, manageri și lideri care:',
    ],
    list: [
      'sunt într-o perioadă de creștere, schimbare sau presiune ridicată;',
      'simt că performanța actuală are un cost personal prea mare;',
      'vor un proces complet — diagnostic, plan strategic și implementare susținută, nu intervenții izolate;',
      'sunt pregătiți pentru un angajament de șase luni, cu rezultate monitorizate constant.',
    ],
  },
  {
    heading: 'Cum lucrăm',
    paragraphs: ['Programul poate include, în funcție de profilul tău:'],
    list: [
      'performanță individuală și leadership;',
      'decizie și relația cu presiunea;',
      'comportamente, comunicare și relații profesionale;',
      'limite, gestionarea energiei și a resurselor;',
      'mindset și restructurarea tiparelor care limitează performanța;',
      'strategie personală de dezvoltare și implementarea obiectivelor.',
    ],
  },
  {
    heading: 'Structura programului',
    list: [
      'Strategic Performance Assessment™ — diagnosticul inițial complet, de trei ore;',
      '12 sesiuni individuale, pe parcursul a șase luni;',
      'plan strategic individual;',
      'monitorizarea progresului pe tot parcursul programului;',
      'evaluări intermediare și ajustarea direcției;',
      'evaluare finală.',
    ],
  },
  {
    heading: 'Ce obții la final',
    list: [
      'o înțelegere clară a propriului profil de performanță;',
      'o direcție strategică personală;',
      'priorități clare;',
      'comportamente mai eficiente, deja testate în practică;',
      'capacitate mai bună de decizie;',
      'o relație mai sănătoasă cu presiunea și responsabilitatea;',
      'un sistem personal de susținere a performanței;',
      'indicatori clari prin care îți urmărești progresul mai departe.',
    ],
  },
  {
    heading: 'Promisiunea programului',
    paragraphs: [
      'Nu îți promit că vei face mai mult. Te ajut să devii capabil să susții mai mult — cu claritate, eficiență și fără să plătești performanța cu propria sănătate, cu relațiile sau cu echilibrul personal.',
    ],
  },
]

/* -------------------------------------------------------------------------- */
/* Lista                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Cele trei pachete, în ordinea angajamentului crescător.
 *
 * `numeral` și `href` se recalculează în `lib/content.ts` din poziția reală în
 * listă, exact ca la datele venite din CMS — altfel, o reordonare în admin ar
 * lăsa aici numerele vechi.
 */
export const packagesFallback: PackageDetail[] = [
  {
    numeral: 'I',
    slug: 'strategic-performance-assessment',
    href: '/servicii/strategic-performance-assessment',
    name: 'Strategic Performance Assessment™',
    tagline:
      'Înainte să schimbi strategia, află dacă omul care trebuie să o execute este pregătit pentru următorul nivel.',
    forWho:
      'Antreprenori, lideri, manageri și profesioniști care vor să înțeleagă ce susține și ce limitează rezultatele lor actuale.',
    includes: [
      'Analiza celor 20 de atribute HPA 20™, pe șase dimensiuni',
      'Human Performance Map™ și profilul tău de performanță',
      'Resurse, zone de dezvoltare, riscuri și contradicții',
      'Top 3 priorități strategice',
      'Plan de performanță pentru 90 de zile',
    ],
    duration: '3 ore · o singură sesiune',
    format: 'hibrid',
    price: 1500,
    currency: CURRENCY,
    featured: false,
    longDescription: null,
    body: assessmentSections,
    faq: [
      {
        question: 'Cu ce este diferit de un test de personalitate?',
        answer:
          'Un test de personalitate descrie cum ești în general. Strategic Performance Assessment™ analizează cum funcționezi în raport cu un obiectiv concret, pe trei niveluri: ce spui despre tine, ce exemple reale poți oferi și ce comportamente produci efectiv. Rezultatul nu este o etichetă, ci diferența dintre capacitatea ta actuală și ceea ce cere obiectivul urmărit.',
      },
      {
        question: 'Cât durează și cum se desfășoară?',
        answer:
          'Aproximativ trei ore, într-o singură sesiune individuală, online sau față în față, în Timișoara. Nu este nevoie de pregătire prealabilă: analiza pornește de la situația ta reală și de la exemple concrete din ultimele luni.',
      },
      {
        question: 'Trebuie să am o problemă ca să fac evaluarea?',
        answer:
          'Nu. Evaluarea este potrivită și pentru oameni care deja performează. Întrebarea devine atunci dacă ceea ce te-a adus până aici va fi suficient și pentru următorul nivel. Performanța actuală nu garantează performanța viitoare.',
      },
      {
        question: 'Ce se întâmplă după evaluare?',
        answer:
          'Evaluarea poate rămâne un serviciu independent: primești harta, prioritățile și planul de 90 de zile și poți continua singur. Dacă analiza arată o zonă care cere intervenție mai profundă, evaluarea devine punctul de plecare pentru programul CLAR™ sau pentru Executive Performance Program™, care o include deja.',
      },
      {
        question: 'Este confidențial?',
        answer:
          'Da. Conținutul sesiunii și informațiile personale sau profesionale discutate sunt tratate confidențial, în limitele cadrului legal și contractual aplicabil.',
      },
    ],
    seo: {
      metaTitle: 'Strategic Performance Assessment™ | Evaluare de performanță pentru lideri',
      metaDescription:
        'Evaluare strategică de 3 ore pentru antreprenori, manageri, lideri și profesioniști. Descoperă punctele forte, blocajele, riscurile și prioritățile care îți influențează performanța.',
      ogImage: null,
      noIndex: false,
    },
  },
  {
    numeral: 'II',
    slug: 'program-performanta-clar',
    href: '/servicii/program-performanta-clar',
    name: 'CLAR™ Performance Transformation',
    tagline:
      'Transformă ceea ce ai înțeles despre tine în decizii, comportamente și rezultate pe care le poți susține.',
    forWho:
      'Antreprenori, manageri, lideri și profesioniști care știu ce au de făcut, dar nu reușesc să susțină schimbarea.',
    includes: [
      '6 sesiuni individuale de 90 de minute',
      '8 săptămâni de lucru structurat',
      'Exerciții și aplicații între sesiuni',
      'Instrumente personalizate pentru situația ta',
      'Monitorizarea progresului și evaluare finală',
      'Plan personal de implementare pentru etapa următoare',
    ],
    duration: '8 săptămâni · 6 sesiuni de 90 de minute',
    format: 'hibrid',
    price: 5100,
    currency: CURRENCY,
    featured: true,
    longDescription: null,
    body: clarSections,
    faq: [
      {
        question: 'Este CLAR™ un program de coaching?',
        answer:
          'Nu este un pachet standard de coaching. Este un proces individual de consultanță în performanță umană, care poate integra instrumente din coaching, analiză comportamentală, leadership și implementare, în funcție de obiectivul clientului.',
      },
      {
        question: 'Trebuie să fi parcurs Strategic Performance Assessment™?',
        answer:
          'Nu în toate situațiile. Dacă ai deja suficientă claritate asupra punctului de plecare, putem începe direct programul. Dacă problema este complexă sau cauzele blocajului nu sunt clare, evaluarea poate fi recomandată separat.',
      },
      {
        question: 'Sesiunile sunt online sau față în față?',
        answer:
          'Programul se poate desfășura online sau față în față, în Timișoara, în funcție de disponibilitate și de ceea ce susține cel mai bine procesul.',
      },
      {
        question: 'Pot achita în două tranșe?',
        answer:
          'Da. Investiția de 5.100 lei poate fi achitată integral sau în două tranșe egale de 2.550 lei. Dacă alegi plata în tranșe, scrie-mi înainte de plată ca să stabilim calendarul.',
      },
      {
        question: 'Poate plăti compania pentru program?',
        answer:
          'Da. Programul poate fi contractat și achitat de organizație, cu respectarea confidențialității procesului individual și cu obiectivele clarificate de la început. Se poate emite contract și factură.',
      },
      {
        question: 'Rezultatele sunt garantate?',
        answer:
          'Niciun proces serios de dezvoltare nu poate garanta un rezultat independent de implicarea clientului. Primești structură, analiză, instrumente, feedback și calibrare; progresul depinde și de disponibilitatea ta de a decide, de a aplica și de a susține schimbarea.',
      },
      {
        question: 'Discuțiile sunt confidențiale?',
        answer:
          'Da. Conținutul sesiunilor și informațiile personale sau profesionale discutate sunt tratate confidențial, în limitele cadrului legal și contractual aplicabil.',
      },
    ],
    seo: {
      metaTitle: 'Program de performanță pentru lideri | CLAR™',
      metaDescription:
        'Program individual de 8 săptămâni pentru antreprenori, manageri și profesioniști: claritate, decizii, leadership personal și implementare consecventă.',
      ogImage: null,
      noIndex: false,
    },
  },
  {
    numeral: 'III',
    slug: 'executive-performance-program',
    href: '/servicii/executive-performance-program',
    name: 'Executive Performance Program™',
    tagline:
      'Performanță fără autodistrugere: șase luni de diagnostic, plan strategic și implementare susținută.',
    forWho:
      'Antreprenori, executivi și lideri aflați în creștere, schimbare sau presiune ridicată, care vor un proces complet, nu intervenții izolate.',
    includes: [
      'Strategic Performance Assessment™ — diagnosticul inițial complet',
      '12 sesiuni individuale, pe 6 luni',
      'Plan strategic individual',
      'Monitorizarea progresului pe tot parcursul programului',
      'Evaluări intermediare și ajustarea direcției',
      'Evaluare finală',
    ],
    duration: '6 luni · evaluare + 12 sesiuni',
    format: 'hibrid',
    price: 15000,
    currency: CURRENCY,
    featured: false,
    longDescription: null,
    body: executiveSections,
    faq: [
      {
        question: 'Prin ce diferă de Strategic Performance Assessment™ și de CLAR™?',
        answer:
          'Strategic Performance Assessment™ este diagnosticul de trei ore. CLAR™ este un program de transformare de opt săptămâni. Executive Performance Program™ le include pe amândouă și le extinde într-un proces complet de șase luni, cu evaluări intermediare și ajustare constantă a direcției — pentru cei care vor rezultate susținute, nu doar un punct de plecare.',
      },
      {
        question: 'Cui i se potrivește cel mai bine acest program?',
        answer:
          'Antreprenorilor, executivilor și liderilor aflați în perioade de creștere, schimbare sau presiune ridicată, care vor un proces complet, cu rezultate monitorizate constant, nu doar câteva sesiuni izolate.',
      },
      {
        question: 'Sesiunile se pot face online?',
        answer:
          'Da. Cele 12 sesiuni individuale pot avea loc atât la cabinetul din Timișoara, cât și online, video.',
      },
      {
        question: 'Ce include investiția de 15.000 lei?',
        answer:
          'Prețul include evaluarea inițială Strategic Performance Assessment™, toate cele 12 sesiuni individuale, planul strategic personal, monitorizarea progresului, evaluările intermediare și evaluarea finală. Este programul cel mai complet din ecosistemul CHIRA Model™.',
      },
      {
        question: 'Poate plăti compania pentru program?',
        answer:
          'Da. Programul poate fi contractat și achitat de organizație, cu contract și factură, cu respectarea confidențialității procesului individual.',
      },
    ],
    seo: {
      metaTitle: 'Executive Performance Program™ Timișoara | Program premium, 6 luni',
      metaDescription:
        'Program premium de performanță, 6 luni, pentru antreprenori și executivi din Timișoara. Strategic Performance Assessment™, 12 sesiuni 1:1 și plan strategic personal.',
      ogImage: null,
      noIndex: false,
    },
  },
]

/**
 * Câte rânduri are lista „Ce include" pe card.
 *
 * Cardul din designul aprobat are exact trei. Programele reale au între cinci
 * și șase elemente, iar afișarea tuturor ar înălța cardul din mijloc cu peste
 * 60px și ar rupe grila verificată la pixel de pe homepage. Restul se citesc pe
 * pagina pachetului, unde lista apare integral.
 */
const CARD_INCLUDES = 3

/** Aceleași pachete, în forma scurtă de pe carduri. */
export const packagePreviews: PackagePreview[] = packagesFallback.map((pkg) => ({
  numeral: pkg.numeral,
  name: pkg.name,
  tagline: pkg.tagline,
  forWho: pkg.forWho,
  includes: pkg.includes.slice(0, CARD_INCLUDES),
  duration: pkg.duration,
  price: pkg.price,
  currency: pkg.currency,
  href: pkg.href,
  featured: pkg.featured,
}))

export { CARD_INCLUDES }
