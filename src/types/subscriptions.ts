import {
  withApiTransform,
  type BaseApiResponse,
  type BaseEntity,
} from "./base";

// ========== DOMAIN INTERFACES ==========

export interface SubscriptionPlan extends BaseEntity {
  name: string;
  mercadoPagoPlanId?: string;
  description: string;
  price: number;
  maxWorkers?: number;
  trialDays: number;
  isActive: boolean;
  createdAt: Date;
}

// ========== API RESPONSE INTERFACES ==========

export interface SubscriptionPlanResponseAPI extends BaseApiResponse {
  name: string;
  description: string;
  mercado_pago_plan_id?: string;
  price: number;
  max_workers?: number;
  trial_days: number;
  is_active: boolean;
  created_at: string;
}

export interface CreateSubscriptionResponse {
  establishment_id: number;
  plan_id: number;
  checkout_url: string;
  status: string;
}

// ========== REQUEST INTERFACES ==========

// ========== MAPPERS/TRANSFORMERS ==========

export const mapSubscriptionPlanFromApi = withApiTransform<
  SubscriptionPlanResponseAPI,
  SubscriptionPlan
>(
  (apiResponse): SubscriptionPlan => ({
    id: apiResponse.id,
    name: apiResponse.name,
    mercadoPagoPlanId: apiResponse.mercado_pago_plan_id,
    description: apiResponse.description,
    price: apiResponse.price,
    maxWorkers: apiResponse.max_workers,
    trialDays: apiResponse.trial_days,
    isActive: apiResponse.is_active,
    createdAt: new Date(apiResponse.created_at),
  })
);
