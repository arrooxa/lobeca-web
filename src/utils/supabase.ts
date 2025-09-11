import { createClient } from "@supabase/supabase-js";
import { config } from "@/utils/env";

export const supabase = createClient(
  config.supabaseUrl,
  config.supabaseAnonKey
);
