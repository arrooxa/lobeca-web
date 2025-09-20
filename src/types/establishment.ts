import z from "zod";
import {
  type BaseApiResponse,
  type BaseEntity,
  type CreateRequest,
  type Location,
  withApiTransform,
} from "./base";
import {
  mapWorkerServiceFromApi,
  type WorkerService,
  type WorkerServiceResponseAPI,
} from "./service";
import {
  mapPublicWorkerFromApi,
  type PublicWorker,
  type PublicWorkerResponseAPI,
} from "./user";

// ========== DOMAIN INTERFACES ==========

export type InviteStatus = "pending" | "accepted" | "rejected";

export interface Establishment extends BaseEntity {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  photoURL?: string;
  distanceKm?: number;
  totalRecommendations: number;
}

export interface EstablishmentWithSubscriptions extends Establishment {
  planID: number;
  externalCustomerId?: string;
  externalSubscriptionId?: string;
  status: string;
  trialStartedAt?: Date;
  trialEndsAt?: Date;
  lastPaymentDate?: Date;
  nextBillingDate?: Date;
}

export interface EstablishmentInvite extends BaseEntity {
  establishmentID: number;
  inviterUUID: string;
  inviteeUUID: string;
  status: InviteStatus;
}

export interface EstablishmentInviteWithDetails extends EstablishmentInvite {
  inviteeName: string;
  inviteePhotoURL?: string;

  inviterName: string;
  inviterPhotoURL?: string;

  establishmentName: string;
  establishmentPhotoURL?: string;
  establishmentAddress: string;
}

export interface EstablishmentWithDetails {
  establishment: EstablishmentWithSubscriptions;
  users: PublicWorker[];
  services: WorkerService[];
  invites: EstablishmentInviteWithDetails[];
}

export interface PublicEstablishmentDetails extends Establishment {
  establishment: Establishment;
  users: PublicWorker[];
  services: WorkerService[];
}

// ========== API RESPONSE INTERFACES ==========

export interface EstablishmentResponseAPI extends BaseApiResponse {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  photo_url?: string;
  distance_km?: number;
  total_recommendations: number;
}

export interface EstablishmentWithSubscriptionsResponseAPI
  extends EstablishmentResponseAPI {
  plan_id: number;
  status: string;
  external_customer_id?: string;
  external_subscription_id?: string;
  trial_started_at?: string;
  trial_ends_at?: string;
  subscription_started_at?: string;
  next_billing_date?: string;
}

export interface EstablishmentInviteResponseAPI extends BaseApiResponse {
  establishment_id: number;
  inviter_uuid: string;
  status: InviteStatus;
  invitee_uuid: string;
}

export interface EstablishmentInviteWithDetailsResponseAPI
  extends EstablishmentInviteResponseAPI {
  invitee_name: string;
  invitee_photo_url?: string;
  inviter_name: string;
  inviter_photo_url?: string;
  establishment_name: string;
  establishment_photo_url?: string;
  establishment_address: string;
}

export interface EstablishmentDetailsResponseAPI {
  establishment: EstablishmentWithSubscriptionsResponseAPI;
  users: PublicWorkerResponseAPI[];
  services: WorkerServiceResponseAPI[];
  invites: EstablishmentInviteWithDetailsResponseAPI[];
}

export interface PublicEstablishmentDetailsResponseAPI {
  establishment: EstablishmentResponseAPI;
  users: PublicWorkerResponseAPI[];
  services: WorkerServiceResponseAPI[];
}

// ========== REQUEST INTERFACES ==========

export type CreateEstablishmentRequest = CreateRequest<Establishment>;

export type CreateEstablishmentInviteRequest =
  CreateRequest<EstablishmentInvite>;

export type UpdateInviteRequest = {
  id: number;
  status: Omit<InviteStatus, "pending">;
};

export interface UpdateEstablishmentRequest {
  id: number;
  name?: string;
  address?: string;
  location?: Location;
  photoURL?: string;
  rate?: number;
}

export interface GetAllEstablishmentParams {
  limit?: number;
  offset?: number;
  name?: string;
  latitude?: number;
  longitude?: number;
}

