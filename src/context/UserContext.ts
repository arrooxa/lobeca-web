import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  createElement,
} from "react";
import {
  getItemAsync,
  setItemAsync,
  deleteItemAsync,
} from "../utils/secureStorage.js";
import { userService } from "../services/users/index.js";
import type { User } from "../types/user.js";

interface UserContextData {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isWorker: boolean;
  isCustomer: boolean;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextData>({} as UserContextData);

const USER_STORAGE_KEY = "lobeca_user";

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = Boolean(user);
  const isCustomer = user?.typeID === 1;
  const isWorker = user?.typeID === 2;

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      setIsLoading(true);
      const storedUser = await getItemAsync(USER_STORAGE_KEY);

      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData: User) => {
    try {
      setUser(userData);
      await setItemAsync(USER_STORAGE_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error("Erro ao salvar dados do usuário:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await deleteItemAsync(USER_STORAGE_KEY);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      throw error;
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!user) return;

      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      await setItemAsync(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      if (!user?.supabaseID) return;

      const refreshedUser = await userService.getUserBySupabaseId(
        user.supabaseID
      );
      if (refreshedUser) {
        await updateUser(refreshedUser);
      }
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
      throw error;
    }
  };

  const value: UserContextData = {
    user,
    isLoading,
    isAuthenticated,
    isWorker,
    isCustomer,
    login,
    logout,
    updateUser,
    refreshUser,
  };

  return createElement(UserContext.Provider, { value }, children);
}

export function useUser(): UserContextData {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }

  return context;
}

export { UserContext };
