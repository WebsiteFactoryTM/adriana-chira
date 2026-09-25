import type { Eyebrow, Testimonial, TestimonialsPageContent } from './types'

/**
 * Recomandările primite de la oamenii cu care Adriana a lucrat.
 *
 * Ca peste tot în `src/content/`, fișierul este ȘI fallback-ul când CMS-ul n-a
 * fost completat, ȘI sursa din care `pnpm seed` populează colecția
 * `testimonials`.
 *
 * ## Reguli proprii acestui fișier
 *
 * 1. **Textul nu se rescrie.** Sunt cuvintele unor oameni reali, semnate cu
 *    numele și funcția lor. Singurele intervenții permise sunt cele
 *    tipografice, enumerate mai jos, iar orice altceva trebuie recerut
 *    persoanei care a scris recomandarea.
 * 2. **`excerpt` este un citat, nu un rezumat.** Fraza scoasă în evidență pe
 *    homepage și pe carduri este copiată cuvânt cu cuvânt din textul integral
 *    de dedesubt, ca cititorul care apasă „Citește recomandarea" să o
 *    regăsească acolo. O parafrază ar pune în ghilimele ceva ce omul n-a spus.
 * 3. **Nu inventăm date.** Fără fotografii, fără logouri de firmă, fără note
 *    de la 1 la 5 — recomandările nu au fost date sub formă de rating, iar un
 *    `AggregateRating` construit din nimic este exact genul de marcaj pentru
 *    care Google dă penalizare manuală.
 *
 * ## Intervențiile tipografice făcute, ca să fie de găsit
 *
 * - Diacriticele au fost completate în recomandarea lui Paul Ștefănescu, care
 *   a fost scrisă fără ele. Nu s-a schimbat niciun cuvânt și nicio topică.
 * - Ghilimelele care încadrau integral recomandarea Liviei Wagner-Rus au fost
 *   scoase: textul se randează într-un `<blockquote>`, care le pune singur.
 * - Textul a fost împărțit în paragrafe exact acolo unde erau în documentul
 *   trimis de clientă.
 *
 * ÎNAINTE DE LANSARE: toate cele șase persoane trebuie să confirme în scris
 * publicarea numelui și a funcției pe site (STATUS.md §7). De confirmat și
 * funcția lui Bogdan Vasiliu, care lipsește din documentul primit, și scrierea
 * numelui „Gabriela Tarna", pe care nu îl completăm cu diacritice ghicite.
 *
 * Diacritice cu virgulă: ș (U+0219), ț (U+021B). Niciodată sedilă.
 */
