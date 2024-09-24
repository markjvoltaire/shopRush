import { AppState } from "react-native";
import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bxmhxzkcgvevndtkesrs.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4bWh4emtjZ3Zldm5kdGtlc3JzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNzExMjM2NywiZXhwIjoyMDQyNjg4MzY3fQ.iSReAAE3yeh0X_Rey28tM2jZ4bi0jtv8Bc2YTC0-p_4";
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  localStorage: AsyncStorage,
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: false,
});
