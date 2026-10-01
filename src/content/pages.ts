import { homeContent } from './home'
import type { AboutContent, Eyebrow, ImageSlotContent, StaticPage } from './types'

/**
 * Textul paginilor interioare.
 *
 * Aceeași regulă ca la homepage: acesta este ȘI fallback-ul când CMS-ul n-a
 * fost completat, ȘI sursa din care seed-ul populează CMS-ul. Un singur text,
 * deci cele două nu pot devia.
 *
 * Diacritice cu virgulă: ș (U+0219), ț (U+021B). Niciodată sedilă.
 */

const NO_SEO = {
  metaTitle: null,
  metaDescription: null,
  ogImage: null,
  noIndex: false,
} as const

/* -------------------------------------------------------------------------- */
/* Despre mine                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Pagina Despre extinde teaserul aprobat de pe homepage — același titlu,
 * aceleași paragrafe, aceleași repere. Nu inventăm biografie: textul lung îl
 * scrie Adriana, în admin, iar când o face, `narrative` îl înlocuiește pe
 * acesta (blocaj §7 din STATUS.md).
 */
export const aboutFallback: AboutContent = {
  eyebrow: { text: 'Despre mine', ornament: 'line' },
  title: homeContent.despre.heading,
  lead: homeContent.despre.paragraphs[0] ?? '',
  narrative: null,
  paragraphs: homeContent.despre.paragraphs.slice(1),
  portrait: {
    ...homeContent.despre.portrait,
    placeholderLabel: 'Portret · Despre',
  },
  credentials: homeContent.despre.credentials.map((text) => ({ text, detail: null })),
  /**
   * Cele patru principii ale filosofiei de lucru (brief §2). Secțiunea
   * `valori` de pe homepage are cinci valori și le rezumă; aici sunt primele
   * patru, desfășurate, cu textul lor verbatim — nu scriem principii pe care
   * clienta nu le-a aprobat.
   */
  principles: homeContent.valori.values.slice(0, 4).map((value, index) => ({
    index: String(index + 1).padStart(2, '0'),
    title: value.title,
    body: value.body,
  })),
  seo: NO_SEO,
}

/* -------------------------------------------------------------------------- */
/* Antetele paginilor de listă                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Fotografiile din antetele paginilor interioare, din ședința foto a clientei.
 * Raportul slotului e chiar raportul fișierului, deci `object-cover` nu taie
 * nimic și `objectPosition` nu are ce corecta.
 */
const serviciiImage: ImageSlotContent = {
  slot: 'page-wide',
  src: '/images/adriana-servicii.jpg',
  alt: 'Adriana Chira în sesiune de lucru, față în față cu un client',
  width: 1600,
  height: 1067,
  placeholderLabel: 'Fotografie · Servicii',
}

const blogImage: ImageSlotContent = {
  slot: 'page-portrait',
  src: '/images/adriana-blog.jpg',
  alt: 'Adriana Chira, portret în fotoliu',
  width: 1067,
  height: 1600,
  placeholderLabel: 'Fotografie · Blog',
}

const contactImage: ImageSlotContent = {
  slot: 'page-portrait',
  src: '/images/adriana-contact.jpg',
  alt: 'Adriana Chira, portret în cabinet',
  width: 1067,
  height: 1600,
  placeholderLabel: 'Fotografie · Contact',
}

export const serviciiPage = {
  eyebrow: homeContent.servicii.eyebrow satisfies Eyebrow,
  title: homeContent.servicii.heading,
  lead: homeContent.servicii.intro,
  reassurance: homeContent.servicii.reassurance,
  image: serviciiImage,
  metaDescription:
    'Dincolo de coaching: evaluare strategică, programe individuale și workshopuri de performanță umană pentru antreprenori și manageri. Timișoara și online.',
}

export const blogPage = {
  eyebrow: homeContent.blog.eyebrow satisfies Eyebrow,
  title: homeContent.blog.heading,
  lead: 'Texte despre felul în care oamenii decid, se blochează și își recapătă claritatea.',
  image: blogImage,
  metaDescription:
    'Articole despre performanță umană, decizii dificile, blocaje și dezvoltare personală pentru antreprenori și lideri. Scrise de Adriana Chira, Timișoara.',
  /** Câte articole pe pagină. Promptul §5.3 cere 9. */
  perPage: 9,
  empty: 'Primele articole sunt în lucru. Revino în curând.',
}

