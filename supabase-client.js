// ============================================================
// Supabase client configuration
// Digital Agency by Chandan Das
// ============================================================
const SUPABASE_URL = 'https://vkkqfodjnvmozcupmdie.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_7PezfOHheRM_lhhTPqfp1w_3RscyPqk';

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
window.sb = sb;

// Fetch site-wide settings.
async function getSiteSettings() {
  const fallback = {
    offer: '',
    price: '',
    whatsapp: '917549459770',
    call: '919735474770'
  };
  try {
    const { data, error } = await sb.from('site_settings').select('*').eq('id', 1).single();
    if (error || !data) return fallback;
    return {
      offer: data.offer || fallback.offer,
      price: '',
      whatsapp: data.whatsapp || fallback.whatsapp,
      call: data.call || fallback.call
    };
  } catch (e) {
    console.error('getSiteSettings failed:', e);
    return fallback;
  }
}

// ============================================================
// Homepage pricing cleanup
// Fixed public prices are intentionally hidden. Visitors contact directly
// for a requirement-based quotation.
// ============================================================
(function removePublicPricing(){
  const style = document.createElement('style');
  style.id = 'no-public-pricing';
  style.textContent = `
    #pricing{display:none!important}
    .first-order-offer{display:none!important}
    #offerBanner{display:none!important}
  `;
  document.head.appendChild(style);

  function cleanup(){
    const pricing = document.getElementById('pricing');
    if (pricing) pricing.remove();
    document.querySelectorAll('a[href="#pricing"]').forEach(el => el.remove());
    document.querySelectorAll('div,span,p,strong').forEach(el => {
      const text = (el.textContent || '').trim();
      if (/Website Starting Price Only\s*₹?\s*999/i.test(text)) el.remove();
    });
    document.querySelectorAll('.business-growth-feature').forEach(card => {
      const text = card.textContent || '';
      if (/Starting\s*₹?\s*999/i.test(text)) {
        const strong = card.querySelector('strong');
        const small = card.querySelector('small');
        const icon = card.querySelector('i');
        if (strong) strong.textContent = 'Custom Quote';
        if (small) small.textContent = 'Based on your requirements';
        if (icon) icon.className = 'fa-solid fa-comments';
      }
    });
    const budget = document.getElementById('c_budget');
    if (budget) {
      budget.innerHTML = '<option value="">Budget আলোচনা করবেন?</option><option>Discuss on WhatsApp</option><option>Discuss on Call</option>';
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', cleanup, { once:true });
  else cleanup();
})();

// ============================================================
// Lead conversion upgrade
// ============================================================
(function improveLeadConversion(){
  const style = document.createElement('style');
  style.id = 'lead-conversion-upgrade';
  style.textContent = `
    .lead-quick-section{padding:22px 16px;background:linear-gradient(180deg,#050816,#08101f)}
    .lead-quick-shell{max-width:1180px;margin:0 auto;border:1px solid rgba(103,232,249,.22);background:linear-gradient(135deg,rgba(8,145,178,.10),rgba(124,58,237,.10),rgba(34,197,94,.07));border-radius:22px;padding:24px;box-shadow:0 18px 45px rgba(0,0,0,.22)}
    .lead-quick-grid{display:grid;grid-template-columns:1.25fr .75fr;gap:22px;align-items:center}
    .lead-quick-kicker{display:inline-flex;align-items:center;gap:7px;padding:6px 10px;border-radius:999px;border:1px solid rgba(34,211,238,.3);background:rgba(34,211,238,.08);color:#67e8f9;font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}
    .lead-quick-title{margin:12px 0 8px;color:#fff;font-size:clamp(24px,3.5vw,38px);line-height:1.15;font-weight:900}
    .lead-quick-copy{margin:0;color:#cbd5e1;line-height:1.7;font-size:15px;max-width:720px}
    .lead-quick-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}
    .lead-quick-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:46px;padding:0 18px;border-radius:12px;text-decoration:none!important;color:#fff!important;font-size:14px;font-weight:900;transition:.2s}
    .lead-quick-btn:hover{transform:translateY(-2px)}
    .lead-quick-wa{background:linear-gradient(135deg,#22c55e,#16a34a);box-shadow:0 10px 24px rgba(34,197,94,.20)}
    .lead-quick-call{background:linear-gradient(135deg,#0284c7,#2563eb);box-shadow:0 10px 24px rgba(37,99,235,.18)}
    .lead-quick-service{border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06)}
    .lead-trust-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .lead-trust-item{padding:14px;border-radius:15px;border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.045)}
    .lead-trust-item strong{display:block;color:#fff;font-size:13px}
    .lead-trust-item span{display:block;color:#94a3b8;font-size:11px;margin-top:3px;line-height:1.45}
    @media(max-width:760px){.lead-quick-grid{grid-template-columns:1fr}.lead-quick-shell{padding:19px}.lead-quick-actions{display:grid}.lead-quick-btn{width:100%}.lead-trust-grid{grid-template-columns:1fr 1fr}}
  `;
  document.head.appendChild(style);
  function trackLead(action){
    if (typeof window.gtag === 'function') window.gtag('event','generate_lead',{lead_source:'homepage_quick_cta',lead_action:action});
  }
  function addSection(){
    if (document.getElementById('lead-quick-section')) return;
    const intro = document.getElementById('intro');
    if (!intro) return;
    const section = document.createElement('section');
    section.id = 'lead-quick-section';
    section.className = 'lead-quick-section';
    section.innerHTML = `
      <div class="lead-quick-shell"><div class="lead-quick-grid"><div>
        <span class="lead-quick-kicker">Website • App • SEO • Software</span>
        <h2 class="lead-quick-title">Tell Me What Your Business Needs</h2>
        <p class="lead-quick-copy">আপনার business-এর requirement বলুন। কোন service দরকার, কী feature useful এবং কীভাবে শুরু করলে ভালো হবে—সেটা সরাসরি discuss করে project-based quotation দেওয়া হবে।</p>
        <div class="lead-quick-actions">
          <a class="lead-quick-btn lead-quick-wa" data-lead-action="whatsapp" href="https://wa.me/917549459770?text=Hello%20Chandan%20Das%2C%20I%20want%20to%20discuss%20a%20website%2C%20app%20or%20digital%20project" target="_blank" rel="noopener">💬 Discuss on WhatsApp</a>
          <a class="lead-quick-btn lead-quick-call" data-lead-action="call" href="tel:+919735474770">📞 Call 9735474770</a>
          <a class="lead-quick-btn lead-quick-service" data-lead-action="services" href="digital-services-west-bengal.html">View All Services →</a>
        </div></div><div class="lead-trust-grid">
          <div class="lead-trust-item"><strong>Direct Developer Contact</strong><span>No sales team or middleman</span></div>
          <div class="lead-trust-item"><strong>Requirement-Based Quote</strong><span>No fixed public pricing</span></div>
          <div class="lead-trust-item"><strong>Mobile-Friendly Work</strong><span>Website and app-focused delivery</span></div>
          <div class="lead-trust-item"><strong>West Bengal + India</strong><span>Remote project discussion and delivery</span></div>
        </div></div></div>`;
    intro.insertAdjacentElement('afterend',section);
    section.querySelectorAll('[data-lead-action]').forEach(el => el.addEventListener('click',()=>trackLead(el.dataset.leadAction)));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addSection, { once:true });
  else addSection();
})();

// ============================================================
// Footer cleanup: independent freelancer branding + compact spacing
// ============================================================
(function polishHomepageFooter(){
  const style = document.createElement('style');
  style.id = 'footer-polish-2026';
  style.textContent = `
    footer{padding-top:28px!important;padding-bottom:28px!important}
    footer .max-w-7xl{gap:18px!important}
    @media(min-width:769px){footer .max-w-7xl{align-items:center!important}}
    @media(max-width:768px){footer{padding-top:22px!important;padding-bottom:22px!important}}
  `;
  document.head.appendChild(style);

  function cleanFooter(){
    const footer = document.querySelector('footer');
    if (!footer) return;
    const call = footer.querySelector('a[href="tel:+919735474770"]');
    if (call && /24\/7\s*Call/i.test(call.textContent || '')) call.textContent = '📞 Call: 9735474770';
    footer.querySelectorAll('p').forEach(p => {
      if (/Founder\s*&\s*Freelance Developer/i.test(p.textContent || '')) {
        p.textContent = '© 2026 Digital Agency by Chandan Das • Independent Freelance Developer';
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', cleanFooter, { once:true });
  else cleanFooter();
})();
