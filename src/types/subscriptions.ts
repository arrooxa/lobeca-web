import z from "zod";
import {
  withApiTransform,
  type BaseApiResponse,
  type BaseEntity,
} from "./base";

// ========== DOMAIN INTERFACES ==========

export interface SubscriptionPlan extends BaseEntity {
  name: string;
  externalPlanId?: string;
  description: string;
  price: number;
  maxWorkers?: number;
  billingInterval: "monthly" | "annual";
  isActive: boolean;
  hasPublicStorefront: boolean;
  createdAt: Date;
}

// ========== API RESPONSE INTERFACES ==========

export interface SubscriptionPlanResponseAPI extends BaseApiResponse {
  name: string;
  description: string;
  external_plan_id?: string;
  price: number;
  max_workers?: number;
  billing_interval: "monthly" | "annual";
  is_active: boolean;
  has_public_storefront: boolean;
  created_at: string;
}

export interface PartialSubscriptionResponseAPI {
  establishment_id: number;
  plan_id: number;
  status: string;
}

export interface CreateCheckoutSessionResponseAPI {
  session_id: string;
  session_url: string;
}

// ========== REQUEST INTERFACES ==========

export interface CreateCheckoutSessionRequest {
  establishmentUUID: string;
  planID: number;
  successURL: string;
  cancelURL: string;
}

// ========== VALIDATION SCHEMAS ==========

export const checkoutParamsSchema = z.object({
  plan: z.string().transform(Number).pipe(z.number().positive()),
  establishment: z.string().uuid("UUID inválido"),
});

// ========== MAPPERS/TRANSFORMERS ==========

export const mapSubscriptionPlanFromApi = withApiTransform<
  SubscriptionPlanResponseAPI,
  SubscriptionPlan
>(
  (apiResponse): SubscriptionPlan => ({
    id: apiResponse.id,
    name: apiResponse.name,
    externalPlanId: apiResponse.external_plan_id,
    description: apiResponse.description,
    price: apiResponse.price,
    maxWorkers: apiResponse.max_workers,
    billingInterval: apiResponse.billing_interval,
    isActive: apiResponse.is_active,
    hasPublicStorefront: apiResponse.has_public_storefront,
    createdAt: new Date(apiResponse.created_at),
  })
);
