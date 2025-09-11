import { supabase } from "@/utils/supabase";
import { config } from "@/utils/env";

// Simula uma resposta de sucesso do Supabase para desenvolvimento
const createMockSuccessResponse = (phone: string) => ({
  data: {
    user: {
      id: `dev-user-${phone.replace(/\D/g, "")}`, // Gera um ID baseado no telefone
      phone,
      created_at: new Date().toISOString(),
      email_confirmed_at: null,
      phone_confirmed_at: new Date().toISOString(),
    },
    session: {
      access_token: "dev-access-token",
      refresh_token: "dev-refresh-token",
      expires_in: 3600,
      token_type: "bearer",
      user: {
        id: `dev-user-${phone.replace(/\D/g, "")}`,
        phone,
      },
    },
  },
  error: null,
});

// Função para enviar OTP (com bypass em desenvolvimento)
export const sendOTP = async (phone: string) => {
  if (config.isDev) {
    console.log(
      `[DEV] Código OTP simulado enviado para ${phone}: ${config.devOtpCode}`
    );

    // Simula um pequeno delay para parecer real
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      data: { user: null, session: null },
      error: null,
    };
  }

  // Em produção, usa o Supabase normalmente
  return await supabase.auth.signInWithOtp({ phone });
};

// Função para verificar OTP (com bypass em desenvolvimento)
export const verifyOTP = async (phone: string, token: string) => {
  if (config.isDev) {
    console.log(`[DEV] Verificando código OTP para ${phone}: ${token}`);

    // Verifica se o código é o código de desenvolvimento
    if (token === config.devOtpCode) {
      console.log(
        `[DEV] Código OTP correto! Simulando autenticação bem-sucedida.`
      );

      // Simula um pequeno delay para parecer real
      await new Promise((resolve) => setTimeout(resolve, 1500));

      return createMockSuccessResponse(phone);
    } else {
      console.log(
        `[DEV] Código OTP incorreto. Esperado: ${config.devOtpCode}, Recebido: ${token}`
      );

      return {
        data: { user: null, session: null },
        error: {
          message: "Token has expired or is invalid",
          status: 400,
        },
      };
    }
  }

  // Em produção, usa o Supabase normalmente
  return await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });
};
