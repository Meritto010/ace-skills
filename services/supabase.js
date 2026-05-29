// services/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://abnnfrocwjgtmszfxmcu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFibm5mcm9jd2pndG1zemZ4bWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMTA3NDMsImV4cCI6MjA4MjY4Njc0M30.8GgsbHusHft_m4ZAEiO456EL8vjDBYLkH6in-FVo10I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const checkLicense = async (userKey) => {
  const { data, error } = await supabase.rpc('verify_license_key', { 
    key_input: userKey 
  });
  if (error) return false;
  return data; 
};