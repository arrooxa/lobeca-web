import {
  withApiTransform,
  type BaseApiResponse,
  type BaseEntity,
} from "./base";

// ========== DOMAIN INTERFACES ==========

export interface SubscriptionPlan extends BaseEntity {
  name: string;
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
  price: number;
  max_workers?: number;
  trial_days: number;
  is_active: boolean;
  created_at: string;
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
    description: apiResponse.description,
    price: apiResponse.price,
    maxWorkers: apiResponse.max_workers,
    trialDays: apiResponse.trial_days,
    isActive: apiResponse.is_active,
    createdAt: new Date(apiResponse.created_at),
  })
);
