import { createClient } from "@supabase/supabase-js";
import { config } from "@/utils/env";

export const supabase = createClient(
  config.supabaseUrl,
  config.supabaseAnonKey,
  {
    auth: {
      // Para web - usa localStorage seguro
      storage: typeof window !== "undefined" ? window.localStorage : undefined,

      // Configurações de autenticação
      autoRefreshToken: true,
      persistSession: true,

      // Configurações de segurança
      detectSessionInUrl: true,
      flowType: "pkce", // Mais seguro para SPAs
    },
  }
);