export const testimonials: Testimonial[] = [
  {
    slug: 'livia-wagner-rus',
    author: 'Livia Wagner-Rus',
    role: 'Director general, AGRO MARUS SRL',
    context: 'Formare profesională, colaborare și mentorat individual',
    excerpt:
      'Nu îți spune cine să devii, ci te ghidează să îți amintești cine ești și de ce ești capabil.',
    paragraphs: [
      'Am întâlnit-o pe Adriana Chira într-un context de formare profesională, iar ceea ce m-a impresionat încă de la început a fost capacitatea ei de a lucra cu oamenii dincolo de metodă, rol sau aparență. Adriana nu transmite doar informație. Creează contexte în care oamenii se văd mai clar pe ei înșiși, oferă cu generozitate mai mult decât promite și are rafinamentul de a te ghida să-ți găsești propriile răspunsuri.',
      'Experiența de formare alături de ea a avut un impact real asupra parcursului meu profesional și m-a determinat să aprofundez, la rândul meu, domeniul coachingului. Ulterior, relația noastră a depășit firesc cadrul profesional și s-a transformat într-o colaborare construită pe încredere, valori comune și o foarte frumoasă compatibilitate umană.',
      'Am avut bucuria de a contribui la proiectele sale dedicate dezvoltării femeilor și susținerii feminității și tot ea mi-a oferit, la rândul ei, un spațiu de recunoaștere și exprimare. Am fost invitata ei în mai multe ediții de tip podcast, unde am purtat conversații despre teme în care eu am experiză și care rămân de o permanentă actualitate: relația cu banii, prosperitatea și construirea unei forme de prosperitate conștientă.',
      'Unul dintre cele mai valoroase capitole ale relației noastre a fost însă lucrul individual, 1 la 1. Adriana a fost unul dintre mentorii care mi-au însoțit dezvoltarea profesională în momente importante. A știut să îmi ofere claritate atunci când vedeam mai degrabă problemele decât posibilitățile și să păstreze, cu discreție și fermitate, „lumina aprinsă" până când am putut vedea din nou drumul.',
      'Aceasta este, poate, una dintre calitățile ei cele mai rare: nu îți spune cine să devii, ci te ghidează să îți amintești cine ești și de ce ești capabil.',
      'Adriana mă inspiră prin forța ei interioară, prin eleganța cu care traversează schimbarea și prin extraordinara capacitate de a se reinventa fără să își piardă esența. Este un om cu profunzime, un caracter puternic și un profesionist care își tratează propria evoluție cu aceeași seriozitate cu care susține evoluția celor cu care lucrează.',
      'Pentru mine, Adriana este mai mult decât un trainer, mentor sau consultant. Este unul dintre acei oameni care pot schimba perspectiva din care îți privești viața, cariera și propriul potențial.',
      'O recomand cu deplină încredere celor care caută un profesionist capabil să vadă omul din spatele funcției, al performanței și al responsabilității — și să îl însoțească, cu inteligență, discernământ și autenticitate, către următorul său nivel. Cu recunoștință, mulțumesc.',
    ],
    featured: true,
    order: 0,
  },
  {
    slug: 'gabriel-vasile-oltean',
    author: 'Dr. Gabriel Vasile Oltean',
    role: 'Economist · Conferențiar universitar · Trainer și consultant în management',
    context: 'Colegi la OMNIASIG, în activitatea de pregătire profesională',
    excerpt:
      'Este o persoană de caracter, care inspiră încredere și care tratează fiecare colaborare cu responsabilitate și respect.',
    paragraphs: [
      'Am avut ocazia să colaborez cu Adriana Chira în perioada în care am fost colegi la OMNIASIG, în cadrul activității de pregătire profesională. Chiar dacă perioada în care am lucrat împreună nu a fost foarte lungă, a fost suficientă pentru a-mi forma o opinie foarte clară despre profesionalismul și caracterul său.',
      'Adriana s-a remarcat încă de atunci prin implicare, seriozitate și dorința permanentă de a obține rezultate. Era unul dintre acei oameni care nu se limitau la îndeplinirea propriilor responsabilități, ci ofereau sprijin colegilor ori de câte ori era nevoie. În mod firesc, ajunsese să fie un reper pentru cei care aveau nevoie de îndrumare, iar disponibilitatea sa de a asculta, de a încuraja și de a găsi soluții făcea ca, de multe ori, să exercite un veritabil rol de mentor.',
      'Dincolo de competențele profesionale, am apreciat întotdeauna echilibrul, empatia și integritatea sa. Este o persoană de caracter, care inspiră încredere și care tratează fiecare colaborare cu responsabilitate și respect.',
      'Un aspect care spune multe despre un om este felul în care își păstrează relațiile în timp. Deși drumurile noastre profesionale s-au despărțit cu mai bine de zece ani în urmă, am rămas în legătură și am păstrat o relație de prietenie și respect reciproc. Pentru mine, acest lucru confirmă calitățile umane pe care le-am observat încă din perioada în care am fost colegi.',
      'Nu mă surprinde deloc faptul că astăzi Adriana își dedică activitatea dezvoltării oamenilor și antreprenorilor. Consider că experiența acumulată, pregătirea profesională și modul autentic în care relaționează cu oamenii îi oferă toate premisele pentru a crea valoare și pentru a avea un impact pozitiv asupra celor care aleg să lucreze alături de ea.',
    ],
    featured: true,
    order: 1,
  },
  {
    slug: 'paul-stefanescu',
    author: 'Paul Ștefănescu',
    role: 'Consultant, trainer, auditor, antreprenor',
    context: 'Cursul de Management și Inovare, 2020',
    excerpt:
      'Adriana te ghidează cu abilitate către înțelegerea situațiilor, pentru ca, mai apoi, să obții claritatea soluțiilor.',
    paragraphs: [
      'Am avut ocazia și plăcerea să o cunosc la cursul de Management și Inovare, în 2020, unde Adriana era trainerul, iar mai târziu am devenit și prieteni.',
      'Am avut mai multe ocazii să stau „de povești", atât cu OMUL Adriana, cât și cu PROFESIONISTUL Adriana.',
      'Dacă ar fi să îi atribui o calitate care m-a făcut să o apreciez la un alt nivel, aceea este CLARITATE. Adriana te ghidează cu abilitate către înțelegerea situațiilor, pentru ca, mai apoi, să obții claritatea soluțiilor. Și o face folosind resursa cea mai la îndemână și mai de valoare: pe tine însuți.',
      'Cine caută să devină mai bun, cine își dorește cu adevărat să se dezvolte prin „when the why is clear the how comes easy", trebuie să o facă împreună cu și alături de Adriana.',
      'Eu am făcut-o și o voi face în continuare și îi sunt recunoscător Adrianei.',
    ],
    featured: true,
    order: 2,
  },

  /* ------------------------------------------------------------------------ */
  /* Al doilea lot, primit pe 7 septembrie 2026                               */
  /*                                                                          */
  /* `featured: false` la toate trei, deliberat. Secțiunea de pe prima pagină  */
  /* arată maximum trei recomandări; dacă le-aș fi marcat și pe acestea, două  */
  /* dintre cele aprobate deja ar fi dispărut de pe homepage în tăcere, ca     */
  /* efect secundar al unei adăugări. Toate șase se citesc integral pe         */
  /* `/testimoniale`, iar schimbarea trioului de pe prima pagină e o bifă în   */
  /* admin, fără cod.                                                         */
  /* ------------------------------------------------------------------------ */

  {
    slug: 'gabriela-tarna',
    author: 'Gabriela Tarna',
    role: 'Regional Head of Talent Acquisition, Employer Branding and Learning Europe-Africa',
    context: 'Training & People Development, DRÄXLMAIER Group — peste doi ani',
    excerpt:
      'Adriana are abilitatea de a inspira reflecție, creștere și transformare, atât în contexte de dezvoltare profesională, cât și personală.',
    paragraphs: [
      'Am avut privilegiul de a colabora cu Adriana timp de peste doi ani în cadrul echipei de Training & People Development a companiei DRÄXLMAIER Group, perioadă în care mi-a raportat direct. Pe parcursul acestei colaborări, am avut ocazia să îi observ îndeaproape atât competențele profesionale, cât și calitățile umane deosebite.',
      'Adriana se remarcă printr-o pregătire profesională solidă, construită și consolidată continuu prin învățare, dezvoltare și perfecționare constantă. Dincolo de expertiza sa, ceea ce o diferențiază cu adevărat este capacitatea autentică de a se conecta cu oamenii, de a înțelege perspective diverse și de a oferi sprijin cu empatie, echilibru și respect.',
      'Profesionalismul, integritatea și dedicarea sa față de dezvoltarea celor din jur creează un mediu bazat pe încredere și siguranță psihologică. Adriana are abilitatea de a inspira reflecție, creștere și transformare, atât în contexte de dezvoltare profesională, cât și personală. O recomand cu toată încrederea ca expert în training și psihoterapie, fiind convinsă că impactul său pozitiv asupra oamenilor și organizațiilor este unul autentic și de durată.',
    ],
    featured: false,
    order: 3,
  },
  {
    slug: 'marian-rujoiu',
    author: 'Marian Rujoiu',
    role: 'Extreme Training',
    context: 'Colaborare din 2018, ca trainer în echipa Extreme Training',
    excerpt: 'Adriana vede clar acolo unde, uneori, ceilalți văd doar confuzie.',
    paragraphs: [
      'Colaborarea mea cu Adriana Chira a început în anul 2018, când s-a alăturat echipei Extreme Training în calitate de trainer. Am cunoscut-o mai întâi telefonic, apoi în cadrul unei discuții pe Skype, iar ulterior am avut ocazia să ne întâlnim și să lucrăm împreună față în față.',
      'De atunci, colaborarea noastră s-a dezvoltat constant și a inclus numeroase proiecte: cursuri de formator, consilier pentru dezvoltare personală, management și antreprenoriat, precum și programe înregistrate, printre care „Neurologia curajului" și un curs dedicat comunicării.',
      'Încă de la prima interacțiune, colaborarea cu Adriana a fost firească și eficientă. A înțeles foarte repede nevoile noastre, cerințele proiectelor și profilul participanților. Am susținut împreună și sesiuni live în care Adriana a prezentat și a promovat cu rezultate foarte bune cursurile dezvoltate de Extreme Training.',
      'Experiența sa în vânzări, coaching, dezvoltare personală și management îi oferă capacitatea de a înțelege rapid contexte diferite, de a identifica soluții potrivite și de a ajunge direct la esența unei situații. Adriana vede clar acolo unde, uneori, ceilalți văd doar confuzie. Aduce claritate, formulează întrebările potrivite și îi sprijină pe oameni să înainteze pe drumul lor către performanță.',
      'De-a lungul anilor, feedbackurile primite din partea cursanților noștri au fost constant foarte bune, atât în ceea ce privește calitatea informațiilor oferite, cât și modul profesionist, clar și implicat în care Adriana a susținut fiecare curs.',
      'Recomand colaborarea cu Adriana Chira celor care caută un profesionist cu experiență, adaptabilitate și capacitatea reală de a înțelege oamenii și de a-i orienta către rezultate.',
    ],
    featured: false,
    order: 4,
  },
  {
    /**
     * DE CONFIRMAT CU CLIENTA: funcția și organizația.
     *
     * Documentul primit semnează doar cu numele. Textul vorbește despre
     * „provocările de HR" și despre dezvoltare organizațională, dar de acolo
     * până la o funcție anume e o presupunere — iar presupunerea ar fi
     * atribuită unui om real, sub numele lui. Rămâne `null` până când clienta
     * trimite funcția; cardul și pagina omit pur și simplu rândul.
     */
    slug: 'bogdan-vasiliu',
    author: 'Bogdan Vasiliu',
    role: null,
    context: null,
    excerpt:
      'Adriana Chira este unul dintre acei profesioniști care reușesc să transforme provocările de HR în oportunități reale de dezvoltare organizațională.',
    paragraphs: [
      'Adriana Chira este unul dintre acei profesioniști care reușesc să transforme provocările de HR în oportunități reale de dezvoltare organizațională.',
      'Am apreciat întotdeauna capacitatea ei de a înțelege rapid contextul de business, de a construi relații solide și de a livra soluții pragmatice, cu impact.',
      'Recomand cu încredere colaborarea cu Adriana oricărei organizații care își dorește un partener de încredere, orientat către oameni și rezultate.',
    ],
    featured: false,
    order: 5,
  },
]

