import CryptoJS from "crypto-js";

const ENCRYPTION_KEY =
  import.meta.env.VITE_ENCRYPTION_KEY || "lobeca-default-key-2024";

export const setItemAsync = async (
  key: string,
  value: string
): Promise<void> => {
  try {
    const encrypted = CryptoJS.AES.encrypt(value, ENCRYPTION_KEY).toString();
    localStorage.setItem(key, encrypted);
  } catch (error) {
    console.error("Erro ao salvar item no storage seguro:", error);
    throw new Error("Falha ao salvar dados no armazenamento seguro");
  }
};

export const getItemAsync = async (key: string): Promise<string | null> => {
  try {
    const encrypted = localStorage.getItem(key);

    if (!encrypted) {
      return null;
    }

    const decrypted = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

    if (!decryptedString) {
      localStorage.removeItem(key);
      return null;
    }

    return decryptedString;
  } catch (error) {
    console.error("Erro ao recuperar item do storage seguro:", error);
    localStorage.removeItem(key);
    return null;
  }
};

export const deleteItemAsync = async (key: string): Promise<void> => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Erro ao remover item do storage seguro:", error);
    throw new Error("Falha ao remover dados do armazenamento seguro");
  }
};

export const secureStorage = {
  setItemAsync,
  getItemAsync,
  deleteItemAsync,
};

export default secureStorage;
