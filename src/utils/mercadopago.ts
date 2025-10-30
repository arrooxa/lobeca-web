import { config } from "./env";

// ========== FORMAT HELPERS ==========

export const formatCardNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  const formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1 ");
  return formatted;
};

export const formatExpiryDate = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");

  if (cleaned.length >= 2) {
    return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4);
  }

  return cleaned;
};

// ========== VALIDATION HELPERS ==========

export const validateExpiryDate = (expiryDate: string): boolean => {
  if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
    return false;
  }

  const [month, year] = expiryDate.split("/");
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10) + 2000; // Converte YY para YYYY

  // Validar mês
  if (monthNum < 1 || monthNum > 12) {
    return false;
  }

  // Validar se não está expirado
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (
    yearNum < currentYear ||
    (yearNum === currentYear && monthNum < currentMonth)
  ) {
    return false;
  }

  return true;
};

export const validateCVV = (cvv: string, cardBrand?: string): boolean => {
  if (!cvv || !/^\d+$/.test(cvv)) {
    return false;
  }

  // American Express tem 4 dígitos, outros têm 3
  if (cardBrand === "amex") {
    return cvv.length === 4;
  }

  return cvv.length === 3;
};

export const validateCardNumber = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s/g, "");

  if (cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }

  // Algoritmo de Luhn
  let sum = 0;
  let alternate = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let n = parseInt(cleaned.charAt(i), 10);

    if (alternate) {
      n *= 2;
      if (n > 9) {
        n = (n % 10) + 1;
      }
    }

    sum += n;
    alternate = !alternate;
  }

  return sum % 10 === 0;
};

export const validateCardholderName = (name: string): boolean => {
  const cleaned = name.trim().toLowerCase();
  const words = cleaned.split(/\s+/).filter((word) => word.length > 0);

  if (words.length < 2) {
    return false;
  }

  return words.every(
    (word) => word.length >= 2 && /^[a-záàâãéèêíìîóòôõúùûçñ]+$/i.test(word)
  );
};

export const isCardExpired = (month: string, year: string): boolean => {
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10) + 2000; // Converte YY para YYYY

  // Validar mês
  if (monthNum < 1 || monthNum > 12) {
    return true; // Se mês inválido, considera expirado
  }

  // Verificar se está expirado
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  return (
    yearNum < currentYear ||
    (yearNum === currentYear && monthNum < currentMonth)
  );
};

// ========== MERCADO PAGO SDK INTERFACES ==========

export interface MercadoPagoCardFormData {
  token: string;
  paymentMethodId: string;
  issuerId: string;
  cardholderEmail: string;
  amount: string;
  installments: string;
  identificationNumber: string;
  identificationType: string;
}

export interface MercadoPagoCardFormCallbacks {
  onFormMounted?: (error?: Error) => void;
  onSubmit: (event: Event) => void;
  onFetching?: (resource: string) => () => void;
}

export interface MercadoPagoCardFormConfig {
  amount: string;
  iframe?: boolean;
  form: {
    id: string;
    cardNumber: {
      id: string;
      placeholder: string;
    };
    expirationDate: {
      id: string;
      placeholder: string;
    };
    securityCode: {
      id: string;
      placeholder: string;
    };
    cardholderName: {
      id: string;
      placeholder: string;
    };
    issuer: {
      id: string;
      placeholder: string;
    };
    installments: {
      id: string;
      placeholder: string;
    };
    identificationType: {
      id: string;
      placeholder: string;
    };
    identificationNumber: {
      id: string;
      placeholder: string;
    };
    cardholderEmail: {
      id: string;
      placeholder: string;
    };
  };
  callbacks: MercadoPagoCardFormCallbacks;
}

export interface MercadoPagoCardForm {
  mount: () => void;
  unmount: () => void;
  getCardFormData: () => MercadoPagoCardFormData;
}

// Declaração global para o SDK do Mercado Pago
declare global {
  interface Window {
    MercadoPago: {
      new (publicKey: string, options?: { locale?: string }): {
        cardForm: (
          config: MercadoPagoCardFormConfig
        ) => MercadoPagoCardForm;
        getIdentificationTypes: () => Promise<Array<{
          id: string;
          name: string;
          type: string;
          min_length: number;
          max_length: number;
        }>>;
      };
    };
  }
}

// ========== MERCADO PAGO SDK MANAGEMENT ==========

/**
 * Verifica se o SDK do Mercado Pago está carregado
 */
export const isMercadoPagoLoaded = (): boolean => {
  return typeof window !== "undefined" && typeof window.MercadoPago !== "undefined";
};

/**
 * Carrega o SDK do Mercado Pago dinamicamente
 */
export const loadMercadoPagoSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Verifica se já foi carregado
    if (isMercadoPagoLoaded()) {
      resolve();
      return;
    }

    // Verifica se já existe um script sendo carregado
    const existingScript = document.querySelector(
      'script[src*="mercadopago.com/js/v2"]'
    );
    
    if (existingScript) {
      existingScript.addEventListener("load", () => {
        const checkInterval = setInterval(() => {
          if (isMercadoPagoLoaded()) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
        
        setTimeout(() => {
          clearInterval(checkInterval);
          reject(new Error("Timeout ao carregar SDK do Mercado Pago"));
        }, 10000);
      });
      return;
    }

    // Cria e adiciona o script
    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.async = true;

    script.onload = () => {
      // Aguarda o MercadoPago estar disponível
      const checkInterval = setInterval(() => {
        if (isMercadoPagoLoaded()) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);

      // Timeout de segurança
      setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error("Timeout ao inicializar SDK do Mercado Pago"));
      }, 10000);
    };

    script.onerror = () =>
      reject(new Error("Falha ao carregar SDK do Mercado Pago"));
    
    document.head.appendChild(script);
  });
};

