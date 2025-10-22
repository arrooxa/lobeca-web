import { type BaseApiResponse } from "./base";

// ========== DOMAIN INTERFACES ==========

export interface UserRecommendation {
  id: number;
  customerUUID: string;
  workerUUID: string;
  comment?: string;
  createdAt: Date;
}

export interface UserRecommendationsWithDetails extends UserRecommendation {
  customerName: string;
  customerPhotoUrl?: string;

  workerName: string;
  workerPhotoUrl?: string;

  establishmentName: string;
}

// ========== API RESPONSE INTERFACES ==========

export interface UserRecommendationResponseAPI extends BaseApiResponse {
  customer_uuid: string;
  worker_uuid: string;
  comment?: string;
}

export interface GetUserRecommendationsResponseAPI
  extends UserRecommendationResponseAPI {
  comment?: string;

  customer_name: string;
  customer_photo_url?: string;

  worker_name: string;
  worker_photo_url?: string;

  establishment_name: string;
}

// ========== MAPPERS/TRANSFORMERS ==========

export const mapUserRecommendationFromApi = (
  apiResponse: UserRecommendationResponseAPI
): UserRecommendation => {
  return {
    id: apiResponse.id,
    customerUUID: apiResponse.customer_uuid,
    workerUUID: apiResponse.worker_uuid,
    createdAt: new Date(apiResponse.created_at),
    comment: apiResponse.comment,
  };
};

export const mapGetUserRecommendationsFromAPI = (
  apiResponse: GetUserRecommendationsResponseAPI
): UserRecommendationsWithDetails => {
  return {
    ...mapUserRecommendationFromApi(apiResponse),

    customerName: apiResponse.customer_name,
    customerPhotoUrl: apiResponse.customer_photo_url,

    workerName: apiResponse.worker_name,
    workerPhotoUrl: apiResponse.worker_photo_url,

    establishmentName: apiResponse.establishment_name,
  };
};
