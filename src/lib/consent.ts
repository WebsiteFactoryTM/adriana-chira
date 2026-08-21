/**
 * Consimțământ + Google Consent Mode v2 — mod de BAZĂ.
 *
 * Decizie de proiect (brief §11.2): GA4 se încarcă DOAR după consimțământ
 * acordat. Modul avansat ar încărca tag-ul Google cu starea „denied" și ar
 * trimite pinguri fără cookie-uri — adică, prin definiție, cereri către un terț
 * ÎNAINTE de consimțământ. Asta contrazice pragul de zero cereri terțe din
 * §10.1 și expune adrese IP fără temei. Stările implicite `denied` rămân
 * declarate, ca tag-ul să pornească corect în momentul acordării.
 */

export const CONSENT_COOKIE = 'ac_consent'

/** La schimbarea politicii, versiunea crește și bara reapare pentru toți. */
export const CONSENT_VERSION = 1

/** Șase luni. */
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 182

export type ConsentState = {
  v: number
  analytics: boolean
  marketing: boolean
  ts: number
}

export function parseConsent(raw: string | undefined | null): ConsentState | null {
  if (!raw) return null
  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(raw))
    if (typeof parsed !== 'object' || parsed === null) return null
    const state = parsed as Partial<ConsentState>
    if (state.v !== CONSENT_VERSION) return null
    if (typeof state.analytics !== 'boolean' || typeof state.marketing !== 'boolean') return null
    return {
      v: CONSENT_VERSION,
      analytics: state.analytics,
      marketing: state.marketing,
      ts: typeof state.ts === 'number' ? state.ts : Date.now(),
    }
  } catch {
    return null
  }
}

export function serializeConsent(state: ConsentState): string {
  return encodeURIComponent(JSON.stringify(state))
}

/**
 * Scriptul care trebuie să ruleze PRIMUL, inline în `<head>`.
 *
 * Nu `next/script`: strategiile lui nu garantează că nimic Google nu apucă să
 * pornească înainte. Aici: dataLayer + gtag, stările implicite denied, apoi —
 * dacă există consimțământ salvat — `update` imediat și încărcarea GA4 după
 * `requestIdleCallback`, niciodată în calea LCP.
 */
export function buildConsentBootstrap(measurementId: string | null): string {
  return `
(function(w,d){
  w.dataLayer = w.dataLayer || [];
  function gtag(){ w.dataLayer.push(arguments); }
  w.gtag = gtag;

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500
  });

  var ID = ${measurementId ? JSON.stringify(measurementId) : 'null'};
  var loaded = false;

  w.__acLoadAnalytics = function(){
    if (loaded || !ID) return;
    loaded = true;
    var start = function(){
      var s = d.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
      d.head.appendChild(s);
      gtag('js', new Date());
      gtag('config', ID, { anonymize_ip: true, send_page_view: true });
    };
    if ('requestIdleCallback' in w) w.requestIdleCallback(start, { timeout: 4000 });
    else setTimeout(start, 2000);
  };

  w.__acApplyConsent = function(state){
    gtag('consent', 'update', {
      analytics_storage: state.analytics ? 'granted' : 'denied',
      ad_storage: state.marketing ? 'granted' : 'denied',
      ad_user_data: state.marketing ? 'granted' : 'denied',
      ad_personalization: state.marketing ? 'granted' : 'denied'
    });
    if (state.analytics) w.__acLoadAnalytics();
  };

  try {
    var m = d.cookie.match(/(?:^|; )${CONSENT_COOKIE}=([^;]*)/);
    if (m && m[1]) {
      var saved = JSON.parse(decodeURIComponent(m[1]));
      if (saved && saved.v === ${CONSENT_VERSION}) {
        w.__acConsent = saved;
        w.__acApplyConsent(saved);
      }
    }
  } catch (e) {}
})(window, document);
`.trim()
}