export const contactPage = {
  eyebrow: { text: 'Primul pas', ornament: 'pulse' } as Eyebrow,
  title: 'Scrie-mi despre situația ta.',
  lead: homeContent.cta.body,
  image: contactImage,
  formIntro:
    'Completează formularul și îți răspund personal. Nu primești newsletter, nu ajungi pe nicio listă și nu te sună nimeni fără să fi cerut asta.',
  privacyNote:
    'Datele din formular sunt folosite exclusiv ca să îți răspund. Nu sunt trimise nimănui altcuiva și se șterg după 12 luni.',
  bookingIntro:
    'Preferi direct în calendar? Widgetul de programare se încarcă doar când apeși butonul.',
  /**
   * Câmpurile sunt exact cele din prompt §5.3: nume, email, telefon opțional,
   * mesaj, bifă de consimțământ neprebifată. Nimic în plus — fiecare câmp în
   * plus scade rata de completare, iar restul se află în discuție.
   */
  labels: {
    name: 'Nume',
    email: 'Email',
    phone: 'Telefon (opțional)',
    message: 'Mesaj',
    consent:
      'Am citit politica de confidențialitate și sunt de acord ca datele mele să fie folosite ca să primesc un răspuns.',
    submit: 'Trimite mesajul',
    sending: 'Se trimite…',
  },
  /** Textul precompletat când cineva vine de pe pagina unui pachet. */
  packagePrefill: (name: string) => `Bună, Adriana. Mă interesează pachetul „${name}".\n\n`,

  /**
   * Cererea de ofertă, pentru programele cu preț la cerere. Întrebările din
   * listă sunt exact ce trebuie să știe Adriana ca să poată face o ofertă —
   * omul le bifează în loc să ghicească ce să scrie.
   */
  quotePrefill: (name: string) =>
    `Bună, Adriana. Aș vrea o ofertă pentru programul „${name}".\n\nPe scurt, situația mea:\n\n\nPrefer:\n- [ ] online\n- [ ] față în față, în Timișoara\n\nFactura pe:\n- [ ] persoană fizică\n- [ ] firmă\n\n`,

  /** CTA-ul din antetul paginii de contact, care coboară la formular. */
  heroCta: 'Scrie-mi acum',
  heroCtaNote: 'Durează două minute. Fără listă de email, fără apeluri necerute.',

  /** Titlul cardului cu formularul, când omul a venit să ceară o ofertă. */
  quoteFormTitle: 'Cere o ofertă personalizată',

  /**
   * Precompletarea pentru workshopuri.
   *
   * Trei texte, nu unul, pentru că cele trei situații cer răspunsuri diferite:
   * o ediție deschisă la care omul plătește prin transfer, o ediție fără
   * dată la care își anunță interesul, și cazul în care plata online tocmai a
   * refuzat să pornească. Un singur text generic ar fi obligat-o pe Adriana să
   * ghicească la fiecare mesaj despre ce e vorba.
   */
  workshopPrefill: (name: string, date: string | null) =>
    date
      ? `Bună, Adriana. Vreau să rezerv un loc la workshopul „${name}", ediția din ${date}, fără plată online.\n\nAm nevoie de:\n- [ ] plată prin transfer bancar\n- [ ] altceva:\n\nNumăr de locuri: 1\n\n`
      : `Bună, Adriana. Mă interesează workshopul „${name}".\n\n`,

  waitlistPrefill: (name: string) =>
    `Bună, Adriana. Mă interesează workshopul „${name}" și aș vrea să știu când se programează următoarea ediție.\n\n`,

  /**
   * Nota afișată deasupra formularului când cineva ajunge aici pentru că plata
   * online nu a pornit. Nu spune „a apărut o eroare": pentru omul de la
   * celălalt capăt, ce contează e că poate cumpăra oricum.
   */
  checkoutFallbackNote:
    'Plata online nu a putut fi pornită acum. Nu s-a debitat nimic. Scrie-mi aici și îți trimit personal datele de plată sau factura proformă, în cel mult 24 de ore lucrătoare.',
  success: {
    title: 'Mesajul a plecat.',
    body: 'Îți răspund personal, de obicei în aceeași zi lucrătoare.',
  },
  error: {
    title: 'Mesajul nu a putut fi trimis.',
    body: 'Încearcă din nou peste câteva momente sau scrie-mi direct pe email.',
  },
}

export const thanksPage = {
  eyebrow: { text: 'Confirmare', ornament: 'line' } as Eyebrow,
  title: 'Plata a fost înregistrată.',
  lead: 'Primești pe email confirmarea și factura. Îți scriu personal în cel mult 24 de ore lucrătoare ca să stabilim primul interval.',
  steps: [
    {
      index: '01',
      title: 'Confirmarea pe email',
      body: 'Ajunge în câteva minute. Dacă nu o vezi, verifică și folderul de spam.',
    },
    {
      index: '02',
      title: 'Mesajul meu',
      body: 'Îți scriu ca să stabilim prima sesiune și ce ar fi util să pregătești până atunci.',
    },
    {
      index: '03',
      title: 'Prima sesiune',
      body: 'Online sau față în față, în Timișoara. Începem de la situația ta, nu de la teorie.',
    },
  ],
}

