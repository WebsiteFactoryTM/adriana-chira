import type { TextBlock } from '@/lib/lexical'

/**
 * Articolele de lansare, cu textul livrat de clientă (`perspective .docx`).
 *
 * Fișierul e sursa din care le scriu în CMS `pnpm seed` (bază nouă) și migrația
 * `20261005_120000_articole_lansare` (bazele existente, unde cele trei articole
 * din design stăteau ca ciorne cu `[ DE COMPLETAT ]`). Odată ajunse în CMS,
 * acolo se editează: nici seed-ul, nici migrația nu rescriu un articol pe care
 * cineva l-a atins în admin.
 *
 * Textul este al Adrianei, cuvânt cu cuvânt. Intervențiile, toate de formă:
 * greșeli de tastare („probelma", „creaza"), diacritice lipsă în titlurile de
 * lucru, titluri de secțiune acolo unde documentul trecea de la o idee la alta
 * fără ele (au și rol de cuprins, care apare de la patru `h2`), și câte o
 * legătură internă pe o frază existentă — brief §9.3: fiecare articol trimite
 * spre un program sau un workshop. Nicio frază nu a fost adăugată.
 *
 * Primele trei păstrează slug-ul, titlul, categoria și data din designul
 * aprobat, deci linkurile vechi de pe homepage nu se rup.
 */

export type LaunchPost = {
  title: string
  slug: string
  /** Slug-ul categoriei, nu numele — numele se poate schimba din admin. */
  category: 'performanta' | 'decizie' | 'perspectiva' | 'mindset'
  excerpt: string
  publishedAt: string
  body: TextBlock[]
}

const W = '/workshopuri-performanta-umana'

