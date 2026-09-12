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
  // Hide immediately before the page finishes rendering to avoid a flash.
  const style = document.createElement('style');
  style.id = 'no-public-pricing';
  style.textContent = `
    #pricing{display:none!important}
    .first-order-offer{display:none!important}
    #offerBanner{display:none!important}
  `;
  document.head.appendChild(style);

  function cleanup(){
    // Remove the full pricing section.
    const pricing = document.getElementById('pricing');
    if (pricing) pricing.remove();

    // Remove menu links that point to Pricing.
    document.querySelectorAll('a[href="#pricing"]').forEach(el => el.remove());

    // Remove fixed starting-price promotional badge.
    document.querySelectorAll('div,span,p,strong').forEach(el => {
      const text = (el.textContent || '').trim();
      if (/Website Starting Price Only\s*₹?\s*999/i.test(text)) el.remove();
    });

    // Replace the business-growth fixed-price feature with quotation wording.
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

    // Remove numeric budget ranges from the consultation popup.
    const budget = document.getElementById('c_budget');
    if (budget) {
      budget.innerHTML = '<option value="">Budget আলোচনা করবেন?</option><option>Discuss on WhatsApp</option><option>Discuss on Call</option>';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cleanup, { once:true });
  } else {
    cleanup();
  }
})();
