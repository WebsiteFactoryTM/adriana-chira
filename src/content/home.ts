import { packagePreviews } from './packages'
import type { HomeContent } from './types'

/**
 * Copy-ul homepage-ului, preluat verbatim din /design/homepage-approved.html.
 *
 * Migrează în globalul Payload `home-page` (faza 2). Aceste valori rămân ca
 * fallback: dacă un câmp lipsește în CMS, pagina afișează textul aprobat.
 *
 * Diacritice cu virgulă: ș (U+0219), ț (U+021B). Niciodată sedilă.
 */
export const homeContent: HomeContent = {
  hero: {
    eyebrow: { text: 'Consultant în performanță umană', ornament: 'line' },
    headlineLines: ['Unele decizii nu sunt', 'grele pentru că nu știi', 'ce ai de făcut.'],
    lead: 'Sunt grele pentru că ești prea aproape ca să mai vezi limpede.',
    intro:
      'Lucrez cu antreprenori, profesioniști independenți și oameni care conduc afaceri de familie — oameni care nu mai au nevoie de încă o opinie, ci de un spațiu în care să poată gândi clar.',
    primaryCta: { label: 'Programează o discuție', href: '#cta' },
    secondaryCta: { label: 'Vezi cum lucrăm împreună', href: '#metoda' },
    badges: ['Psihologie și strategie', 'Lucru 1:1', 'Timișoara și online'],
    portrait: {
      slot: 'hero-portrait',
      src: '/images/adriana-hero.jpg',
      alt: 'Portret Adriana Chira',
      width: 1067,
      height: 1600,
      placeholderLabel: 'Portret · Hero',
      /**
       * Fotografia e 2:3, cutia e 3:4 — se taie 11% pe verticală. 60% mută
       * decupajul spre partea de jos: rămâne spațiu deasupra capului și nu se
       * pierd pantofii.
       */
      objectPosition: '50% 60%',
      caption: 'ADRIANA CHIRA',
    },
  },

  problema: {
    eyebrow: { text: 'Punctul în care intervin', ornament: 'pulse' },
    heading:
      'Când tu ești omul care decide totul, e greu să găsești pe cineva cu care să poți vorbi fără să pari puternic.',
    body: 'De cele mai multe ori, problema nu este lipsa de competență. Este presiunea. Implicarea emoțională. Frica de consecințe. Loialitatea față de familie. Nevoia de control. Sau, pur și simplu, incapacitatea de a-ți vedea propriile tipare de decizie.',
    signs: [
      { index: '01', body: 'Știi ce ai de făcut, dar nu reușești să acționezi.' },
      { index: '02', body: 'O decizie de business e influențată de o relație personală.' },
      { index: '03', body: 'Îți protejezi oamenii atât de mult încât îți sabotezi propria afacere.' },
      { index: '04', body: 'Ai succes în ceea ce faci, dar te simți blocat.' },
    ],
  },

  metoda: {
    eyebrow: { text: 'Cum lucrez', ornament: 'none' },
    heading: 'Nu iau deciziile în locul tău. Te ajut să devii suficient de clar încât să le poți lua singur.',
    body: 'Prin evaluare, analiză comportamentală, conversație strategică și instrumente psihologice și de dezvoltare, te ajut să separi faptele de emoții, loialitatea de responsabilitate, frica de risc și nevoia de control de ceea ce este cu adevărat necesar.',
    steps: [
      {
        index: '01',
        title: 'Clarificăm omul',
        body: 'Cum gândești, cum decizi, ce tipare repeți, cum reacționezi sub presiune.',
      },
      {
        index: '02',
        title: 'Clarificăm situația',
        body: 'Ce este fapt și ce este interpretare. Ce e urgent și ce e important.',
      },
      {
        index: '03',
        title: 'Clarificăm decizia',
        body: 'Ce te împiedică să iei decizia pe care știi deja că trebuie să o iei.',
      },
    ],
  },

  pentruCine: {
    eyebrow: { text: 'Pentru cine', ornament: 'line' },
    heading: 'Oameni obișnuiți să se descurce singuri',
    aside: 'Patru contexte',
    segments: [
      {
        title: 'Antreprenori și soloprenori',
        body: 'Ai construit de la zero și decizi singur tot. Ai ajuns într-un punct în care aceleași unelte nu te mai duc mai departe.',
      },
      {
        title: 'Profesioniști independenți',
        body: 'Medici, avocați, specialiști. Ești foarte bun în domeniul tău și totuși te simți blocat.',
      },
      {
        title: 'Lideri și manageri',
        body: 'Porți responsabilitatea pentru alții și îți dai seama că vechiul tău mod de a conduce nu mai funcționează.',
      },
      {
        title: 'Afaceri de familie',
        body: 'Relațiile personale au început să dicteze deciziile profesionale, iar loialitatea intră în conflict cu responsabilitatea.',
      },
    ],
  },

  univers: {
    eyebrow: { text: 'Instrumente și modele', ornament: 'line' },
    heading: 'Un ecosistem de gândire construit în jurul performanței umane',
    body: 'Munca mea nu se oprește la o sesiune de consultanță. În timp, construiesc un sistem coerent de instrumente prin care oamenii pot ajunge singuri la claritate.',
    note: 'Un ecosistem în construcție',
    items: [
      {
        numeral: 'i',
        title: 'CHIRA Framework',
        trademark: true,
        body: 'Modelul meu de înțelegere a performanței umane: cum se leagă între ele identitatea, gândirea, decizia și rezultatul.',
      },
      {
        numeral: 'ii',
        title: 'CLAR',
        trademark: true,
        body: 'Procesul prin care transformăm complexitatea într-o perspectivă clară asupra situației, a deciziei și a direcției.',
      },
      {
        numeral: 'iii',
        title: 'Strategic Performance Assessment',
        body: 'Evaluare aprofundată prin care identificăm profilul, resursele, riscurile, blocajele și prioritățile de dezvoltare.',
      },
    ],
  },

  despre: {
    eyebrow: { text: 'Despre mine', ornament: 'line' },
    heading: 'Nu am ajuns să lucrez cu oamenii pentru că am găsit o metodă.',
    paragraphs: [
      'Am ajuns aici pentru că am înțeles, în timp, cât de mult poate schimba un om felul în care își vede propriile decizii.',
      'Am început cu sociologia, care mi-a dat perspectiva asupra oamenilor și a sistemelor în care funcționează. Am continuat cu management strategic și business, pentru că am vrut să înțeleg și mediul în care omul ia decizii. Ulterior, drumul m-a apropiat tot mai mult de psihologie, de comportament și de procesele profunde care influențează alegerile noastre.',
      'Nu consider diplomele partea cea mai importantă a poveștii mele. Ele îmi oferă instrumentele. Experiența m-a învățat când și cum să le folosesc.',
    ],
    credentials: [
      'Sociologie',
      'Management strategic',
      'Psihologie clinică și psihoterapie',
      'NLP',
      'Time Line Therapy®',
      'Coaching',
      'Hipnoză',
      'În formare: psihoterapie integrativă',
    ],
    link: { label: 'Citește povestea completă', href: '/despre' },
    portrait: {
      slot: 'about-portrait',
      src: '/images/adriana-despre.jpg',
      alt: 'Adriana Chira, portret',
      width: 1067,
      height: 1600,
      placeholderLabel: 'Portret · Despre',
      /** Cadru strâns: decupajul urcă, ca să rămână spațiu deasupra capului. */
      objectPosition: '50% 16%',
      caption: 'Sociologie · Strategie · Psihologie',
    },
  },

  valori: {
    eyebrow: { text: 'Valori', ornament: 'line' },
    values: [
      {
        index: '01',
        title: 'Claritate',
        body: 'Înainte de a căuta soluții, trebuie să înțelegem corect problema. Separăm faptele de interpretări și ceea ce este urgent de ceea ce este important.',
      },
      {
        index: '02',
        title: 'Obiectivitate',
        body: 'Nu îți spun ceea ce vrei să auzi. Îți ofer perspectiva pe care nu o poți avea atunci când ești prea implicat în situație.',
      },
      {
        index: '03',
        title: 'Responsabilitate',
        body: 'Nu îți iau deciziile. Te ajut să îți asumi deciziile și consecințele lor.',
      },
      {
        index: '04',
        title: 'Integritate',
        body: 'Respect omul din spatele afacerii, dar nu protejez comportamentele care îi sabotează performanța. Putem avea empatie fără să renunțăm la adevăr.',
      },
      {
        index: '05',
        title: 'Evoluție',
        body: 'Scopul nu este să rezolvăm doar problema de astăzi. Scopul este să construim un om mai conștient, mai autonom și mai capabil să gestioneze nivelul următor.',
      },
    ],
  },

  citat: {
    lines: [
      'Eu nu lucrez doar cu ceea ce faci.',
      'Lucrez cu omul care trebuie',
      'să facă acel lucru.',
    ],
    attribution: 'Adriana Chira',
  },

  servicii: {
    eyebrow: { text: 'Moduri de a lucra împreună', ornament: 'pulse' },
    heading: 'Trei feluri în care putem începe',
    intro:
      // A doua frază s-a schimbat pe 25 septembrie 2026, odată cu trecerea
      // CLAR™ și EPP pe ofertă: „Poți achiziționa direct din pagină" nu mai era
      // adevărat pentru două dintre cele trei programe.
      'Fiecare pachet spune clar ce conține, cât durează și pentru cine este potrivit. Evaluarea se achiziționează direct din pagină, cu plata securizată prin card; pentru programele de durată primești o ofertă personalizată.',
    /**
     * Cele trei programe individuale reale, din `src/content/packages.ts`.
     *
     * Până în septembrie 2026, aici erau trei carduri cu toate câmpurile
     * `null`, care randau marcajul „[ ... ]" din designul aprobat — clienta nu
     * decisese încă numele și prețurile (blocajul §7.1 din STATUS.md).
     * Blocajul s-a ridicat, iar structura cardului nu s-a schimbat cu nimic:
     * aceleași câmpuri, aceeași grilă, doar cu text în locul placeholderelor.
     *
     * Lista rămâne fallback-ul. Ce e completat în CMS are întâietate.
     */
    packages: packagePreviews,
    reassurance: [
      'Plată securizată prin Stripe',
      'Confirmare automată pe email',
      'Politică de retur publicată',
    ],
    footerLink: {
      label: 'Nu ești sigur ce ți se potrivește? Programează întâi o discuție',
      href: '#cta',
    },
  },

  blog: {
    eyebrow: { text: 'Blog', ornament: 'line' },
    heading: 'Perspective despre performanță, decizie și oameni',
    link: { label: 'Toate articolele', href: '/blog' },
    posts: [
      {
        title: 'Ce înseamnă, de fapt, performanța umană',
        href: '/blog/ce-inseamna-de-fapt-performanta-umana',
        category: 'Performanță',
        excerpt:
          'Potențialul nu este performanță. Cunoașterea nu este performanță. Munca multă nu este performanță.',
        publishedAt: '2026-08-12',
        readingTime: 6,
        cover: {
          slot: 'post-cover',
          src: null,
          alt: '',
          width: 1200,
          height: 900,
          placeholderLabel: 'Articol',
        },
      },
      {
        title: 'Obiectivul e SMART. Dar omul care trebuie să-l atingă?',
        href: '/blog/obiectivul-e-smart-dar-omul-care-trebuie-sa-l-atinga',
        category: 'Decizie',
        excerpt:
          'Uneori nu obiectivul este prea mare. Omul care încearcă să-l atingă nu este încă pregătit pentru nivelul lui.',
        publishedAt: '2026-08-05',
        readingTime: 7,
        cover: {
          slot: 'post-cover',
          src: null,
          alt: '',
          width: 1200,
          height: 900,
          placeholderLabel: 'Articol',
        },
      },
      {
        title: 'Când locurile se schimbă, dar perspectiva rămâne a ta',
        href: '/blog/cand-locurile-se-schimba-dar-perspectiva-ramane-a-ta',
        category: 'Perspectivă',
        excerpt:
          'M-am întors în stațiunea adolescenței mele și am găsit un loc pe care nu-l mai văzusem niciodată.',
        publishedAt: '2026-07-29',
        readingTime: 8,
        cover: {
          slot: 'post-cover',
          src: null,
          alt: '',
          width: 1200,
          height: 900,
          placeholderLabel: 'Articol',
        },
      },
    ],
  },

  faq: {
    eyebrow: { text: 'Întrebări frecvente', ornament: 'line' },
    heading: 'Ce vor să știe oamenii înainte de prima discuție',
    items: [
      {
        question: 'Ce înseamnă „consultant în performanță umană"?',
        answer:
          'Consultantul în performanță umană lucrează la intersecția dintre om, strategie și rezultat. Analizează nu doar ce faci, ci și cum gândești, cum iei decizii, ce tipare repeți și cum reacționezi sub presiune. Pentru că orice strategie este executată de un om, iar oamenii nu decid exclusiv rațional.',
      },
      {
        question: 'Cu ce este diferit de coaching sau de psihoterapie?',
        answer:
          'Psihoterapia se ocupă în principal de vindecare și de istoria personală. Coachingul se ocupă de obiective și de acțiune. Munca mea începe cu claritatea: separăm faptele de interpretări și înțelegem omul care trebuie să producă rezultatul, înainte de a construi planul. Folosesc instrumente psihologice, dar contextul este profesional și decizional.',
        table: {
          caption: 'Comparație între psihoterapie, coaching și consultanță în performanță umană',
          columns: ['Psihoterapie', 'Coaching', 'Performanță umană'],
          rows: [
            {
              label: 'Punctul de plecare',
              cells: ['Istoria personală', 'Obiectivul', 'Claritatea asupra situației'],
            },
            {
              label: 'Întrebarea centrală',
              cells: [
                'De ce sunt așa?',
                'Cum ajung acolo?',
                'Ce se întâmplă cu adevărat și cine trebuie să devii?',
              ],
            },
            {
              label: 'Contextul',
              cells: ['Personal, clinic', 'Personal sau profesional', 'Profesional și decizional'],
            },
            {
              label: 'Rezultatul urmărit',
              cells: [
                'Vindecare, echilibru',
                'Atingerea obiectivului',
                'Decizii pe care le poți lua singur',
              ],
            },
          ],
        },
      },
      {
        question: 'Cu cine lucrezi de obicei?',
        answer:
          'Cu antreprenori, soloprenori, profesioniști independenți — medici, avocați, specialiști — cu lideri de echipă și cu oameni care conduc afaceri de familie. În general, oameni obișnuiți să se descurce singuri, ajunși într-un blocaj sau într-un punct de creștere.',
      },
      {
        question: 'Cum decurge o colaborare?',
        answer:
          'Începem cu o discuție inițială în care stabilim împreună dacă este potrivit să lucrăm. Urmează o etapă de evaluare și analiză, apoi sesiuni de lucru structurate în jurul situației și a deciziei tale. Durata și formatul depind de pachetul ales.',
      },
      {
        question: 'Sesiunile sunt online sau față în față?',
        answer:
          'Ambele. Sesiunile se pot desfășura online sau față în față, în Timișoara. Alegerea îți aparține și se poate schimba pe parcursul colaborării.',
      },
      {
        question: 'În cât timp se văd rezultate?',
        answer:
          'Claritatea apare de obicei repede, de multe ori chiar din prima sesiune de analiză. Rezultatele de business urmează deciziilor pe care le iei după. Scopul nu este să devii dependent de un consultant, ci să îți construiești propriul sistem de claritate și decizie.',
      },
    ],
  },

  cta: {
    eyebrow: { text: 'Primul pas', ornament: 'pulse' },
    heading: 'Dacă ai ajuns până aici, probabil ai deja o decizie în minte.',
    body: 'Prima discuție este despre situația ta, nu despre pachete. Dacă nu este potrivit să lucrăm împreună, îți spun.',
    cta: { label: 'Programează o discuție', href: '/contact' },
    note: 'Răspund în maximum 24 de ore lucrătoare',
  },
}
