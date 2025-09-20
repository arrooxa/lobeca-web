import z from "zod";
import {
  withApiTransform,
  type BaseApiResponse,
  type BaseEntity,
} from "./base";
import {
  isCardExpired,
  validateCardholderName,
  validateCardNumber,
} from "@/utils/pagarme";

// ========== DOMAIN INTERFACES ==========

export interface SubscriptionPlan extends BaseEntity {
  name: string;
  externalPlanId?: string;
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
  external_plan_id?: string;
  price: number;
  max_workers?: number;
  trial_days: number;
  is_active: boolean;
  created_at: string;
}

export interface PartialSubscriptionResponseAPI {
  establishment_id: number;
  plan_id: number;
  checkout_url: string;
  status: string;
}

// ========== REQUEST INTERFACES ==========

export interface SubscriptionRequest {
  establishment_id: number;
  plan_id: number;
  card_token: string;
  cpf: string;
}

// ========== VALIDATION SCHEMAS ==========

export const paymentFormSchema = z.object({
  cardNumber: z
    .string()
    .min(1, "Número do cartão é obrigatório")
    .refine((value) => validateCardNumber(value), "Número do cartão inválido"),

  cardholderName: z
    .string()
    .min(1, "Nome do titular é obrigatório")
    .refine(
      (value) => validateCardholderName(value),
      "Nome deve conter nome e sobrenome"
    ),

  expiryDate: z
    .string()
    .min(1, "Data de validade é obrigatória")
    .regex(/^\d{2}\/\d{2}$/, "Formato deve ser MM/AA")
    .refine((value) => {
      const [month, year] = value.split("/");
      return !isCardExpired(month, year);
    }, "Cartão expirado ou data inválida"),

  cvv: z
    .string()
    .min(3, "CVV deve ter pelo menos 3 dígitos")
    .max(4, "CVV deve ter no máximo 4 dígitos")
    .regex(/^\d+$/, "CVV deve conter apenas números"),

  cpf: z
    .string()
    .min(11, "CPF deve ter 11 dígitos")
    .max(11, "CPF deve ter 11 dígitos")
    .regex(/^\d+$/, "CPF deve conter apenas números"),
});

export const checkoutParamsSchema = z.object({
  plan: z.string().transform(Number).pipe(z.number().positive()),
  establishment: z.string().transform(Number).pipe(z.number().positive()),
});

export type PaymentFormData = z.infer<typeof paymentFormSchema>;

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
    trialDays: apiResponse.trial_days,
    isActive: apiResponse.is_active,
    createdAt: new Date(apiResponse.created_at),
  })
);
