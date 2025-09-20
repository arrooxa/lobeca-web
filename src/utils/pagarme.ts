import { config } from "./env";

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

export const detectCardBrand = (cardNumber: string): string | null => {
  const cleaned = cardNumber.replace(/\s/g, "");

  const patterns = {
    visa: /^4/,
    mastercard: /^5[1-5]|^2[2-7]/,
    amex: /^3[47]/,
    diners: /^3[0689]/,
    discover: /^6(?:011|5)/,
    elo: /^(4011|4312|4389|4514|4573|6362|6363|6550|6551)/,
    hipercard: /^(606282|637095|637568|637599|637609|637612)/,
  };

  for (const [brand, pattern] of Object.entries(patterns)) {
    if (pattern.test(cleaned)) {
      return brand;
    }
  }

  return null;
};

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

// Declaração global para o tokenizecard.js
declare global {
  interface Window {
    PagarmeCheckout: {
      init: (
        successCallback?: (data: any) => boolean,
        failCallback?: (error: any) => void
      ) => void;
    };
  }
}

// Interface para dados do cartão no formato esperado pelo pagarme.js
interface CardData {
  card_number: string;
  card_holder_name: string;
  card_expiration_date: string;
  card_cvv: string;
}

// Interface para dados do formulário
interface PaymentFormData {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
}

// Declaração global para o tokenizecard.js
declare global {
  interface Window {
    PagarmeCheckout: {
      init: (
        successCallback?: (data: TokenizeResponse) => boolean,
        failCallback?: (error: TokenizeError) => void
      ) => void;
    };
  }
}

// Interface para resposta do tokenizecard.js
interface TokenizeResponse {
  "pagarmetoken-0": string;
  [key: string]: string | number | boolean;
}

// Interface para erro do tokenizecard.js
interface TokenizeError {
  message: string;
  [key: string]: string | number | boolean;
}

// Interface para dados do cartão no formato esperado pelo tokenizecard.js
interface CardData {
  card_number: string;
  card_holder_name: string;
  card_expiration_date: string;
  card_cvv: string;
}

// Interface para dados do formulário
interface PaymentFormData {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
}

// Função para carregar o script do tokenizecard.js
const loadTokenizeCardScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Verifica se já foi carregado
    if (window.PagarmeCheckout) {
      resolve();
      return;
    }

    // Verifica se já existe um script sendo carregado
    const existingScript = document.querySelector(
      'script[src*="tokenizecard"]'
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => {
        const checkInterval = setInterval(() => {
          if (window.PagarmeCheckout) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
        setTimeout(() => {
          clearInterval(checkInterval);
          reject(new Error("Timeout ao carregar tokenizecard.js"));
        }, 10000);
      });
      return;
    }

    // Cria e adiciona o script
    const script = document.createElement("script");
    script.src = "https://checkout.pagar.me/v1/tokenizecard.js";
    script.async = true;

    // Adiciona a chave pública como atributo
    const encryptionKey = config.pagarmePublicKey;
    if (!encryptionKey) {
      reject(new Error("Chave pública do Pagar.me não configurada"));
      return;
    }
    script.setAttribute("data-pagarmecheckout-app-id", encryptionKey);

    script.onload = () => {
      // Aguarda o PagarmeCheckout estar disponível
      const checkInterval = setInterval(() => {
        if (window.PagarmeCheckout) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);

      // Timeout de segurança
      setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error("Timeout ao inicializar tokenizecard.js"));
      }, 10000);
    };

    script.onerror = () =>
      reject(new Error("Falha ao carregar tokenizecard.js"));
    document.head.appendChild(script);
  });
};

