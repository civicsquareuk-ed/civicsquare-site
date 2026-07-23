/* Civic Square — GA4 consent-gated analytics + cookie banner.
 * Analytics load ONLY after explicit Accept (UK PECR / GDPR prior consent).
 * Swap MEASUREMENT_ID for your real GA4 ID (G-XXXXXXX). Until then GA is inert. */
(function () {
  var MEASUREMENT_ID = 'G-XXXXXXXXXX';   // <-- replace with your GA4 Measurement ID
  var KEY = 'cs-consent';                 // 'granted' | 'denied'

  var css = '\
  .cc-banner{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:720px;margin:0 auto;background:#001D3D;color:#fff;border-radius:16px;padding:20px 22px;box-shadow:0 18px 50px rgba(0,29,61,.35);font-family:Inter,system-ui,sans-serif;display:none}\
  .cc-banner.show{display:block}\
  .cc-banner p{margin:0 0 14px;font-size:.92rem;line-height:1.55;color:#dbe2ee}\
  .cc-banner a{color:#FFB625;font-weight:600}\
  .cc-actions{display:flex;flex-wrap:wrap;gap:10px}\
  .cc-btn{flex:1;min-width:120px;border:0;cursor:pointer;border-radius:999px;padding:11px 18px;font-family:inherit;font-size:.9rem;font-weight:700;letter-spacing:.01em}\
  .cc-accept{background:#FFB625;color:#001D3D}\
  .cc-accept:hover{background:#ffc652}\
  .cc-reject{background:transparent;color:#fff;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.4)}\
  .cc-reject:hover{box-shadow:inset 0 0 0 1.5px #fff}\
  @media(max-width:520px){.cc-btn{flex:1 1 100%}}';
  var s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);

  function loadGA() {
    if (window.__gaLoaded || !/^G-/.test(MEASUREMENT_ID)) return;
    window.__gaLoaded = true;
    var g = document.createElement('script'); g.async = true;
    g.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
    document.head.appendChild(g);
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', MEASUREMENT_ID, { anonymize_ip: true });
  }

  var banner;
  function buildBanner() {
    if (banner) return banner;
    banner = document.createElement('div');
    banner.className = 'cc-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML =
      '<p>We use privacy-friendly analytics cookies to understand how the site is used. '
      + 'They load only if you accept. See our <a href="privacy.html">Privacy &amp; cookies</a> notice.</p>'
      + '<div class="cc-actions">'
      + '<button class="cc-btn cc-reject" type="button">Reject</button>'
      + '<button class="cc-btn cc-accept" type="button">Accept</button>'
      + '</div>';
    document.body.appendChild(banner);
    banner.querySelector('.cc-accept').addEventListener('click', function () { setConsent('granted'); });
    banner.querySelector('.cc-reject').addEventListener('click', function () { setConsent('denied'); });
    return banner;
  }

  function setConsent(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
    if (banner) banner.classList.remove('show');
    if (v === 'granted') loadGA();
  }

  function init() {
    var v;
    try { v = localStorage.getItem(KEY); } catch (e) {}
    if (v === 'granted') { loadGA(); return; }
    if (v === 'denied') return;
    buildBanner().classList.add('show');
  }

  // Public: re-open the banner from a "Cookie settings" link.
  window.openCookieSettings = function () { buildBanner().classList.add('show'); };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
