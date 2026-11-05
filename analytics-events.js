/* Contact intent is separate from a successfully stored enquiry. No form values or link query strings. */
(function () {
  'use strict';
  if (window.agencyTrack) return;
  var measurementId = 'G-9929BK5LN5';
  window.agencyTrack = function (name, details) {
    if (!['whatsapp_click', 'call_click', 'generate_lead'].includes(name)) return;
    if (typeof window.gtag !== 'function') return;
    var params = {send_to: measurementId, transport_type: 'beacon', page_location: location.origin + location.pathname};
    ['contact_method', 'lead_source'].forEach(function (key) {
      if (details && details[key]) params[key] = details[key];
    });
    if (new URLSearchParams(location.search).get('analytics_debug') === '1') params.debug_mode = true;
    window.gtag('event', name, params);
  };
  document.addEventListener('click', function (event) {
    var anchor = event.target.closest && event.target.closest('a[href]');
    if (!anchor) return;
    var href = anchor.getAttribute('href') || '';
    var method;
    if (/^tel:/i.test(href)) method = 'call';
    else {
      try {
        var url = new URL(href, location.href);
        if (url.protocol === 'https:' && ['wa.me', 'api.whatsapp.com', 'web.whatsapp.com'].includes(url.hostname)) method = 'whatsapp';
      } catch (_) { return; }
    }
    if (method) window.agencyTrack(method + '_click', {contact_method: method, lead_source: 'website_link'});
  }, true);
})();
