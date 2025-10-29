import z from "zod";

import {
  type BaseApiResponse,
  type BaseEntity,
  withApiTransform,
} from "./base";

// ========== DOMAIN INTERFACES ==========

export interface ServiceCategory extends BaseEntity {
  name: string;
  description?: string;
  isActive: boolean;
}

export interface EstablishmentService extends BaseEntity {
  establishmentID: number;
  basePrice: number;
  categoryID: number;
  name: string;
  description?: string;
  duration: number;
  categoryName?: string;
  isActive: boolean;
}

export interface EstablishmentServiceWithDetails extends EstablishmentService {
  workers: WorkerEstablishmentServiceWithDetails[];
}

export interface WorkerEstablishmentService extends BaseEntity {
  establishmentServiceID: number;
  customPrice?: number;
  isActive: boolean;
}

export interface WorkerEstablishmentServiceWithDetails
  extends WorkerEstablishmentService {
  workerUUID: string;
  workerName: string;
  workerNickname?: string;
  workerPhotoURL?: string;
  workerPhone: string;
  serviceName: string;
  serviceDescription?: string;
  basePrice: number;
  duration: number;
}

export type PartialEstablishmentService = Pick<
  EstablishmentService,
  "id" | "establishmentID" | "categoryID"
>;

// ========== API RESPONSE INTERFACES ==========

export interface ServiceCategoryResponseAPI extends BaseApiResponse {
  name: string;
  description?: string;
  is_active: boolean;
}

export interface EstablishmentServiceResponseAPI extends BaseApiResponse {
  establishment_id: number;
  category_id: number;
  name: string;
  description?: string;
  base_price: number;
  duration_minutes: number;
  category_name?: string;
  is_active: boolean;
}

export interface EstablishmentServiceWithDetailsResponseAPI
  extends EstablishmentServiceResponseAPI {
  workers: WorkerEstablishmentServiceWithDetailsResponseAPI[];
}

export interface WorkerEstablishmentServiceResponseAPI extends BaseApiResponse {
  establishment_service_id: number;
  custom_price?: number;
  is_active: boolean;
}

export interface WorkerEstablishmentServiceWithDetailsResponseAPI
  extends WorkerEstablishmentServiceResponseAPI {
  worker_uuid: string;
  worker_name: string;
  worker_nickname?: string;
  worker_photo_url?: string;
  worker_phone: string;

  service_name: string;
  service_description?: string;
  base_price: number;
  duration_minutes: number;
}

export type PartialEstablishmentServiceResponseAPI = Pick<
  EstablishmentServiceResponseAPI,
  "id" | "category_id" | "establishment_id"
>;

// ========== REQUEST INTERFACES ==========

export interface CreateEstablishmentServiceRequest {
  categoryID: number;
  name: string;
  description?: string;
  basePrice: number;
  duration: number;
}

export interface UpdateEstablishmentServiceRequest {
  categoryID?: number;
  name?: string;
  description?: string;
  basePrice?: number;
  duration?: number;
  isActive?: boolean;
}

export interface CreateWorkerEstablishmentServiceRequest {
  workerUUID: string;
  establishmentServiceID: number;
  customPrice?: number;
}

// ========== VALIDATION SCHEMAS ==========

export const establishmentServiceSchema = z.object({
  categoryID: z.number(),
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  basePrice: z.number().min(1, "O preço deve ser maior que zero"),
  duration: z.number().positive("A duração deve ser positiva"),
});

export type EstablishmentServiceFormData = z.infer<
  typeof establishmentServiceSchema
>;

export const workerEstablishmentServiceSchema = z.object({
  workerUUID: z.string().min(1, "O profissional é obrigatório"),
  customPrice: z.number().min(1, "O preço deve ser maior que zero").optional(),
});

export type WorkerEstablishmentServiceFormData = z.infer<
  typeof workerEstablishmentServiceSchema
>;

// ========== MAPPERS/TRANSFORMERS ==========

export const mapServiceCategoryFromApi = withApiTransform<
  ServiceCategoryResponseAPI,
  ServiceCategory
>((apiResponse) => ({
  name: apiResponse.name,
  description: apiResponse.description,
  isActive: apiResponse.is_active,
}));

export const mapEstablishmentServiceFromApi = withApiTransform<
  EstablishmentServiceResponseAPI,
  EstablishmentService
>((apiResponse) => ({
  establishmentID: apiResponse.establishment_id,
  categoryID: apiResponse.category_id,
  description: apiResponse.description,
  name: apiResponse.name,
  basePrice: apiResponse.base_price,
  duration: apiResponse.duration_minutes,
  categoryName: apiResponse.category_name,
  isActive: apiResponse.is_active,
}));

export const mapEstablishmentServiceWithDetailsFromApi = withApiTransform<
  EstablishmentServiceWithDetailsResponseAPI,
  EstablishmentServiceWithDetails
>((apiResponse) => ({
  ...mapEstablishmentServiceFromApi(apiResponse),
  workers: apiResponse.workers.map(
    mapWorkerEstablishmentServiceWithDetailsFromApi
  ),
}));

export const mapWorkerEstablishmentServiceFromApi = withApiTransform<
  WorkerEstablishmentServiceResponseAPI,
  WorkerEstablishmentService
>((apiResponse) => ({
  establishmentServiceID: apiResponse.establishment_service_id,
  customPrice: apiResponse.custom_price,
  isActive: apiResponse.is_active,
}));

export const mapWorkerEstablishmentServiceWithDetailsFromApi = withApiTransform<
  WorkerEstablishmentServiceWithDetailsResponseAPI,
  WorkerEstablishmentServiceWithDetails
>((apiResponse) => ({
  ...mapWorkerEstablishmentServiceFromApi(apiResponse),
  workerUUID: apiResponse.worker_uuid,
  workerName: apiResponse.worker_name,
  workerNickname: apiResponse.worker_nickname,
  workerPhotoURL: apiResponse.worker_photo_url,
  workerPhone: apiResponse.worker_phone,
  serviceName: apiResponse.service_name,
  serviceDescription: apiResponse.service_description,
  basePrice: apiResponse.base_price,
  duration: apiResponse.duration_minutes,
}));