export const canceledPage = {
  eyebrow: { text: 'Comandă neterminată', ornament: 'line' } as Eyebrow,
  title: 'Comanda nu a fost finalizată.',
  lead: 'Nu ți s-a debitat nimic. Poți relua oricând sau, dacă preferi, putem vorbi mai întâi.',
}

/* -------------------------------------------------------------------------- */
/* Paginile legale                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Politica de confidențialitate, politica de cookie-uri și termenii.
 *
 * Rescrise pe 1 octombrie 2026 pornind de la modelul trimis de clientă
 * (politica de pe adrenalinconcept.ro) și de la ce face CHIAR acest site:
 * formularul de contact, cererea de ofertă, resursele descărcabile cu
 * formular, plata prin Stripe, emailurile prin Resend, GA4 doar după
 * consimțământ. Modelul era șablonul WordPress (comentarii, Gravatar,
 * conturi de utilizator) — nimic din toate acestea nu există aici, deci nu a
 * fost preluat; a rămas ce era adevărat: operatorul, sediul, telefonul,
 * partajarea cu firma care administrează site-ul, rețelele sociale.
 *
 * Fiecare afirmație de aici trebuie să rămână adevărată despre cod. Dacă
 * adaugi un script terț, un cookie sau un formular, actualizează textul ȘI
 * `LEGAL_UPDATED` — iar dacă se schimbă categoriile de consimțământ, crește
 * `CONSENT_VERSION` din `src/lib/consent.ts`, ca bara să reapară pentru toți.
 *
 * Denumirea firmei, CUI-ul și sediul NU se scriu aici: vin din
 * `site-settings` și se randează în blocul „Date de identificare".
 */

/**
 * Nota „Document în lucru" de pe fiecare pagină legală. Oprită pe 1 octombrie
 * 2026, odată cu textul complet. Se repornește dintr-un singur loc, dacă
 * textele intră din nou în revizie.
 */
export const LEGAL_DRAFT = false

/**
 * Data ultimei revizuiri. Se actualizează la fiecare modificare de fond. Se
 * salvează și pe fiecare solicitare de resursă, ca dovadă a versiunii
 * acceptate (`resource-requests.policyVersion`).
 */
const LEGAL_UPDATED = '2026-10-01'

const CONTACT_EMAIL = 'contact@adrianachira.ro'
const CONTACT_PHONE = '+40 723 573 123'

