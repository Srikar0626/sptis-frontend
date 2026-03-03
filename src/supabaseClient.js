import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://inxktvrnmvmnudexdrkr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlueGt0dnJubXZtbnVkZXhkcmtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1Mjc3MjgsImV4cCI6MjA4ODEwMzcyOH0.NAePPdGEzT5GSfJuG8B93lhqYH7BtS4F0EXS_qDO2bo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);