import z from "zod";
import {
  withApiTransform,
  type BaseApiResponse,
  type BaseEntity,
  type CreateRequest,
} from "./base";

// ========== DOMAIN INTERFACES ==========

export interface ServiceCategory extends BaseEntity {
  name: string;
  description?: string;
  isActive: boolean;
}

export interface WorkerService extends BaseEntity {
  workerUUID: string;
  categoryID: number;
  description?: string;
  name: string;
  price: number;
  duration: number;
  categoryName?: string;
  isActive: boolean;
}

export type PartialWorkerService = Pick<
  WorkerService,
  "id" | "workerUUID" | "categoryID"
>;

// ========== API RESPONSE INTERFACES ==========

export interface ServiceCategoryResponseAPI extends BaseApiResponse {
  name: string;
  description?: string;
  is_active: boolean;
}

export interface WorkerServiceResponseAPI extends BaseApiResponse {
  worker_uuid: string;
  category_id: number;
  name: string;
  description?: string;
  price: number;
  duration_minutes: number;
  category_name?: string;
  is_active: boolean;
}

export type PartialWorkerServiceResponseAPI = Pick<
  WorkerServiceResponseAPI,
  "id" | "category_id" | "worker_uuid"
>;

// ========== REQUEST INTERFACES ==========

export type CreateServiceCategoryRequest = CreateRequest<ServiceCategory>;

export interface CreateWorkerServiceRequest {
  categoryID: number;
  description?: string;
  name: string;
  price: number;
  duration: number;
  isActive?: boolean;
}

export interface UpdateWorkerServiceRequest {
  categoryID?: number;
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
}

// ========== VALIDATION SCHEMAS ==========

export const workerServiceSchema = z.object({
  categoryID: z.number(),
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  price: z.number().min(1, "O preço deve ser maior que zero"),
  duration: z.number().positive("A duração deve ser positiva"),
});

export type WorkerServiceFormData = z.infer<typeof workerServiceSchema>;

// ========== MAPPERS/TRANSFORMERS ==========

export const mapServiceCategoryFromApi = withApiTransform<
  ServiceCategoryResponseAPI,
  ServiceCategory
>((apiResponse) => ({
  name: apiResponse.name,
  description: apiResponse.description,
  isActive: apiResponse.is_active,
}));

export const mapWorkerServiceFromApi = withApiTransform<
  WorkerServiceResponseAPI,
  WorkerService
>((apiResponse) => ({
  workerUUID: apiResponse.worker_uuid,
  categoryID: apiResponse.category_id,
  description: apiResponse.description,
  name: apiResponse.name,
  price: apiResponse.price,
  duration: apiResponse.duration_minutes,
  categoryName: apiResponse.category_name,
  isActive: apiResponse.is_active,
}));