export const privacyPage: StaticPage = {
  slug: 'politica-de-confidentialitate',
  eyebrow: { text: 'Politica de confidențialitate', ornament: 'line' },
  title: 'Ce date colectez, de ce și cât timp le păstrez.',
  lead: 'Regulamentul (UE) 2016/679 (GDPR) îmi cere să îți spun exact asta. Am scris-o în limba în care vorbesc, nu în limba în care se scriu de obicei politicile.',
  updatedAt: LEGAL_UPDATED,
  sections: [
    {
      heading: 'Cine este operatorul datelor',
      paragraphs: [
        'Site-ul adrianachira.ro aparține Adrianei Chira, consultant în performanță umană, care își desfășoară activitatea prin firma Adrenalin Mirific Concept SRL. Firma este operatorul datelor tale personale; datele ei complete de identificare sunt la finalul acestei pagini.',
        `Pentru orice întrebare sau cerere legată de datele tale îmi scrii la ${CONTACT_EMAIL} sau mă suni la ${CONTACT_PHONE}. Nu am desemnat un responsabil cu protecția datelor, pentru că activitatea nu se încadrează în situațiile în care legea îl impune; cererile ajung direct la mine.`,
      ],
    },
    {
      heading: 'Ce date colectez și de ce',
      paragraphs: [
        'Colectez doar datele de care am nevoie pentru un scop anume. Iată fiecare situație, cu datele pe care le implică:',
      ],
      list: [
        'Formularul de contact și cererea de ofertă: numele, adresa de email, opțional numărul de telefon și mesajul tău. Le folosesc ca să îți răspund și, dacă îmi ceri, ca să îți fac o ofertă.',
        'Resursele descărcabile cu formular (ghiduri, fișe de lucru): prenumele, numele, adresa de email, numărul de telefon și articolul din care ai cerut documentul. Le folosesc ca să îți trimit documentul și ca să te pot contacta în legătură cu el, de exemplu ca să te întreb dacă ți-a fost util. Resursele marcate „Gratuit, direct" se descarcă fără niciun formular.',
        'Noutățile pe email, doar dacă bifezi separat această opțiune: adresa de email și numele, ca să îți trimit ocazional articole noi și anunțuri despre workshopuri.',
        'Cumpărarea unui program sau a unui loc la workshop: numele, adresa de email, telefonul, datele de facturare și detaliile comenzii. Datele cardului NU trec prin acest site și nu ajung niciodată la mine — sunt introduse și procesate direct de Stripe.',
        'Colaborarea propriu-zisă: informațiile pe care mi le împărtășești în sesiuni și notele mele de lucru. Sunt confidențiale, se păstrează separat de site și nu sunt încărcate niciodată aici.',
        'Vizitarea site-ului: furnizorul de găzduire înregistrează automat, pentru securitate, adresa IP, tipul de browser și paginile cerute. Dacă accepți categoria „Analiză", Google Analytics adaugă date statistice despre cum este folosit site-ul.',
      ],
      after: [
        'Nu folosesc datele tale pentru decizii automate și nu creez profiluri care să producă efecte juridice asupra ta.',
      ],
    },
    {
      heading: 'Pe ce temei legal',
      paragraphs: ['Fiecare prelucrare are un temei din art. 6 alin. (1) GDPR:'],
      list: [
        'Consimțământul tău (lit. a) — pentru formularul de contact, resursele cu formular, noutățile pe email și analiza traficului. Ți-l poți retrage oricând, la fel de simplu cum l-ai dat; retragerea nu afectează prelucrarea făcută înainte.',
        'Încheierea și executarea unui contract (lit. b) — pentru cererile de ofertă, comenzi, programarea sesiunilor și desfășurarea colaborării.',
        'O obligație legală (lit. c) — pentru facturare și arhivarea documentelor contabile.',
        'Interesul legitim (lit. f) — pentru securitatea site-ului: jurnalele tehnice ale serverului și limitarea numărului de mesaje trimise de pe aceeași adresă, ca protecție împotriva spamului.',
      ],
      after: [
        'Dacă în sesiuni îmi spui lucruri despre sănătatea ta, le folosesc doar în măsura în care tu alegi să le aduci în discuție, cu acordul tău explicit (art. 9 alin. (2) lit. a), și numai pentru colaborarea noastră.',
      ],
    },
    {
      heading: 'Ești obligat să îmi dai aceste date?',
      paragraphs: [
        'Nu. Câmpurile marcate obligatorii sunt cele fără de care nu pot face ce îmi ceri: nu îți pot răspunde fără o adresă de email și nu îți pot trimite un document fără datele din formularul lui. Dacă nu vrei să le completezi, îmi poți scrie direct pe email sau mă poți suna.',
        'Pentru o comandă, datele de facturare sunt cerute de lege.',
      ],
    },
    {
      heading: 'Cât timp păstrez datele',
      paragraphs: [],
      list: [
        'Mesajele din formularul de contact: 12 luni de la primire, apoi se șterg.',
        'Solicitările de resurse: 12 luni. Dacă ai bifat noutățile pe email, datele rămân până te dezabonezi; din acel moment pornesc din nou cele 12 luni.',
        'Comenzile și facturile: 10 ani, cât impune Legea contabilității nr. 82/1991.',
        'Datele din colaborare: pe durata colaborării și cel mult 3 ani după încheierea ei, pentru eventuale reveniri sau reclamații — apoi se distrug.',
        'Datele de analiză din Google Analytics: 14 luni, agregate.',
        'Jurnalele tehnice ale serverului: cel mult 30 de zile.',
      ],
    },
    {
      heading: 'Cui transmit datele',
      paragraphs: [
        'Nu vând, nu închiriez și nu schimb date personale. Le transmit doar furnizorilor fără de care site-ul și activitatea nu ar funcționa, fiecare legat printr-un contract de prelucrare a datelor, conform art. 28 GDPR:',
      ],
      list: [
        'Vercel Inc. — găzduirea site-ului și stocarea fișierelor.',
        'Neon Inc. — baza de date, pe servere din Uniunea Europeană (Frankfurt).',
        'Stripe Payments Europe Ltd. (Irlanda) — procesarea plăților cu cardul.',
        'Resend Inc. — trimiterea emailurilor automate: confirmări și linkuri de descărcare.',
        'Google Ireland Ltd. — Google Analytics 4, doar dacă ai acceptat categoria „Analiză".',
        'Pixel Factory SRL (Website Factory), Timișoara — dezvoltarea și mentenanța tehnică a site-ului, cu obligație contractuală de confidențialitate.',
      ],
      after: [
        'Autorităților publice le transmit date doar când legea mă obligă; în acest caz, te anunț, dacă legea îmi permite.',
      ],
    },
    {
      heading: 'Transferuri în afara Uniunii Europene',
      paragraphs: [
        'Vercel, Resend și Google pot prelucra date și în Statele Unite. Transferul se face fie către companii certificate în cadrul EU-U.S. Data Privacy Framework, pe baza deciziei de adecvare a Comisiei Europene din 10 iulie 2023, fie pe baza clauzelor contractuale standard aprobate de Comisie (art. 46 GDPR).',
      ],
    },
    {
      heading: 'Ce drepturi ai',
      paragraphs: ['În legătură cu datele tale ai dreptul:'],
      list: [
        'să afli dacă îți prelucrez datele și să primești o copie a lor (dreptul de acces);',
        'să le corectezi dacă sunt greșite sau incomplete (rectificare);',
        'să ceri ștergerea lor, în afara celor pe care legea mă obligă să le păstrez (ștergere);',
        'să ceri limitarea prelucrării, de exemplu cât timp verificăm o contestație (restricționare);',
        'să le primești într-un format structurat sau să le transmit altui operator (portabilitate);',
        'să te opui prelucrării bazate pe interes legitim și, oricând, oricărei comunicări de prezentare (opoziție);',
        'să îți retragi consimțământul oricând — pentru cookie-uri, din linkul „Setări cookie-uri" din subsolul fiecărei pagini; pentru noutăți, din linkul de dezabonare din orice email de noutăți sau cu un simplu email.',
      ],
      after: [
        'Dacă răspunsul meu nu te mulțumește, poți depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP), B-dul G-ral Gheorghe Magheru nr. 28–30, sector 1, București, anspdcp@dataprotection.ro, www.dataprotection.ro.',
      ],
    },
    {
      heading: 'Cum îți exerciți drepturile',
      paragraphs: [
        `Îmi scrii la ${CONTACT_EMAIL}, cu cererea ta. Nu ai nevoie de un formular anume și nu plătești nimic. Îți răspund în cel mult o lună; dacă cererea e complexă, termenul se poate prelungi cu încă două luni, iar în acest caz te anunț în prima lună.`,
        'Ca să nu dau datele cuiva care se dă drept tine, s-ar putea să îți cer o confirmare de identitate — de regulă, ajunge să îmi scrii de pe adresa de email pe care ai folosit-o pe site.',
      ],
    },
    {
      heading: 'Securitate',
      paragraphs: [
        'Site-ul rulează exclusiv pe HTTPS. Panoul de administrare este protejat prin parolă și accesibil doar persoanelor care au nevoie de el; mesajele și solicitările nu sunt vizibile public și nu pot fi citite prin API. Datele cardului nu ating niciodată infrastructura acestui site.',
        'Documentele descărcabile cu formular se servesc doar printr-un link semnat, valabil 7 zile. Dacă afli de o problemă de securitate, te rog să mi-o semnalezi pe email.',
      ],
    },
    {
      heading: 'Copiii',
      paragraphs: [
        'Serviciile mele se adresează adulților. Nu colectez cu bună știință date de la persoane sub 16 ani; dacă afli că s-a întâmplat, scrie-mi și le șterg.',
      ],
    },
    {
      heading: 'Cookie-uri și rețele sociale',
      paragraphs: [
        'Ce se scrie în browserul tău și când este explicat separat, în Politica de cookie-uri. Pe scurt: nimic în afară de alegerea ta nu se salvează înainte să îți dai acordul.',
        'Butoanele de partajare (LinkedIn, WhatsApp, email) sunt linkuri simple: nu încarcă niciun script al rețelelor sociale și nu le transmit nimic până nu apeși pe ele. Dacă mă urmărești pe Facebook, Instagram sau LinkedIn, acolo se aplică politicile acelor platforme.',
      ],
    },
    {
      heading: 'Modificări ale acestei politici',
      paragraphs: [
        'Când se schimbă ceva de fond — un furnizor nou, un scop nou —, actualizez pagina și data de mai sus. Dacă schimbarea privește consimțământul pentru cookie-uri, bara de alegere reapare, ca să decizi din nou.',
      ],
    },
  ],
}

