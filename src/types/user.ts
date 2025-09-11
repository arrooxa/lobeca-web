import z from "zod";

import type {
  BaseEntityWithUUID,
  BaseApiResponseWithUUID,
  Location,
} from "./base";
import { withApiTransformUUID } from "./base";

// ========== DOMAIN INTERFACES ==========

export interface User extends BaseEntityWithUUID {
  supabaseID: string;
  name: string;
  phone: string;
  typeID: number;
  nickname?: string;
  address?: string;
  location?: Location;
  photoURL?: string;
  isActive: boolean;
  role?: string;
  establishmentID?: number;
  recommendations: number;
}

// ========== VALIDATION SCHEMAS ==========

export const loginSchema = z.object({
  phone: z
    .string()
    .min(14, "Telefone é obrigatório")
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Formato de telefone inválido"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const codeSchema = z.object({
  code: z
    .string()
    .min(6, "Código é obrigatório")
    .regex(/^\d{6}$/, "Formato de código inválido"),
});

export type CodeFormData = z.infer<typeof codeSchema>;

// ========== API RESPONSE INTERFACES ==========

export interface UserResponseAPI extends BaseApiResponseWithUUID {
  supabase_id: string;
  name: string;
  phone: string;
  type_id: number;
  nickname?: string;
  address?: string;
  location?: Location;
  photo_url?: string;
  is_active: boolean;
  establishment_id?: number;
  role?: string;
  recommendations: number;
}

// ========== REQUEST INTERFACES ==========

// ========== MAPPERS/TRANSFORMERS ==========

export const mapUserFromApi = withApiTransformUUID<UserResponseAPI, User>(
  (apiResponse) => ({
    supabaseID: apiResponse.supabase_id,
    name: apiResponse.name,
    phone: apiResponse.phone,
    typeID: apiResponse.type_id,
    nickname: apiResponse.nickname,
    address: apiResponse.address,
    location: apiResponse.location,
    photoURL: apiResponse.photo_url,
    isActive: apiResponse.is_active,
    role: apiResponse.role,
    recommendations: apiResponse.recommendations,
    establishmentID: apiResponse.establishment_id,
  })
);
