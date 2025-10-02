import { z } from "zod";

import {
  type BaseApiResponseWithUUID,
  type BaseEntityWithUUID,
  type CreateRequest,
  type Location,
  withApiTransformUUID,
} from "./base";
import {
  mapWorkerEstablishmentServiceWithDetailsFromApi,
  type WorkerEstablishmentServiceWithDetails,
  type WorkerEstablishmentServiceWithDetailsResponseAPI,
} from "./service";

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

export interface PublicWorker extends BaseEntityWithUUID {
  name: string;
  nickname?: string;
  phone: string;
  photoURL?: string;
  recommendations: number;
  establishmentID: number;
  role: string;
}

export interface PublicWorkerWithDetails extends PublicWorker {
  services: WorkerEstablishmentServiceWithDetails[];
}

// ========== VALIDATION SCHEMAS ==========

export const registerUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  phone: z
    .string()
    .min(14, "Telefone é obrigatório")
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Formato de telefone inválido"),
});

export type RegisterFormData = z.infer<typeof registerUserSchema>;

export const updateUserAddressSchema = z.object({
  address: z.string().min(1, "Endereço é obrigatório"),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
});

export type UpdateUserAddressData = z.infer<typeof updateUserAddressSchema>;

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

export interface PublicWorkerResponseAPI extends BaseApiResponseWithUUID {
  name: string;
  nickname?: string;
  phone: string;
  photo_url?: string;
  recommendations: number;
  establishment_id: number;
  role: string;
}

export interface PublicWorkerWithDetailsResponseAPI
  extends PublicWorkerResponseAPI {
  services: WorkerEstablishmentServiceWithDetailsResponseAPI[];
}

// ========== REQUEST INTERFACES ==========

export type CreateUserRequest = CreateRequest<User>;

export type RegisterUserData = Pick<User, "name" | "phone" | "typeID">;

export interface UpdateUserRequest {
  name?: string;
  phone?: string;
  nickname?: string;
  address?: string;
  location?: Location;
  photoURL?: string;
  isActive?: boolean;
  role?: string;
}

export interface GetWorkersParams {
  limit?: number;
  offset?: number;
  name?: string;
  category?: number;
  has_establishment?: boolean;
}

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

export const mapPublicWorkerFromApi = withApiTransformUUID<
  PublicWorkerResponseAPI,
  PublicWorker
>((apiResponse) => ({
  uuid: apiResponse.uuid,
  name: apiResponse.name,
  nickname: apiResponse.nickname,
  phone: apiResponse.phone,
  photoURL: apiResponse.photo_url,
  recommendations: apiResponse.recommendations,
  establishmentID: apiResponse.establishment_id,
  role: apiResponse.role,
}));

export const mapPublicWorkerWithDetailsFromApi = withApiTransformUUID<
  PublicWorkerWithDetailsResponseAPI,
  PublicWorkerWithDetails
>((apiResponse) => ({
  ...mapPublicWorkerFromApi(apiResponse),
  services: apiResponse.services
    ? apiResponse.services.map(mapWorkerEstablishmentServiceWithDetailsFromApi)
    : [],
}));
