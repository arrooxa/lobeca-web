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
import { supabase } from "../utils/supabase.js";
import { userService } from "../services/users/index.js";
import type { User } from "../types/user.js";
import type { Session } from "@supabase/supabase-js";

interface UserContextData {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isWorker: boolean;
  isCustomer: boolean;
  loginWithOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  verifyOtpAndCreateProfile: (
    phone: string,
    otp: string,
    userData: { name: string; typeID: number },
  ) => Promise<void>;
  register: (name: string, phone: string, typeID: number) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextData>({} as UserContextData);

const USER_PROFILE_KEY = "lobeca_user_profile";

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = Boolean(session);
  const isCustomer = user?.typeID === 1;
  const isWorker = user?.typeID === 2;

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);

      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
        try {
          await deleteItemAsync(USER_PROFILE_KEY);
        } catch (error) {
          console.error("Erro ao limpar cache:", error);
        }
      }

      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (supabaseId: string) => {
    try {
      const cachedProfile = await getItemAsync(USER_PROFILE_KEY);
      if (cachedProfile) {
        const parsedProfile = JSON.parse(cachedProfile) as User;
        if (parsedProfile.supabaseID === supabaseId) {
          setUser(parsedProfile);
        }
      }

      const userProfile = await userService.get();

      if (userProfile) {
        setUser(userProfile);
        await setItemAsync(USER_PROFILE_KEY, JSON.stringify(userProfile));
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      if (!user) setUser(null);
    }
  };

  const loginWithOtp = async (phone: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          channel: "sms",
          shouldCreateUser: false,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error("Erro ao enviar OTP:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (phone: string, otp: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: "sms",
      });

      if (error) throw error;

      if (data.user && !user) {
        await loadUserProfile(data.user.id);
      }
    } catch (error) {
      console.error("Erro na verificação OTP:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtpAndCreateProfile = async (
    phone: string,
    otp: string,
    userData: { name: string; typeID: number },
  ) => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: "sms",
      });

      if (error) throw error;

      if (!data.user) throw new Error("Usuário não autenticado");

      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          display_name: userData.name,
          name: userData.name,
        },
      });

      if (updateError) {
        console.warn("Erro ao atualizar metadata do usuário:", updateError);
      }

      const newUser = await userService.registerUser({
        name: userData.name,
        phone: phone,
        typeID: userData.typeID,
      });

      setUser(newUser);
      await setItemAsync(USER_PROFILE_KEY, JSON.stringify(newUser));
    } catch (error) {
      console.error("Erro ao verificar OTP e criar perfil:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, phone: string, typeID: number) => {
    try {
      setIsLoading(true);

      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          channel: "sms",
          shouldCreateUser: true,
          data: {
            display_name: name,
            name: name,
            type_id: typeID,
          },
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Erro no logout:", error);
      throw error;
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!user) return;

      const sanitizedData = sanitizeUserData(userData);
      const updatedUser = { ...user, ...sanitizedData };

      setUser(updatedUser);
      await setItemAsync(USER_PROFILE_KEY, JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      if (!session?.user) return;

      const userProfile = await userService.get();

      if (userProfile) {
        setUser(userProfile);
        await setItemAsync(USER_PROFILE_KEY, JSON.stringify(userProfile));
      }
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
      throw error;
    }
  };

  const sanitizeUserData = (data: Partial<User>): Partial<User> => {
    const sanitized = { ...data };

    if (sanitized.name) {
      sanitized.name = sanitized.name.replace(/<[^>]*>/g, "").trim();
    }

    if (sanitized.nickname) {
      sanitized.nickname = sanitized.nickname.replace(/<[^>]*>/g, "").trim();
    }

    if (sanitized.address) {
      sanitized.address = sanitized.address.replace(/<[^>]*>/g, "").trim();
    }

    return sanitized;
  };

  const value: UserContextData = {
    user,
    session,
    isLoading,
    isAuthenticated,
    isWorker,
    isCustomer,
    loginWithOtp,
    verifyOtp,
    verifyOtpAndCreateProfile,
    register,
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
