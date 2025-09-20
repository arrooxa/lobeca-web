export const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  hostUri: import.meta.env.VITE_HOST_URI,

  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,

  pagarmePublicKey: import.meta.env.VITE_PAGARME_PUBLIC_KEY,

  encryptionKey:
    import.meta.env.VITE_ENCRYPTION_KEY || "lobeca-default-key-2024",

  isDev: import.meta.env.VITE_IS_DEV === "true",
  devOtpCode: import.meta.env.VITE_DEV_OTP_CODE || "123456",
} as const;