/* -------------------------------------------------------------------------- */
/* Pagina                                                                      */
/* -------------------------------------------------------------------------- */

export const testimonialsPage: TestimonialsPageContent = {
  eyebrow: { text: 'Recomandări', ornament: 'line' } satisfies Eyebrow,
  title: 'Ce spun oamenii care au lucrat cu mine',
  lead: 'Trei recomandări, publicate integral și semnate cu numele și funcția celor care le-au scris. Nu sunt fragmente alese ca să sune bine — sunt textele așa cum au fost trimise.',
  metaDescription:
    'Recomandări pentru Adriana Chira, consultant în performanță umană din Timișoara, scrise de oameni cu care a lucrat: clienți de mentorat individual, cursanți și colegi de profesie.',
  /** Nota de sub listă. Explică de ce nu există note, stele sau medii. */
  note: 'Recomandările sunt publicate cu acordul autorilor, integral și fără modificări de conținut. Nu folosesc note, stele sau medii: nimeni dintre cei de mai sus nu a fost rugat să dea un punctaj, iar o medie construită din nimic ar fi o cifră inventată.',
}

/** Eticheta și titlul secțiunii de pe homepage. */
export const testimonialsSection = {
  eyebrow: { text: 'Recomandări', ornament: 'line' } satisfies Eyebrow,
  heading: 'Oameni care au lucrat cu mine',
  link: { label: 'Citește recomandările integral', href: '/testimoniale' },
}