export const launchPosts: LaunchPost[] = [
  {
    title: 'Ce înseamnă, de fapt, performanța umană',
    slug: 'ce-inseamna-de-fapt-performanta-umana',
    category: 'performanta',
    excerpt:
      'Potențialul nu este performanță. Cunoașterea nu este performanță. Munca multă nu este performanță.',
    publishedAt: '2026-08-12',
    body: [
      {
        p: [
          'Performanța umană este capacitatea de a transforma potențialul în rezultate, prin ',
          {
            link: 'alinierea modului în care gândești, decizi și acționezi',
            href: '/servicii/strategic-performance-assessment',
          },
          '.',
        ],
      },
      {
        lines: [
          { b: 'Potențialul nu este performanță.' },
          { b: 'Cunoașterea nu este performanță.' },
          { b: 'Munca multă nu este performanță.' },
          'Performanța apare atunci când toate acestea se transformă în rezultate.',
        ],
      },
      { h2: 'Mai multe feluri de a o spune' },
      {
        ul: [
          'Performanța este capacitatea de a transforma resursele pe care le ai în rezultate relevante.',
          'Performanța este rezultatul întâlnirii dintre claritate, capacitate și acțiune.',
          'Performanța este capacitatea unui om de a-și folosi resursele interne și externe pentru a obține rezultate sustenabile.',
          'Performanța nu este cât de mult faci, ci cât de bine reușești să transformi ceea ce știi, ceea ce ești și ceea ce ai în rezultate.',
          'Performanța este capacitatea de a obține rezultate fără să te pierzi pe tine în proces.',
        ],
      },
      {
        p: [
          { link: 'Performanța sustenabilă', href: `${W}#cat-te-costa-sa-fii-mereu-disponibil` },
          ' apare atunci când rezultatele cresc fără ca prețul lor să fie epuizarea, dezechilibrul sau pierderea sensului.',
        ],
      },
      { h2: 'Perspectiva, decizia, performanța' },
      { p: 'Perspectiva → decizia → performanța creează o formulă foarte puternică:' },
      {
        quote: [
          'Perspectiva îți deschide opțiunile.',
          'Decizia îți alege direcția.',
          'Acțiunea produce rezultatul.',
          'Iar rezultatul este expresia performanței.',
        ],
      },
    ],
  },

  {
    title: 'Obiectivul e SMART. Dar omul care trebuie să-l atingă?',
    slug: 'obiectivul-e-smart-dar-omul-care-trebuie-sa-l-atinga',
    category: 'decizie',
    excerpt:
      'Uneori nu obiectivul este prea mare. Omul care încearcă să-l atingă nu este încă pregătit pentru nivelul lui.',
    publishedAt: '2026-08-05',
    body: [
      {
        p: 'Dacă în DEX performanța are legătură cu un rezultat deosebit, eu cred că merită să ne uităm puțin mai în profunzime: cine este omul care produce acel rezultat?',
      },
      {
        p: 'Pentru că putem avea un obiectiv formulat impecabil, extrem de SMART, și totuși să nu avem baza necesară pentru a-l susține.',
      },
      { h2: 'Să luăm un exemplu' },
      { p: 'Un antreprenor din domeniul beauty își stabilește obiectivul:' },
      { quote: ['„Până la sfârșitul anului 2027 vreau să ajung la o cifră de afaceri de 200.000 de euro.”'] },
      {
        lines: [
          'Obiectivul este clar.',
          'Este măsurabil.',
          'Are termen.',
          'Poate fi perfect realist în raport cu piața și cu modelul de business.',
        ],
      },
      { p: 'Dar întrebarea mea nu este doar:' },
      { p: { b: '„Ce trebuie să facă acest antreprenor pentru a ajunge la 200.000 de euro?”' } },
      { p: 'Ci mai ales:' },
      { quote: ['„Cine trebuie să devină acest antreprenor pentru a putea produce și susține 200.000 de euro?”'] },
      { p: 'Pentru că poate fi un profesionist excelent în beauty.' },
      {
        lines: [
          'Poate avea talent.',
          'Poate cunoaște foarte bine meseria.',
          'Poate avea clienți mulțumiți.',
          'Poate fi foarte bun tehnic.',
        ],
      },
      {
        p: 'Dar dacă nu știe să vândă, să negocieze, să conducă oameni, să ia decizii, să gestioneze banii, să construiască procese, să delege sau să gestioneze presiunea creșterii, obiectivul financiar poate deveni mai mare decât capacitatea lui actuală de a-l susține.',
      },
      { h2: 'Când obiectivul depășește omul' },
      { p: 'Și aici apare ceva important:' },
      {
        lines: [
          { b: 'Uneori nu obiectivul este prea mare.' },
          { b: 'Omul care încearcă să-l atingă nu este încă pregătit pentru nivelul acelui obiectiv.' },
        ],
      },
      { p: 'Iar dacă această diferență nu este văzută, antreprenorul poate ajunge să se autosaboteze.' },
      { p: 'Nu pentru că nu își dorește suficient.' },
      {
        p: 'Ci pentru că sistemul lui actual de gândire, comportament, competențe și decizii nu poate susține încă rezultatul pe care și l-a propus.',
      },
      {
        p: [
          'De aceea, pentru mine, ',
          {
            link: 'performanța umană începe înaintea rezultatului',
            href: '/servicii/strategic-performance-assessment',
          },
          '.',
        ],
      },
      { p: { b: 'Începe cu omul.' } },
      {
        lines: [
          { b: 'Ce comportamente îți susțin obiectivul și care îl sabotează?' },
          { b: 'Și, mai ales, cine trebuie să devii pentru a putea susține rezultatul pe care îl dorești?' },
        ],
      },
      { p: 'Pentru că nu este suficient să ai un obiectiv SMART.' },
      { p: { b: 'Trebuie să devii SMART în raport cu obiectivul tău.' } },
      { p: 'Asta este una dintre perspectivele din care privesc eu performanța umană.' },
      { quote: ['Nu doar ce rezultat vrei să obții, ci ce om produce acel rezultat.'] },
    ],
  },

  {
    title: 'Când locurile se schimbă, dar perspectiva rămâne a ta',
    slug: 'cand-locurile-se-schimba-dar-perspectiva-ramane-a-ta',
    category: 'perspectiva',
    excerpt:
      'M-am întors în stațiunea adolescenței mele și am găsit un loc pe care nu-l mai văzusem niciodată.',
    publishedAt: '2026-07-29',
    body: [
      { p: 'Anul acesta am ales să-mi petrec concediul pe litoralul românesc.' },
      { p: 'Am ales Eforie Nord.' },
      {
        p: 'Stațiunea adolescenței și tinereții mele. Locul în care, cândva, am adunat zile de vacanță, oameni, emoții, povești și amintiri care au rămas undeva, bine așezate în memoria mea.',
      },
      { p: 'Și am plecat spre Eforie cu toate aceste lucruri în mine.' },
      {
        p: 'Doar că, atunci când am ajuns, am avut senzația că am ajuns într-un loc pe care nu-l mai văzusem niciodată.',
      },
      { p: 'Aproape nimic nu mai era la fel.' },
      {
        p: 'Plaja era diferită. Stațiunea era diferită. Atmosfera era diferită. Oamenii erau alții. Locurile pe care le știam nu mai arătau la fel.',
      },
      {
        p: 'Existau, ici-colo, mici simboluri ale trecutului. Câte o denumire, câte un reper, poate un colț care îmi amintea vag de ceea ce fusese.',
      },
      { p: 'Dar „vibe-ul” pe care îl purtam eu în memorie nu mai era acolo.' },
      { h2: 'Două variante' },
      { p: 'Și atunci mi-am dat seama că aveam două variante.' },
      { p: 'Puteam să mă uit în jur și să spun:' },
      { quote: ['„Nu mai este ce a fost.”'] },
      {
        p: 'Puteam să compar permanent ceea ce vedeam cu ceea ce îmi aminteam și să trăiesc vacanța ca pe o dezamăgire.',
      },
      { p: 'Sau puteam să schimb perspectiva.' },
      {
        lines: [
          'Să accept că locul nu-mi mai aparține trecutului.',
          'Că eu însămi nu mai sunt fata care venea aici în adolescență.',
          'Și că poate nu trebuia să caut vechea Eforie Nord.',
          'Poate trebuia să descopăr una nouă.',
        ],
      },
      { p: 'Așa că am ales să mă bucur de ea ca și cum aș fi venit pentru prima dată.' },
      { p: 'Și, într-un fel, chiar așa a fost.' },
      {
        lines: [
          'Pentru că locul era același doar în coordonate.',
          'Eu eram alta.',
          'El era altul.',
          'Și experiența nu avea cum să fie aceeași.',
        ],
      },
      { h2: 'Cât de des facem asta în viață?' },
      {
        lines: [
          'Ne întoarcem într-un loc.',
          'Într-o relație.',
          'Într-o situație.',
          'Într-un job.',
          'Într-o etapă a vieții.',
        ],
      },
      {
        p: 'Și ne așteptăm ca realitatea să ne ofere aceeași emoție pe care am avut-o cândva.',
      },
      { p: 'Iar când nu se întâmplă, spunem:' },
      { quote: ['„Nu mai este ca înainte.”'] },
      { lines: ['Poate că nu este.', 'Și poate că nici nu trebuie să fie.'] },
      {
        p: 'Uneori, problema nu este ceea ce se întâmplă în exteriorul nostru.',
      },
      {
        p: 'Problema apare în momentul în care încercăm să obligăm prezentul să semene cu o amintire.',
      },
      {
        lines: [
          'Mintea noastră adoră familiarul.',
          'Îl recunoaște, îl organizează, îl compară.',
          'Și, de multe ori, ne oferă automat aceeași interpretare pe care am mai folosit-o.',
        ],
      },
      { p: { b: 'Dar aici intervine ceea ce eu numesc antrenamentul perspectivei.' } },
      { p: 'Să poți să te oprești și să întrebi:' },
      { quote: ['„Ce altceva aș putea vedea aici?”'] },
      {
        lines: [
          'Nu pentru a nega ceea ce nu ne place.',
          'Nu pentru a transforma artificial ceva rău în ceva bun.',
          'Ci pentru a nu lăsa prima interpretare să devină singura posibilitate.',
        ],
      },
      { h2: 'Mintea se antrenează' },
      { p: 'Așa cum îți antrenezi corpul la sală, îți poți antrena și mintea.' },
      {
        lines: [
          'În fiecare zi.',
          'În lucrurile mici.',
          'În felul în care reacționezi când cineva nu face ceea ce te aștepți.',
          'În felul în care privești un eșec.',
          'În felul în care interpretezi o schimbare.',
          'În felul în care răspunzi atunci când realitatea nu se potrivește cu planul tău.',
        ],
      },
      {
        p: 'Viktor Frankl vorbește într-un mod profund despre libertatea pe care o avem în raport cu ceea ce ni se întâmplă. Nu putem controla întotdeauna circumstanțele, oamenii sau evenimentele din exteriorul nostru.',
      },
      {
        p: [
          'Dar există un ',
          {
            link: 'spațiu între ceea ce ni se întâmplă și felul în care alegem să răspundem',
            href: `${W}#spatiul-dintre-stimul-si-raspuns`,
          },
          '.',
        ],
      },
      {
        lines: [
          'Iar în acel spațiu există perspectiva.',
          'Există alegerea.',
          'Există libertatea noastră.',
        ],
      },
      {
        lines: [
          'Poate că nu pot schimba Eforie Nord.',
          'Nu pot readuce plaja adolescenței mele.',
          'Nu pot recrea oamenii, atmosfera sau emoțiile de atunci.',
        ],
      },
      { p: 'Dar pot alege ce fac cu ceea ce găsesc astăzi.' },
      {
        lines: [
          'Pot să fiu dezamăgită că nu mai este ca înainte.',
          'Sau pot să fiu curioasă să văd ce este acum.',
        ],
      },
      { p: 'Și alegerea aceasta schimbă experiența.' },
      { h2: 'Poate că nu trebuie să ne întoarcem niciodată la ceea ce a fost' },
      {
        lines: [
          'Poate că unele lucruri din viața noastră nu sunt menite să fie retrăite.',
          'Sunt menite să fie integrate.',
        ],
      },
      { p: 'Amintirile pot rămâne frumoase fără să le cerem prezentului să le reproducă.' },
      {
        lines: [
          'Oamenii se schimbă.',
          'Locurile se schimbă.',
          'Relațiile se schimbă.',
          'Noi ne schimbăm.',
        ],
      },
      {
        p: 'Iar maturitatea, poate, nu înseamnă să ne agățăm de ceea ce a fost, ci să putem privi ceea ce este și să ne întrebăm:',
      },
      {
        quote: ['„Ce pot descoperi aici, dacă renunț pentru o clipă la ceea ce credeam că trebuie să fie?”'],
      },
      {
        p: 'Pentru mine, Eforie Nord a devenit astfel mai mult decât o destinație de vacanță.',
      },
      { p: 'A devenit un mic exercițiu de perspectivă.' },
      {
        p: 'Mi-a amintit că realitatea nu vine întotdeauna să confirme ceea ce avem deja în minte.',
      },
      {
        p: [
          'Și poate că tocmai aici începe performanța umană: ',
          {
            b: 'nu în a controla tot ceea ce se întâmplă în jurul nostru, ci în capacitatea de a ne repoziționa atunci când realitatea nu corespunde așteptărilor noastre.',
          },
        ],
      },
      {
        lines: [
          'Pentru că uneori, ceea ce ne blochează nu este situația.',
          { b: 'Ci perspectiva din care o privim.' },
        ],
      },
      {
        lines: [
          'Iar mintea deschisă nu înseamnă să vezi totul roz.',
          'Înseamnă să nu te oprești la prima perspectivă pe care ți-o oferă mintea.',
          'Să mai cauți una.',
          'Și încă una.',
        ],
      },
      {
        p: 'Până când apare o posibilitate pe care, din locul în care priveai inițial, nici măcar nu o puteai vedea.',
      },
    ],
  },

  {
    title: 'Perspectiva, în șapte definiții',
    slug: 'perspectiva-in-sapte-definitii',
    category: 'perspectiva',
    excerpt:
      'Două persoane pot trăi exact aceeași experiență și pot ajunge la concluzii complet diferite. Șapte feluri de a înțelege perspectiva.',
    publishedAt: '2026-09-14',
    body: [
      { h2: '1. Perspectiva ca punct de vedere' },
      {
        lines: [
          'Perspectiva este felul în care privim, interpretăm și înțelegem o situație.',
          'Două persoane pot trăi exact aceeași experiență și pot ajunge la concluzii complet diferite.',
        ],
      },
      { h2: '2. Perspectiva ca distanță mentală' },
      {
        lines: [
          'Perspectiva este capacitatea de a face un pas înapoi din propria situație pentru a vedea mai mult decât ceea ce simțim în acel moment.',
          'Uneori, problema nu se schimbă. Se schimbă locul din care o privim.',
        ],
      },
      { h2: '3. Perspectiva ca posibilitate' },
      {
        lines: [
          'Perspectiva este capacitatea de a vedea mai multe opțiuni acolo unde, inițial, vedeam doar una sau două.',
          'O gândire rigidă spune: „ori asta, ori nimic”. Perspectiva întreabă: „Ce altceva este posibil?”',
        ],
      },
      { h2: '4. Perspectiva ca interpretare' },
      {
        p: 'Nu reacționăm întotdeauna la realitate, ci la interpretarea pe care o dăm realității. Perspectiva este filtrul prin care atribuim sens experiențelor noastre.',
      },
      { h2: '5. Perspectiva ca schimbare de poziție' },
      {
        p: 'A schimba perspectiva înseamnă a privi aceeași situație dintr-un alt unghi, fără ca situația să se fi schimbat neapărat.',
      },
      { h2: '6. Perspectiva în luarea deciziilor' },
      {
        p: [
          'Perspectiva este capacitatea de a vedea dincolo de problema imediată, pentru a înțelege ',
          {
            link: 'consecințele, alternativele și oportunitățile unei decizii',
            href: `${W}#dincolo-de-prima-concluzie`,
          },
          '.',
        ],
      },
      { h2: '7. Perspectiva și performanța' },
      {
        p: 'Perspectiva este capacitatea de a vedea mai mult decât problema din fața ta. Iar uneori, următorul nivel de performanță nu vine din a face mai mult, ci din a vedea diferit.',
      },
      { quote: ['Limitele unei decizii sunt, de multe ori, limitele perspectivei din care o privești.'] },
      {
        p: 'Când vezi doar alb sau negru, nu înseamnă neapărat că nu există alte variante. Poate înseamnă doar că încă nu ai schimbat perspectiva din care privești.',
      },
    ],
  },

  {
    title: 'Privește problema diferit',
    slug: 'priveste-problema-diferit',
    category: 'decizie',
    excerpt:
      'Uneori, rezolvarea unei probleme nu vine atunci când găsești un răspuns mai bun. Vine atunci când privești problema dintr-un alt unghi.',
    publishedAt: '2026-09-21',
    body: [
      {
        p: 'Uneori, rezolvarea unei probleme nu vine atunci când găsești un răspuns mai bun.',
      },
      { p: { b: 'Vine atunci când privești problema dintr-un alt unghi.' } },
      {
        p: 'Suntem atât de obișnuiți cu propriile tipare de gândire, încât ajungem să confundăm ceea ce cunoaștem cu ceea ce este posibil.',
      },
      {
        quote: [
          '„Așa se face.”',
          '„Nu există altă variantă.”',
          '„Am încercat deja.”',
          '„Ori e bine, ori e greșit.”',
        ],
      },
      {
        p: 'Și, fără să ne dăm seama, închidem ușa exact înainte să apară o soluție nouă.',
      },
      {
        p: 'Mintea caută, de cele mai multe ori, rezultate în interiorul perspectivelor pe care le cunoaște deja.',
      },
      { p: 'Dar dacă schimbi perspectiva, se poate schimba și ceea ce vezi.' },
      {
        lines: [
          'Iar ceea ce vezi diferit îți poate schimba decizia.',
          'Decizia îți poate schimba acțiunea.',
          'Iar acțiunea poate schimba rezultatul.',
        ],
      },
      {
        p: [
          'Nu orice problemă are nevoie de mai mult efort. ',
          { link: 'Unele au nevoie de o perspectivă nouă', href: `${W}#din-problema-in-directie` },
          '.',
        ],
      },
      { p: { b: 'Lasă-ți mintea deschisă.' } },
      {
        p: 'Nu reduce posibilitățile vieții la ceea ce poate produce mintea ta din obișnuință.',
      },
      {
        lines: [
          'Uneori, soluția nu lipsește.',
          { b: 'Doar nu ai privit încă din locul din care poate fi văzută.' },
        ],
      },
    ],
  },

  {
    title: 'Ce înseamnă pentru tine un refuz?',
    slug: 'ce-inseamna-pentru-tine-un-refuz',
    category: 'mindset',
    excerpt:
      'Niște copii pe o plajă, multe refuzuri și niciun verdict final. Despre perseverență și despre felul în care interpretăm un „nu”.',
    publishedAt: '2026-09-28',
    body: [
      { p: { b: 'O altă zi. O altă perspectivă.' } },
      { p: 'Eram la una dintre terasele din stațiune, chiar undeva pe plajă.' },
      {
        p: 'Așteptam prânzul și priveam, fără să caut neapărat ceva anume, ce se întâmpla în jurul meu.',
      },
      {
        p: 'Terasa era delimitată de plajă printr-un gard simplu, din sfoară. Nu era un zid. Nu era o barieră adevărată. Doar o limită simbolică între două spații.',
      },
      {
        lines: [
          'Dincolo de ea, plaja.',
          'Și pe plajă, copiii care își făceau veacul prin stațiune și care încercau să obțină bani de la turiști.',
        ],
      },
      {
        p: 'Se apropiau de mese, priveau, vorbeau cu oamenii, cereau. Dar gardul de sfoară era, pentru ei, o limită pe care o respectau. Nu intrau pe terasă.',
      },
      { p: 'Pentru turiști, prezența lor era, evident, deranjantă.' },
      {
        p: 'Pentru patronul terasei, era o sursă permanentă de alertă. Îi urmărea, îi alunga, încerca să îi țină la distanță. Probabil că se temea că insistența lor îi va deranja clienții și, în cele din urmă, îi va face să plece.',
      },
      { h2: 'Prima interpretare' },
      { p: 'Priveam scena și puteam foarte ușor să o interpretez într-un singur fel.' },
      {
        lines: [
          'Copiii deranjează.',
          'Patronul își apără afacerea.',
          'Turiștii vor liniște.',
          'Fiecare își apără teritoriul.',
        ],
      },
      { p: 'Și, într-un fel, toată lumea avea dreptate.' },
      {
        p: [
          'Dar am încercat să fac ceea ce fac din ce în ce mai des în viață: ',
          { b: 'să ies pentru câteva momente din propria perspectivă și să privesc situația din afară.' },
        ],
      },
      {
        lines: [
          'Și atunci am observat ceva care m-a făcut să mă gândesc la cu totul altceva.',
          'La mindset.',
        ],
      },
      {
        lines: [
          'Nu la comportamentul lor.',
          'Nu la faptul că uneori pot fi insistenți sau chiar agasanți.',
          { b: 'Ci la felul în care reacționau la refuz.' },
        ],
      },
      { h2: 'Refuzul care nu devine verdict' },
      { lines: ['Pentru că refuzuri primeau.', 'Multe.'] },
      { quote: ['„Nu.”', '„Nu avem.”', '„Nu vreau.”'] },
      { p: 'Oamenii îi ignorau, îi refuzau, îi trimiteau mai departe.' },
      {
        lines: ['Și totuși...', { b: 'niciun refuz nu părea să fie pentru ei un verdict final.' }],
      },
      {
        lines: [
          'Nu vedeam descurajare.',
          'Nu vedeam abandon.',
          'Nu vedeam un copil care, după câteva refuzuri, să spună:',
          '„Gata. Nu sunt bun la asta.”',
        ],
      },
      {
        lines: [
          'Își continuau drumul.',
          'Încercau la următoarea masă.',
          'Și la următoarea.',
          'Și la următoarea.',
        ],
      },
      { p: 'Era ca și cum în mintea lor refuzul nu însemna „nu pot”.' },
      { p: 'Însemna doar:' },
      { quote: ['„Nu aici.”'] },
      { h2: 'Un singur „nu”' },
      {
        lines: [
          'Și am început involuntar să fac o comparație.',
          'M-am gândit la oameni care lucrează în vânzări.',
          'La oameni care lucrează în servicii.',
          'La antreprenori.',
          'La profesioniști care își construiesc o carieră și care, uneori, după două-trei răspunsuri negative de la un client, încep să se îndoiască de ei.',
        ],
      },
      {
        lines: [
          '„Poate nu sunt suficient de bun.”',
          '„Poate nu este bun serviciul meu.”',
          '„Poate nu mă vrea piața.”',
          '„Poate ar trebui să renunț.”',
        ],
      },
      { p: 'Un singur „nu” poate deveni, în mintea noastră, o concluzie despre propria valoare.' },
      {
        p: 'Și aici cred că se află una dintre marile diferențe dintre oamenii care continuă și cei care se opresc.',
      },
      { h2: 'Ce înseamnă pentru tine un refuz?' },
      { lines: ['Este o informație?', 'Sau este o sentință?'] },
      { p: 'Pentru că un refuz nu spune întotdeauna „nu ești suficient de bun”.' },
      {
        lines: [
          'Poate să însemne „nu acum”.',
          '„Nu pentru mine.”',
          '„Nu în forma aceasta.”',
          '„Nu am nevoie de ceea ce îmi oferi.”',
          '„Nu sunt pregătit.”',
        ],
      },
      { p: 'Sau, pur și simplu:' },
      { quote: ['„Nu.”'] },
      { lines: ['Atât.', 'Fără să fie nevoie să îi adăugăm noi o poveste.'] },
      {
        p: 'Cred că acei copii au învățat ceva ce multe cursuri de vânzări încearcă să ne învețe ulterior.',
      },
      {
        lines: [
          'Nu știu dacă cineva le-a vorbit despre mindset.',
          'Nu știu dacă au făcut vreodată un curs despre perseverență.',
          'Probabil că nu.',
          'Dar viața i-a antrenat.',
        ],
      },
      {
        lines: [
          'Au învățat, din experiență, că dacă un om spune nu, există și următorul om.',
          'Că dacă o ușă se închide, trebuie să cauți alta.',
          'Că un refuz nu înseamnă că trebuie să te oprești din a încerca.',
        ],
      },
      {
        lines: [
          'Desigur, nu cred că acesta este un model de comportament pe care trebuie să-l copiem în întregime.',
          'Există limite.',
          'Există dreptul celuilalt de a spune nu.',
          'Există respectul pentru spațiul și alegerea celuilalt.',
        ],
      },
      {
        lines: [
          { b: 'Dar, dincolo de comportament, am văzut un mecanism mental interesant.' },
          'Unul pe care îl putem privi și învăța din el.',
        ],
      },
      { h2: 'Refuzul nu trebuie să-ți ia puterea' },
      { p: 'Poate fi doar o informație.' },
      {
        p: [
          'Și poate că aceasta este una dintre cele mai importante perspective pe care le putem construi ',
          { link: 'atunci când vrem să performăm', href: `${W}#cand-planul-nu-mai-functioneaza` },
          ', indiferent că vorbim despre vânzări, carieră, antreprenoriat sau viață.',
        ],
      },
      {
        lines: [
          'Să nu confundăm un rezultat cu identitatea noastră.',
          'Să nu transformăm un „nu” într-un „nu sunt bun”.',
          'Să nu lăsăm un eșec punctual să devină o definiție despre cine suntem.',
        ],
      },
      {
        p: 'Și, mai ales, să nu permitem minții să închidă povestea înainte ca noi să fi ajuns la următoarea pagină.',
      },
      {
        p: 'Pentru că uneori diferența dintre cel care reușește și cel care renunță nu este talentul.',
      },
      {
        lines: [
          'Nici inteligența.',
          'Nici norocul.',
          'Ci felul în care fiecare dintre ei interpretează ceea ce tocmai s-a întâmplat.',
        ],
      },
      {
        lines: [
          'Eu am văzut niște copii pe o plajă.',
          'Dar, pentru câteva minute, am văzut și o lecție despre perseverență.',
        ],
      },
      { p: { b: 'O altă zi. O altă perspectivă.' } },
      {
        lines: [
          'Și poate că asta este frumusețea perspectivei:',
          'realitatea nu se schimbă întotdeauna când o privești diferit.',
        ],
      },
      { quote: ['Dar ceea ce poți face în ea, da.'] },
    ],
  },

  {
    title: 'Succesul nu începe cu banii. Începe cu modelul pe care îl ai în minte',
    slug: 'succesul-nu-incepe-cu-banii',
    category: 'performanta',
    excerpt:
      'Am văzut documentarul despre José Mourinho și m-am întors la o întrebare pe care o pun des în munca mea: care este modelul tău în viață?',
    publishedAt: '2026-10-05',
    body: [
      {
        p: 'Am văzut documentarul despre José Mourinho și m-am întors la una dintre întrebările pe care le adresez frecvent în munca mea:',
      },
      {
        quote: [
          'Care este modelul tău în viață?',
          'Cine te inspiră?',
          'Ce comportamente ale oamenilor de succes ai observat, ai înțeles și ai modelat de-a lungul timpului?',
        ],
      },
      {
        p: 'Trebuie să recunosc: sunt surprinzător de puțini oamenii care au un model clar de succes. Un mentor. O persoană de referință. Cineva de la care să învețe nu doar ce face, ci mai ales cum gândește, cum decide și cum vede lucrurile.',
      },
      { p: 'Mourinho mi-a oferit un exemplu foarte bun.' },
      {
        p: 'Da, contractele lui au fost colosale. Dar, dacă urmărești parcursul lui, nu banii par să fie centrul discursului său interior.',
      },
      { h2: 'Succesul a fost înaintea banilor' },
      {
        p: 'Banii au venit ca o consecință a rezultatelor, a valorii pe care a reușit să o creeze pentru cluburile cu care a lucrat.',
      },
      {
        p: 'Și aici cred că există o diferență importantă între două moduri de a privi performanța.',
      },
      {
        lines: [
          'Mulți oameni urmăresc creșterea financiară.',
          'Oamenii care construiesc performanță urmăresc să înțeleagă mecanismul care produce rezultatul.',
          'Iar banii pot deveni consecința.',
        ],
      },
      { h2: 'Ce îl face pe Mourinho atât de bun?' },
      { p: 'Nu este doar cunoașterea fotbalului.' },
      {
        p: 'Este mindsetul lui și abilitatea de a vedea omul dincolo de poziția lui din teren.',
      },
      { p: 'Poate să vadă într-un jucător ceea ce încă nu este evident.' },
      {
        lines: [
          'Îi vede potențialul, dar și limitele.',
          'Vede abilitățile, dar și ceea ce îi lipsește.',
          'Vede individul, dar înțelege întregul sistem.',
        ],
      },
      { lines: ['Nu privește punctual. Privește în ansamblu.', 'Face conexiuni.'] },
      {
        p: 'Știe ce să potențeze la fiecare om și, la fel de important, știe ce trebuie schimbat pentru ca acel om să producă rezultatul de care echipa are nevoie.',
      },
      { p: 'Și poate că aici se află una dintre cele mai importante lecții despre performanță:' },
      {
        quote: [
          'Nu poți construi rezultate extraordinare dacă nu înțelegi omul care trebuie să le producă.',
        ],
      },
      { h2: 'Pornesc de la om' },
      {
        p: [
          'De aceea, ',
          { link: 'în munca mea', href: '/servicii' },
          ', nu pornesc doar de la obiectiv.',
        ],
      },
      { p: { b: 'Pornesc de la om.' } },
      {
        ul: [
          'Cine este?',
          'Ce resurse are?',
          'Cum gândește?',
          'Ce comportamente îl susțin?',
          'Ce îl blochează?',
          'Ce potențial nu este încă folosit?',
          'Ce conexiuni nu vede?',
          'Ce trebuie consolidat pentru ca obiectivul să nu rămână doar o formulare SMART pe hârtie?',
        ],
      },
      { p: 'Pentru mine, performanța umană înseamnă exact acest lucru:' },
      {
        p: [
          'să construiești ',
          {
            link: 'baza umană capabilă să susțină rezultatul',
            href: `${W}#omul-din-spatele-liderului`,
          },
          ' pe care îl dorești.',
        ],
      },
      { p: 'Iar întrebarea pe care ți-o las astăzi este:' },
      {
        quote: [
          'Dacă ai putea alege un singur om al cărui mod de a gândi și de a performa să îl studiezi în următorul an, cine ar fi?',
        ],
      },
      {
        lines: [
          'Nu pentru a deveni el.',
          'Ci pentru a descoperi ce ai putea învăța despre tine uitându-te atent la el.',
        ],
      },
    ],
  },
]