export const cookiesPage: StaticPage = {
  slug: 'politica-de-cookies',
  eyebrow: { text: 'Politica de cookie-uri', ornament: 'line' },
  title: 'Ce se scrie în browserul tău și când.',
  lead: 'Site-ul pornește fără niciun cookie de analiză și fără niciun script terț. Nimic nu se încarcă înainte să alegi tu.',
  updatedAt: LEGAL_UPDATED,
  sections: [
    {
      heading: 'Ce sunt cookie-urile',
      paragraphs: [
        'Cookie-urile sunt fișiere mici de text pe care un site le salvează în browserul tău, ca să își amintească ceva între două pagini sau între două vizite. Unele sunt necesare ca site-ul să funcționeze; altele, de exemplu cele de analiză, sunt opționale și au nevoie de acordul tău, conform Legii nr. 506/2004 și GDPR.',
      ],
    },
    {
      heading: 'Cum îți dai sau îți refuzi acordul',
      paragraphs: [
        'La prima vizită, în partea de jos a ecranului apare bara de cookie-uri, cu trei butoane de aceeași mărime: „Refuz toate", „Setări" și „Accept toate". Din „Setări" alegi categoriile una câte una — „Analiză" și „Marketing" pornesc nebifate — și apeși „Salvează preferințele".',
        'Dacă închizi pagina fără să alegi, nu se consideră acord: nimic opțional nu se încarcă, iar bara reapare la vizita următoare.',
        'Alegerea ta se păstrează 6 luni. După aceea, sau dacă schimb ceva în categoriile de mai jos, te întreb din nou.',
      ],
    },
    {
      heading: 'Cookie-urile folosite pe acest site',
      paragraphs: [],
      table: {
        caption: 'Cookie-urile folosite pe adrianachira.ro, cu categoria, furnizorul, scopul și durata fiecăruia',
        columns: ['Nume', 'Categorie', 'Furnizor', 'Scop', 'Durată'],
        rows: [
          ['ac_consent', 'Strict necesar', 'adrianachira.ro', 'Ține minte alegerea ta din bara de cookie-uri, ca să nu te întreb la fiecare pagină. Nu te identifică.', '6 luni'],
          ['_ga', 'Analiză', 'Google Analytics 4', 'Deosebește vizitatorii între ei, statistic, ca să știu câți oameni citesc site-ul. Doar după acord.', '2 ani'],
          ['_ga_<ID>', 'Analiză', 'Google Analytics 4', 'Păstrează starea vizitei curente: ce pagini s-au citit și în ce ordine. Doar după acord.', '2 ani'],
          ['payload-token', 'Strict necesar', 'adrianachira.ro', 'Autentificarea în panoul de administrare. Apare doar la persoanele care administrează site-ul, niciodată la vizitatori.', '8 ore'],
        ],
      },
      after: [
        'Categoria „Marketing" există în panoul de setări ca să poată fi folosită corect dacă se va adăuga vreodată ceva, nu pentru că ar exista ceva astăzi: în acest moment nu folosesc niciun cookie de marketing sau de publicitate.',
      ],
    },
    {
      heading: 'Google Analytics, doar după acord',
      paragraphs: [
        'Scriptul Google Analytics nu este descărcat deloc până nu accepți categoria „Analiză". Nu e un script care așteaptă în pagină, cu cookie-urile oprite: pur și simplu nu există. Abia după acordul tău se încarcă. Google Analytics 4 nu stochează adresele IP ale vizitatorilor.',
        'Dacă îți retragi acordul, scriptul nu se mai încarcă de la pagina următoare. Cookie-urile _ga deja salvate le poți șterge din browser, ca orice cookie.',
      ],
    },
    {
      heading: 'Cookie-uri ale terților',
      paragraphs: [
        'Când începi o plată, ești trimis pe pagina securizată Stripe (checkout.stripe.com). Acolo se aplică politica de cookie-uri a Stripe, necesară pentru plată și pentru prevenirea fraudei. Pe acest site nu rămâne nimic de la ei.',
        'Butoanele de partajare sunt linkuri simple și nu încarcă niciun cookie al rețelelor sociale.',
      ],
    },
    {
      heading: 'Cum îți schimbi alegerea',
      paragraphs: [
        'Din linkul „Setări cookie-uri" aflat în subsolul fiecărei pagini. Bara se redeschide și îți poți schimba alegerea oricând, la fel de simplu cum ai făcut-o prima dată.',
        'Poți șterge sau bloca cookie-urile și direct din browser, din setările de confidențialitate (Chrome, Firefox, Safari, Edge au fiecare o secțiune „Cookie-uri și date ale site-urilor"). Dacă blochezi și cookie-ul ac_consent, bara va reapărea la fiecare vizită.',
      ],
    },
    {
      heading: 'Întrebări',
      paragraphs: [
        `Pentru orice întrebare despre cookie-uri îmi scrii la ${CONTACT_EMAIL}. Despre restul datelor personale găsești totul în Politica de confidențialitate.`,
      ],
    },
  ],
}