// Função para criar formulário temporário para tokenização
const createTemporaryForm = (cardData: CardData): HTMLFormElement => {
  const form = document.createElement("form");
  form.setAttribute("data-pagarmecheckout-form", "");
  form.style.display = "none";

  // Cria inputs com os atributos corretos do tokenizecard.js
  const holderNameInput = document.createElement("input");
  holderNameInput.type = "text";
  holderNameInput.setAttribute("data-pagarmecheckout-element", "holder_name");
  holderNameInput.value = cardData.card_holder_name;

  const numberInput = document.createElement("input");
  numberInput.type = "text";
  numberInput.setAttribute("data-pagarmecheckout-element", "number");
  numberInput.value = cardData.card_number;

  const expMonthInput = document.createElement("input");
  expMonthInput.type = "text";
  expMonthInput.setAttribute("data-pagarmecheckout-element", "exp_month");
  expMonthInput.value = cardData.card_expiration_date.substring(0, 2);

  const expYearInput = document.createElement("input");
  expYearInput.type = "text";
  expYearInput.setAttribute("data-pagarmecheckout-element", "exp_year");
  expYearInput.value = "20" + cardData.card_expiration_date.substring(2, 4);

  const cvvInput = document.createElement("input");
  cvvInput.type = "text";
  cvvInput.setAttribute("data-pagarmecheckout-element", "cvv");
  cvvInput.value = cardData.card_cvv;

  form.appendChild(holderNameInput);
  form.appendChild(numberInput);
  form.appendChild(expMonthInput);
  form.appendChild(expYearInput);
  form.appendChild(cvvInput);

  return form;
};

// Função principal para tokenizar cartão usando tokenizecard.js
export const tokenizeCardWithTokenizeCardJS = async (
  cardData: CardData
): Promise<string> => {
  try {
    await loadTokenizeCardScript();

    if (!window.PagarmeCheckout) {
      throw new Error("tokenizecard.js não foi carregado");
    }

    return new Promise((resolve, reject) => {
      const form = createTemporaryForm(cardData);
      document.body.appendChild(form);

      const successCallback = (data: TokenizeResponse): boolean => {
        document.body.removeChild(form);

        if (data["pagarmetoken-0"]) {
          resolve(data["pagarmetoken-0"]);
        } else {
          reject(new Error("Token não foi gerado"));
        }
        return false; // Evita envio do formulário
      };

      const failCallback = (error: TokenizeError): void => {
        document.body.removeChild(form);
        console.error("Erro na tokenização:", error);
        reject(new Error(`Falha na tokenização: ${error.message}`));
      };

      // Inicializa o tokenizecard.js
      window.PagarmeCheckout.init(successCallback, failCallback);

      // Simula submit do formulário para trigger da tokenização
      setTimeout(() => {
        const event = new Event("submit", { bubbles: true, cancelable: true });
        form.dispatchEvent(event);
      }, 100);
    });
  } catch (error) {
    console.error("Erro na tokenização com tokenizecard.js:", error);
    throw new Error("Falha na tokenização do cartão");
  }
};

// Função para transformar dados do formulário
export const transformFormDataToPagarMe = (
  formData: PaymentFormData
): CardData => {
  return {
    card_number: formData.cardNumber.replace(/\s/g, ""),
    card_holder_name: formData.cardholderName.trim(),
    card_expiration_date: formData.expiryDate.replace("/", ""),
    card_cvv: formData.cvv,
  };
};

// Função de teste para verificar se o tokenizecard.js está funcionando
export const testPagarMeLoad = async (): Promise<boolean> => {
  try {
    await loadTokenizeCardScript();

    if (window.PagarmeCheckout) {
      console.log("PagarmeCheckout object:", window.PagarmeCheckout);
      console.log("init function:", typeof window.PagarmeCheckout.init);
    }

    return !!window.PagarmeCheckout;
  } catch (error) {
    console.error("Erro ao testar tokenizecard.js:", error);
    return false;
  }
};

// Função wrapper principal que será usada no componente
export const tokenizeFormData = async (
  formData: PaymentFormData
): Promise<string> => {
  const cardData = transformFormDataToPagarMe(formData);
  return await tokenizeCardWithTokenizeCardJS(cardData);
};
