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
    'Consultanță în performanță umană pentru antreprenori, manageri și profesioniști: evaluare strategică de 3 ore, program individual de 8 săptămâni, program executive de 6 luni și workshopuri de o zi. Timișoara și online.',
}

export const blogPage = {
  eyebrow: homeContent.blog.eyebrow satisfies Eyebrow,
  title: homeContent.blog.heading,
  lead: 'Texte despre felul în care oamenii decid, se blochează și își recapătă claritatea.',
  image: blogImage,
  metaDescription:
    'Articole despre performanță umană, procese de decizie și tiparele care ne blochează. Scrise de Adriana Chira, consultant în performanță umană.',
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
   * o ediție deschisă la care omul preferă factura pe firmă, o ediție fără
   * dată la care își anunță interesul, și cazul în care plata online tocmai a
   * refuzat să pornească. Un singur text generic ar fi obligat-o pe Adriana să
   * ghicească la fiecare mesaj despre ce e vorba.
   */
  workshopPrefill: (name: string, date: string | null) =>
    date
      ? `Bună, Adriana. Vreau să rezerv un loc la workshopul „${name}", ediția din ${date}, fără plată online.\n\nAm nevoie de:\n- [ ] factură pe firmă\n- [ ] plată prin transfer bancar\n- [ ] altceva:\n\nNumăr de locuri: 1\n\n`
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
 * TEXT ÎN LUCRU — se validează juridic înainte de lansare.
 *
 * Blocaj §7.10 din STATUS.md. Draftul de mai jos acoperă cerințele din brief
 * §11 (GDPR, ANPC, SOL, dreptul de retragere) și descrie situația reală a
 * site-ului — ce date se colectează chiar, ce cookie-uri există chiar. Nu
 * conține date de identificare inventate: acelea vin din `site-settings` și se
 * randează separat, ca placeholdere, până când clienta le completează.
 *
 * Fiecare pagină afișează vizibil o notă că textul așteaptă validare. Nota
 * dispare dintr-un singur loc — `LEGAL_DRAFT` — când juristul confirmă.
 */
export const LEGAL_DRAFT = true

/** Data ultimei revizuiri a draftului. Se actualizează la fiecare modificare. */
const LEGAL_UPDATED = '2026-08-24'

export const privacyPage: StaticPage = {
  slug: 'politica-de-confidentialitate',
  eyebrow: { text: 'Politica de confidențialitate', ornament: 'line' },
  title: 'Ce date colectez, de ce și cât timp le păstrez.',
  lead: 'Regulamentul (UE) 2016/679 îmi cere să îți spun exact asta. Am scris-o în limba în care vorbesc, nu în limba în care se scriu de obicei politicile.',
  updatedAt: LEGAL_UPDATED,
  sections: [
    {
      heading: 'Cine este operatorul de date',
      paragraphs: [
        'Operatorul datelor tale este entitatea identificată în subsolul acestui site, cu sediul în Timișoara, România. Datele de contact pentru orice cerere legată de datele personale sunt cele din pagina de contact.',
        'Nu am desemnat un responsabil cu protecția datelor, pentru că activitatea nu se încadrează în situațiile în care legea îl impune. Cererile ajung direct la mine.',
      ],
    },
    {
      heading: 'Ce date colectez',
      paragraphs: [
        'Colectez doar datele de care am nevoie ca să îți răspund și ca să îmi pot desfășura activitatea:',
      ],
      list: [
        'Din formularul de contact: numele, adresa de email, opțional numărul de telefon și mesajul scris de tine.',
        'Din achiziția unui pachet: numele, adresa de email și datele de facturare. Datele cardului NU trec prin acest site și nu ajung niciodată la mine — sunt procesate direct de Stripe.',
        'Din vizitarea site-ului, dacă ai acceptat analiza: date agregate despre paginile vizitate, sursa vizitei și tipul de dispozitiv.',
        'Din colaborarea propriu-zisă: notele de lucru din sesiuni, păstrate separat de site și niciodată încărcate aici.',
      ],
    },
    {
      heading: 'Pe ce temei legal',
      paragraphs: [
        'Pentru mesajele din formular și pentru analiza traficului, temeiul este consimțământul tău (art. 6 alin. 1 lit. a). Ți-l poți retrage oricând, iar retragerea nu afectează prelucrarea de dinainte.',
        'Pentru comenzi și facturare, temeiul este executarea contractului (art. 6 alin. 1 lit. b) și obligația legală de arhivare fiscală (art. 6 alin. 1 lit. c).',
      ],
    },
    {
      heading: 'Cât timp păstrez datele',
      paragraphs: [
        'Mesajele din formularul de contact se șterg după 12 luni de la primire.',
        'Documentele contabile se păstrează pe durata impusă de legislația fiscală din România.',
        'Datele de analiză se păstrează cel mult 14 luni și sunt agregate.',
      ],
    },
    {
      heading: 'Cui transmit datele',
      paragraphs: [
        'Nu vând și nu închiriez date personale. Le transmit doar furnizorilor de care am nevoie ca să funcționeze site-ul și activitatea:',
      ],
      list: [
        'Găzduirea site-ului și a bazei de date, în Uniunea Europeană.',
        'Stripe Payments Europe, pentru procesarea plăților.',
        'Furnizorul de email tranzacțional, pentru confirmările automate.',
        'Google Analytics 4, doar dacă ai acceptat categoria „Analiză".',
      ],
    },
    {
      heading: 'Ce drepturi ai',
      paragraphs: [
        'Ai dreptul de acces, de rectificare, de ștergere, de restricționare a prelucrării, de portabilitate și de opoziție. Ai și dreptul de a-ți retrage consimțământul oricând, iar pentru cookie-uri o poți face din linkul „Setări cookie-uri" din subsolul fiecărei pagini.',
        'Îmi poți trimite orice astfel de cerere pe adresa de email din pagina de contact. Îți răspund în cel mult 30 de zile.',
        'Dacă răspunsul meu nu te mulțumește, te poți adresa Autorității Naționale de Supraveghere a Prelucrării Datelor cu Caracter Personal, Bd. G-ral Gheorghe Magheru nr. 28–30, București, anspdcp.ro.',
      ],
    },
    {
      heading: 'Securitate',
      paragraphs: [
        'Site-ul rulează exclusiv pe HTTPS. Accesul la panoul de administrare este protejat prin parolă și limitat la persoanele care chiar au nevoie de el. Datele cardului nu ating niciodată infrastructura acestui site.',
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
      heading: 'Cookie-uri strict necesare',
      paragraphs: [
        'Un singur cookie intră în această categorie: ac_consent. Ține minte alegerea ta din bara de consimțământ, ca să nu te întreb la fiecare pagină. Trăiește 6 luni și nu conține date care să te identifice.',
        'Fără el, bara ar reapărea la fiecare vizită. De aceea nu poate fi refuzat — este chiar mecanismul prin care refuzi restul.',
      ],
    },
    {
      heading: 'Cookie-uri de analiză',
      paragraphs: [
        'Se instalează DOAR dacă apeși „Accept" sau bifezi categoria „Analiză" în panoul de setări. Sunt cookie-urile Google Analytics 4, folosite ca să știu ce pagini sunt citite și de unde vin oamenii.',
        'Până în acel moment, scriptul Google nu este descărcat deloc. Nu este vorba de un script care așteaptă: pur și simplu nu există în pagină.',
      ],
    },
    {
      heading: 'Cookie-uri de marketing',
      paragraphs: [
        'Nu folosesc niciunul. Categoria există în panoul de setări ca să poată fi activată corect dacă se va adăuga vreodată ceva, nu pentru că ar exista ceva astăzi.',
      ],
    },
    {
      heading: 'Cookie-uri ale terților la plată',
      paragraphs: [
        'Când începi o achiziție, ești trimis pe pagina securizată Stripe. Acolo se aplică politica de cookie-uri a Stripe. Pe acest site nu rămâne nimic de la ei.',
      ],
    },
    {
      heading: 'Cum îți schimbi alegerea',
      paragraphs: [
        'Din linkul „Setări cookie-uri" aflat în subsolul fiecărei pagini. Panoul se redeschide cu alegerile tale curente și le poți modifica oricând.',
        'Le poți șterge și direct din browser, din setările de confidențialitate. În acest caz, bara va reapărea la următoarea vizită.',
      ],
    },
  ],
}

export const termsPage: StaticPage = {
  slug: 'termeni-si-conditii',
  eyebrow: { text: 'Termeni și condiții', ornament: 'line' },
  title: 'În ce condiții lucrăm împreună.',
  lead: 'Documentul de față se aplică serviciilor de consultanță achiziționate prin acest site.',
  updatedAt: LEGAL_UPDATED,
  sections: [
    {
      heading: 'Ce serviciu cumperi',
      paragraphs: [
        'Serviciile oferite sunt de consultanță în performanță umană: evaluare, analiză comportamentală, conversație strategică și instrumente de lucru individual. Fiecare pachet descrie explicit ce include, cât durează și pentru cine este potrivit.',
        'Consultanța în performanță umană nu este psihoterapie, nu tratează afecțiuni psihice și nu înlocuiește un consult medical sau psihiatric. Dacă situația ta cere altceva, îți spun și te îndrum.',
      ],
    },
    {
      heading: 'Comandă și plată',
      paragraphs: [
        'Comanda se face online, din pagina pachetului. Plata se procesează prin Stripe, cu card bancar. Prețurile afișate sunt în euro, în regimul fiscal indicat în subsolul site-ului.',
        'Contractul se consideră încheiat în momentul în care primești confirmarea comenzii pe email.',
      ],
    },
    {
      heading: 'Programare și reprogramare',
      paragraphs: [
        'După confirmarea plății, te contactez în cel mult 24 de ore lucrătoare ca să stabilim intervalele.',
        'O sesiune poate fi reprogramată gratuit dacă mă anunți cu cel puțin 24 de ore înainte. O sesiune ratată fără anunț se consideră consumată.',
      ],
    },
    {
      heading: 'Confidențialitate',
      paragraphs: [
        'Tot ce discutăm în sesiuni este confidențial. Nu folosesc situații identificabile în materiale publice, în articole sau în discuții cu terți.',
      ],
    },
    {
      heading: 'Proprietate intelectuală',
      paragraphs: [
        'Textele, articolele și materialele de pe acest site îmi aparțin. Le poți cita cu indicarea sursei și cu link către pagina originală. Reproducerea integrală, fără acord scris, nu este permisă.',
      ],
    },
    {
      heading: 'Limitarea răspunderii',
      paragraphs: [
        'Deciziile pe care le iei rămân ale tale. Rolul consultanței este să îți dea claritate, nu să îți garanteze un rezultat de business. Nu îmi asum răspunderea pentru consecințele deciziilor luate de tine în urma sesiunilor.',
      ],
    },
    {
      heading: 'Soluționarea reclamațiilor',
      paragraphs: [
        'Orice nemulțumire se trimite mai întâi pe email, la adresa din pagina de contact. Îți răspund în cel mult 30 de zile.',
        'Te poți adresa și Autorității Naționale pentru Protecția Consumatorilor, anpc.ro, sau platformei europene de soluționare online a litigiilor, ec.europa.eu/consumers/odr.',
      ],
    },
    {
      heading: 'Legea aplicabilă',
      paragraphs: [
        'Contractului i se aplică legea română. Litigiile care nu se pot rezolva pe cale amiabilă sunt de competența instanțelor din Timișoara.',
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
