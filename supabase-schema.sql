// ============================================================
// Supabase client configuration
// Digital Agency by Chandan Das
// ============================================================
const SUPABASE_URL = 'https://vkkqfodjnvmozcupmdie.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_7PezfOHheRM_lhhTPqfp1w_3RscyPqk';

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fetch site-wide settings (WhatsApp number, call number, offer text, price text)
// Falls back to sensible defaults if the row hasn't been saved yet or the
// request fails (e.g. offline), so the site keeps working either way.
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
      price: data.price || fallback.price,
      whatsapp: data.whatsapp || fallback.whatsapp,
      call: data.call || fallback.call
    };
  } catch (e) {
    console.error('getSiteSettings failed:', e);
    return fallback;
  }
}
