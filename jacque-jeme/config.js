// Supabase Configuration
// IMPORTANT: Replace these with your actual Supabase credentials

const SUPABASE_CONFIG = {
    url: 'YOUR_SUPABASE_URL',  // Replace with your Project URL from Supabase dashboard
    anonKey: 'YOUR_SUPABASE_ANON_KEY'  // Replace with your anon/public key from Supabase dashboard
};

// Initialize Supabase client (this will be used after you add the Supabase library)
let supabase = null;

// Check if Supabase is configured
function isSupabaseConfigured() {
    return SUPABASE_CONFIG.url !== 'YOUR_SUPABASE_URL' &&
           SUPABASE_CONFIG.anonKey !== 'YOUR_SUPABASE_ANON_KEY';
}

// Initialize Supabase when the page loads
window.addEventListener('DOMContentLoaded', () => {
    if (typeof supabase === 'undefined' && window.supabase) {
        if (isSupabaseConfigured()) {
            supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
            console.log('✅ Supabase connected successfully!');
        } else {
            console.warn('⚠️ Supabase not configured. Please update config.js with your credentials.');
        }
    }
});