/**
 * Inicializa a instância do Mercado Pago
 */
export const initializeMercadoPago = async (): Promise<InstanceType<typeof window.MercadoPago>> => {
  await loadMercadoPagoSDK();

  const publicKey = config.mercadoPagoPublicKey;
  
  if (!publicKey) {
    throw new Error("Chave pública do Mercado Pago não configurada");
  }

  if (!window.MercadoPago) {
    throw new Error("SDK do Mercado Pago não foi carregado");
  }

  return new window.MercadoPago(publicKey, { locale: "pt-BR" });
};

// ========== CARD FORM MANAGEMENT ==========

export interface PaymentFormData {
  cardNumber: string;
  cardholderName: string;
  cardholderEmail: string;
  expiryDate: string;
  cvv: string;
  identificationType: string;
  identificationNumber: string;
}

/**
 * Cria e configura o CardForm do Mercado Pago
 * @param amount - Valor da transação
 * @param onTokenGenerated - Callback quando o token é gerado com sucesso
 * @param onError - Callback de erro
 */
export const createCardForm = async (
  amount: string,
  onTokenGenerated: (token: string, cardFormData: MercadoPagoCardFormData) => void,
  onError: (error: Error) => void
): Promise<MercadoPagoCardForm> => {
  const mp = await initializeMercadoPago();

  const cardForm = mp.cardForm({
    amount,
    iframe: true,
    form: {
      id: "mercadopago-form",
      cardNumber: {
        id: "form-checkout__cardNumber",
        placeholder: "Número do cartão",
      },
      expirationDate: {
        id: "form-checkout__expirationDate",
        placeholder: "MM/YY",
      },
      securityCode: {
        id: "form-checkout__securityCode",
        placeholder: "Código de segurança",
      },
      cardholderName: {
        id: "form-checkout__cardholderName",
        placeholder: "Titular do cartão",
      },
      issuer: {
        id: "form-checkout__issuer",
        placeholder: "Banco emissor",
      },
      installments: {
        id: "form-checkout__installments",
        placeholder: "Parcelas",
      },
      identificationType: {
        id: "form-checkout__identificationType",
        placeholder: "Tipo de documento",
      },
      identificationNumber: {
        id: "form-checkout__identificationNumber",
        placeholder: "Número do documento",
      },
      cardholderEmail: {
        id: "form-checkout__cardholderEmail",
        placeholder: "E-mail",
      },
    },
    callbacks: {
      onFormMounted: (error) => {
        if (error) {
          console.error("Erro ao montar formulário:", error);
          onError(error);
        } else {
          console.log("Formulário montado com sucesso");
        }
      },
      onSubmit: (event) => {
        event.preventDefault();

        try {
          const cardFormData = cardForm.getCardFormData();
          
          if (!cardFormData.token) {
            throw new Error("Token não foi gerado");
          }

          onTokenGenerated(cardFormData.token, cardFormData);
        } catch (error) {
          console.error("Erro ao obter dados do formulário:", error);
          onError(
            error instanceof Error
              ? error
              : new Error("Erro ao processar dados do cartão")
          );
        }
      },
      onFetching: (resource) => {
        console.log("Carregando recurso:", resource);

        // Pode ser usado para mostrar loading em elementos específicos
        const progressBar = document.querySelector(".progress-bar");
        if (progressBar) {
          progressBar.removeAttribute("value");
        }

        return () => {
          if (progressBar) {
            progressBar.setAttribute("value", "0");
          }
        };
      },
    },
  });

  return cardForm;
};

/**
 * Função simplificada para tokenizar os dados do cartão
 * Esta é a função principal que deve ser usada nos componentes
 */
export const tokenizeCard = (
  amount: number,
  onProgress?: (isLoading: boolean) => void
): Promise<{ token: string; cardFormData: MercadoPagoCardFormData }> => {
  return new Promise((resolve, reject) => {
    onProgress?.(true);

    createCardForm(
      amount.toString(),
      (token, cardFormData) => {
        onProgress?.(false);
        resolve({ token, cardFormData });
      },
      (error) => {
        onProgress?.(false);
        reject(error);
      }
    )
      .then((cardForm) => {
        // Monta o formulário
        cardForm.mount();
      })
      .catch((error) => {
        onProgress?.(false);
        reject(error);
      });
  });
};

/**
 * Obtém os tipos de documento disponíveis para o país
 */
export const getIdentificationTypes = async () => {
  const mp = await initializeMercadoPago();
  return mp.getIdentificationTypes();
};

/**
 * Função de teste para verificar se o SDK do Mercado Pago está funcionando
 */
export const testMercadoPagoLoad = async (): Promise<boolean> => {
  try {
    await loadMercadoPagoSDK();
    return isMercadoPagoLoaded();
  } catch (error) {
    console.error("Erro ao testar SDK do Mercado Pago:", error);
    return false;
  }
};
