import { supabase } from "@/utils/supabase";
// import { config } from "@/utils/env";

export const checkPhoneExists = async (phone: string): Promise<boolean> => {
  // if (config.isDev) {
  //   console.log(
  //     `[DEV] Verificação de telefone simulada para ${phone}: exists = true`
  //   );
  //   return true;
  // }

  try {
    const { data } = await supabase.rpc("check_phone_exists", {
      phone_number: phone.replace(/^\+/, ""), // Remove o '+' para a RPC call
    });

    return Boolean(data);
  } catch (error) {
    console.error("Erro ao verificar telefone:", error);
    return false;
  }
};
