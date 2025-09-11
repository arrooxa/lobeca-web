/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Configurações da API
  readonly VITE_API_URL?: string;
  readonly VITE_HOST_URI?: string;

  // Configurações do Supabase
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;

  // Chave de criptografia para o armazenamento seguro
  readonly VITE_ENCRYPTION_KEY: string;

  // Configurações de desenvolvimento
  readonly VITE_IS_DEV: string;
  readonly VITE_DEV_OTP_CODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
