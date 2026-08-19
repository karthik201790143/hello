import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cqzqedfxkucqrymopsll.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxenFlZGZ4a3VjcXJ5bW9wc2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTQzNDIsImV4cCI6MjEwMjczMDM0Mn0.7K3etV1H3zmz-wYGGZTIeDr66xyZn4KG3I3Zy6V3WOM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