export const termsPage: StaticPage = {
  slug: 'termeni-si-conditii',
  eyebrow: { text: 'Termeni și condiții', ornament: 'line' },
  title: 'În ce condiții lucrăm împreună.',
  lead: 'Termenii de mai jos se aplică folosirii site-ului adrianachira.ro și serviciilor cumpărate sau rezervate prin el.',
  updatedAt: LEGAL_UPDATED,
  sections: [
    {
      heading: 'Cine vinde și cui se aplică',
      paragraphs: [
        'Serviciile prezentate pe site sunt oferite de Adriana Chira prin firma Adrenalin Mirific Concept SRL („vânzătorul"), ale cărei date complete de identificare sunt la finalul acestei pagini. „Clientul" ești tu, persoana fizică sau juridică ce cumpără, rezervă sau cere o ofertă prin site.',
        'Folosind site-ul sau plasând o comandă, accepți acești termeni. Dacă nu ești de acord cu ei, te rog să nu plasezi comanda și să îmi scrii — găsim împreună varianta potrivită.',
      ],
    },
    {
      heading: 'Ce servicii ofer',
      paragraphs: [
        'Servicii de consultanță în performanță umană: evaluare strategică, programe individuale pe mai multe săptămâni sau luni și workshopuri de o zi. Pagina fiecărui program descrie explicit ce include, cât durează, în ce format se desfășoară și pentru cine este potrivit.',
        'Consultanța în performanță umană nu este psihoterapie, nu tratează afecțiuni psihice și nu înlocuiește un consult medical, psihologic sau psihiatric. Dacă situația ta cere altceva, îți spun și te îndrum spre specialistul potrivit.',
      ],
    },
    {
      heading: 'Prețuri',
      paragraphs: [
        'Prețurile sunt afișate în lei (RON) și sunt prețurile finale pe care le plătești pentru serviciul respectiv. Pentru programele marcate „Solicită ofertă" prețul se stabilește printr-o ofertă personalizată, transmisă în scris înainte de orice plată.',
        'Pot modifica prețurile oricând, dar o modificare nu se aplică unei comenzi deja plătite sau unei oferte deja acceptate.',
      ],
    },
    {
      heading: 'Comanda și plata',
      paragraphs: [
        'Comanda online se face din pagina programului sau a workshopului. Plata se procesează prin Stripe, cu cardul bancar, pe pagina securizată a acestuia. Factura se emite pe numele persoanei fizice sau al firmei indicate la plată.',
        'Contractul se consideră încheiat în momentul în care primești pe email confirmarea plății. Pentru serviciile pe bază de ofertă, contractul se încheie la acceptarea scrisă a ofertei.',
        'Dacă preferi să plătești prin transfer bancar, folosești opțiunea „Rezervă fără plată online" sau îmi scrii: îți trimit personal factura proformă, iar rezervarea devine fermă la încasarea sumei.',
      ],
    },
    {
      heading: 'Programarea sesiunilor',
      paragraphs: [
        'După confirmarea plății te contactez în cel mult 24 de ore lucrătoare, ca să stabilim intervalele. Sesiunile se desfășoară online sau față în față, în Timișoara, cum convenim.',
        'O sesiune poate fi reprogramată fără cost dacă mă anunți cu cel puțin 24 de ore înainte. O sesiune la care nu te prezinți și pe care nu ai anunțat-o se consideră consumată. Dacă eu sunt nevoită să reprogramez, îți propun un interval nou cât mai apropiat, fără niciun cost pentru tine.',
      ],
    },
    {
      heading: 'Workshopurile',
      paragraphs: [
        'Locurile la fiecare ediție sunt limitate și se ocupă în ordinea plăților. Online se pot cumpăra doar edițiile cu dată anunțată; pentru celelalte te poți înscrie pe lista de așteptare din pagina workshopului.',
        'Dacă o ediție se anulează sau se mută din motive care țin de mine, îți propun o altă dată sau îți restitui integral suma plătită, la alegerea ta, în cel mult 14 zile.',
        'Dacă tu nu mai poți participa, se aplică Politica de retur.',
      ],
    },
    {
      heading: 'Dreptul de retragere',
      paragraphs: [
        'Ca și consumator, ai dreptul să te retragi din contract în 14 zile, conform OUG nr. 34/2014. Cum se aplică acest drept unui serviciu de consultanță, inclusiv când serviciul a început deja la cererea ta, este explicat în Politica de retur.',
      ],
    },
    {
      heading: 'Confidențialitate',
      paragraphs: [
        'Tot ce discutăm în sesiuni este confidențial. Nu folosesc situații identificabile în materiale publice, în articole sau în discuții cu terți. Excepția sunt situațiile în care legea mă obligă să divulg o informație.',
        'Cum prelucrez datele tale personale este explicat în Politica de confidențialitate.',
      ],
    },
    {
      heading: 'Proprietate intelectuală',
      paragraphs: [
        'Textele, articolele, metodele (inclusiv CHIRA Model™, CLAR™, Human Performance Map™), documentele descărcabile și materialele primite în programe îmi aparțin și sunt protejate de Legea nr. 8/1996 privind dreptul de autor.',
        'Le poți folosi pentru tine. Le poți cita, cu indicarea sursei și cu link către pagina originală. Nu le poți reproduce integral, distribui, vinde sau folosi în propriile tale programe sau traininguri fără acordul meu scris.',
      ],
    },
    {
      heading: 'Limitarea răspunderii',
      paragraphs: [
        'Deciziile pe care le iei rămân ale tale. Rolul consultanței este să îți dea claritate, instrumente și perspectivă, nu să îți garanteze un anumit rezultat profesional, financiar sau de business. Nu răspund pentru consecințele deciziilor luate de tine în urma sesiunilor sau a materialelor de pe site.',
        'Fac tot ce ține de mine ca site-ul să funcționeze corect și informațiile să fie actuale, dar nu pot garanta că va fi disponibil fără întrerupere.',
      ],
    },
    {
      heading: 'Forța majoră',
      paragraphs: [
        'Niciuna dintre părți nu răspunde pentru neîndeplinirea obligațiilor dacă aceasta se datorează unui caz de forță majoră, în sensul Codului civil. Partea afectată o anunță pe cealaltă cât mai repede, iar sesiunile se reprogramează.',
      ],
    },
    {
      heading: 'Reclamații și soluționarea litigiilor',
      paragraphs: [
        `Orice nemulțumire îmi scrii mai întâi la ${CONTACT_EMAIL}. Îți răspund în cel mult 30 de zile și caut împreună cu tine o soluție.`,
        'Dacă nu ajungem la o înțelegere, te poți adresa Autorității Naționale pentru Protecția Consumatorilor (ANPC, www.anpc.ro) sau poți apela la soluționarea alternativă a litigiilor (SAL), prin entitățile prezentate pe anpc.ro.',
      ],
    },
    {
      heading: 'Legea aplicabilă',
      paragraphs: [
        'Acestor termeni și contractelor încheiate prin site li se aplică legea română. Litigiile care nu se pot rezolva pe cale amiabilă se soluționează de instanțele competente potrivit legii; dacă ești consumator, ai întotdeauna dreptul să te adresezi instanței de la domiciliul tău.',
      ],
    },
    {
      heading: 'Modificarea termenilor',
      paragraphs: [
        'Pot actualiza acești termeni; versiunea în vigoare este cea publicată aici, cu data de mai sus. Unei comenzi i se aplică termenii valabili în momentul plasării ei.',
      ],
    },
  ],
}