// ========== VALIDATION SCHEMAS ==========

export const establishmentSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  address: z.string().min(1, "O endereço é obrigatório"),
  location: z.object({
    latitude: z
      .number()
      .min(-90, "Latitude inválida")
      .max(90, "Latitude inválida"),
    longitude: z
      .number()
      .min(-180, "Longitude inválida")
      .max(180, "Longitude inválida"),
  }),
  image: z.string().optional(),
});

export type EstablishmentFormData = z.infer<typeof establishmentSchema>;

export const establishmentInviteSchema = z.object({
  inviteeUUID: z.string().min(1, "Convidado é obrigatório"),
});

export type EstablishmentInviteFormData = z.infer<
  typeof establishmentInviteSchema
>;
// ========== MAPPERS/TRANSFORMERS ==========

export const mapEstablishmentFromApi = withApiTransform<
  EstablishmentResponseAPI,
  Establishment
>((apiResponse) => ({
  name: apiResponse.name,
  address: apiResponse.address,
  latitude: apiResponse.latitude,
  longitude: apiResponse.longitude,
  photoURL: apiResponse.photo_url,
  distanceKm: apiResponse.distance_km,
  totalRecommendations: apiResponse.total_recommendations,
}));

export const mapEstablishmentWithSubscriptionsFromApi = withApiTransform<
  EstablishmentWithSubscriptionsResponseAPI,
  EstablishmentWithSubscriptions
>((apiResponse) => ({
  ...mapEstablishmentFromApi(apiResponse),
  planID: apiResponse.plan_id,
  status: apiResponse.status,
  externalCustomerId: apiResponse.external_customer_id,
  externalSubscriptionId: apiResponse.external_subscription_id,
  trialStartedAt: apiResponse.trial_started_at
    ? new Date(apiResponse.trial_started_at)
    : undefined,
  trialEndsAt: apiResponse.trial_ends_at
    ? new Date(apiResponse.trial_ends_at)
    : undefined,
  subscriptionStartedAt: apiResponse.subscription_started_at
    ? new Date(apiResponse.subscription_started_at)
    : undefined,
  nextBillingDate: apiResponse.next_billing_date
    ? new Date(apiResponse.next_billing_date)
    : undefined,
}));

export const mapEstablishmentDetailsFromApi = (
  apiResponse: EstablishmentDetailsResponseAPI
) => ({
  establishment: mapEstablishmentWithSubscriptionsFromApi(
    apiResponse.establishment
  ),
  users: apiResponse.users.map(mapPublicWorkerFromApi),
  services: apiResponse.services.map(mapWorkerServiceFromApi),
  invites: apiResponse.invites.map(mapEstablishmentInviteWithDetailsFromApi),
});

export const mapPublicEstablishmentDetailsFromApi = (
  apiResponse: PublicEstablishmentDetailsResponseAPI
) => ({
  establishment: mapEstablishmentFromApi(apiResponse.establishment),
  users: apiResponse.users.map(mapPublicWorkerFromApi),
  services: apiResponse.services.map(mapWorkerServiceFromApi),
});

export const mapEstablishmentInviteFromApi = withApiTransform<
  EstablishmentInviteResponseAPI,
  EstablishmentInvite
>((apiResponse) => ({
  establishmentID: apiResponse.establishment_id,
  inviterUUID: apiResponse.inviter_uuid,
  inviteeUUID: apiResponse.invitee_uuid,
  status: apiResponse.status,
}));

export const mapEstablishmentInviteWithDetailsFromApi = withApiTransform<
  EstablishmentInviteWithDetailsResponseAPI,
  EstablishmentInviteWithDetails
>((apiResponse) => ({
  ...mapEstablishmentInviteFromApi(apiResponse),
  inviteeName: apiResponse.invitee_name,
  inviteePhotoURL: apiResponse.invitee_photo_url,
  inviterName: apiResponse.inviter_name,
  inviterPhotoURL: apiResponse.inviter_photo_url,
  establishmentName: apiResponse.establishment_name,
  establishmentPhotoURL: apiResponse.establishment_photo_url,
  establishmentAddress: apiResponse.establishment_address,
}));
