import { createClient } from '@supabase/supabase-js';

// Remplacez par vos propres valeurs
const supabaseUrl = 'https://qdbgdsxakhrpmmkhqvjz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkYmdkc3hha2hycG1ta2hxdmp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNTU5MzksImV4cCI6MjA2NzczMTkzOX0.4l0i9GKgjTyqn8oJTjycf3Fpt4jVsFo88-2f9OjxHuw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
