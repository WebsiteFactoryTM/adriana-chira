/**
 * Fallback pentru browserele fără scroll-driven animations (Safari < 26,
 * Firefox fără flag). Un singur script inline, un singur IntersectionObserver
 * pentru toată pagina. Pe browserele moderne iese imediat și nu costă nimic.
 *
 * Script inline, nu Client Component: nu adaugă nimic în bundle-ul React și
 * rulează înainte de hidratare, deci nu există flash de conținut ascuns.
 */

const SCRIPT = `
(function(){
  if (window.CSS && CSS.supports && CSS.supports('animation-timeline: view()')) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // Abia acum CSS-ul are voie să ascundă elementele: știm sigur că există JS
  // care le va dezvălui. Fără marcaj, conținutul rămâne vizibil.
  document.documentElement.setAttribute('data-ac-reveal','js');
  var run = function(){
    var els = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      for (var i = 0; i < els.length; i++) els[i].setAttribute('data-revealed','true');
      return;
    }
    var io = new IntersectionObserver(function(entries){
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.setAttribute('data-revealed','true');
          io.unobserve(entries[i].target);
        }
      }
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    for (var j = 0; j < els.length; j++) io.observe(els[j]);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
`.trim()

export function RevealFallback() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
}