export const refundPage: StaticPage = {
  slug: 'politica-de-retur',
  eyebrow: { text: 'Politica de retur', ornament: 'line' },
  title: 'Dreptul de retragere și cum se aplică aici.',
  lead: 'Legislația privind contractele la distanță îți dă 14 zile să te răzgândești. Iată exact cum funcționează pentru un serviciu de consultanță.',
  updatedAt: LEGAL_UPDATED,
  sections: [
    {
      heading: 'Cele 14 zile',
      paragraphs: [
        'Ai dreptul să te retragi din contract în termen de 14 zile calendaristice de la încheierea lui, fără să invoci vreun motiv și fără costuri suplimentare.',
        'Îmi trimiți un email cu decizia ta. Nu ai nevoie de un formular anume și nu îți cer explicații.',
      ],
    },
    {
      heading: 'Excepția pentru servicii deja începute',
      paragraphs: [
        'Dacă alegi ca serviciul să înceapă înainte de expirarea celor 14 zile — adică programăm și ținem prima sesiune —, îți cer o confirmare explicită în acest sens la programare.',
        'În acel caz, dacă te retragi ulterior, datorezi contravaloarea a ceea ce s-a prestat efectiv până la momentul retragerii, proporțional cu pachetul achiziționat. Restul se restituie.',
        'Dacă serviciul a fost executat integral cu acordul tău prealabil, dreptul de retragere se stinge.',
      ],
    },
    {
      heading: 'Cum se face restituirea',
      paragraphs: [
        'Restitui suma cuvenită în cel mult 14 zile de la data la care am fost informat despre retragere, folosind aceeași metodă de plată. Nu percep niciun comision pentru restituire.',
      ],
    },
    {
      heading: 'Dacă serviciul nu ți se pare potrivit',
      paragraphs: [
        'Independent de termenul legal: dacă după prima sesiune consideri că nu are sens să continuăm, îmi spui și oprim. Restul pachetului se restituie integral. Nu am nevoie de o politică pentru asta, dar prefer să fie scris.',
      ],
    },
  ],
}

export const legalPages: StaticPage[] = [privacyPage, cookiesPage, termsPage, refundPage]
