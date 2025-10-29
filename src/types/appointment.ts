import {
  type BaseApiResponseWithUUID,
  type BaseEntityWithUUID,
  type CreateRequest,
  withApiTransformUUID,
} from "./base";

// ========== DOMAIN INTERFACES ==========

export interface Appointment extends BaseEntityWithUUID {
  workerEstablishmentServiceID: number;
  customerUUID: string;
  scheduledAt: Date;
  paidAt?: Date;
  isActive: boolean;
  duration?: number;
}

export interface AppointmentWithDetails extends Appointment {
  workerUUID: string;
  workerName: string;
  workerPhone: string;
  workerPhotoURL?: string;

  customerName: string;
  customerPhone: string;
  customerPhotoURL?: string;
  customerIdentification?: string;

  establishmentID: number;
  establishmentUUID: string;
  establishmentName: string;
  establishmentAddress: string;
  establishmentPhotoURL?: string;

  serviceName: string;
  servicePrice: number;
}

// ========== API RESPONSE INTERFACES ==========

export interface AppointmentResponseAPI extends BaseApiResponseWithUUID {
  worker_establishment_service_id: number;
  customer_uuid: string;
  scheduled_at: string;
  paid_at?: string;
  is_active: boolean;
  duration?: number;
}

export interface AppointmentWithDetailsResponseAPI
  extends AppointmentResponseAPI {
  worker_uuid: string;
  worker_name: string;
  worker_phone: string;
  worker_photo_url?: string;

  customer_name: string;
  customer_phone: string;
  customer_photo_url?: string;
  customer_identification?: string; // For custom appointments created by workers

  establishment_id: number;
  establishment_uuid: string;
  establishment_name: string;
  establishment_address: string;
  establishment_photo_url?: string;

  service_name: string;
  service_price: number;
}

export type PartialAppointmentResponseAPI = Pick<
  AppointmentResponseAPI,
  "uuid" | "worker_establishment_service_id" | "customer_uuid" | "scheduled_at"
>;
// ========== REQUEST INTERFACES ==========

export type CreateAppointmentRequest = CreateRequest<Appointment>;

export type CreateAppointmentByWorkerRequest = Omit<
  CreateAppointmentRequest,
  "customerUUID"
> & {
  customerIdentification: string;
};

export interface UpdateAppointmentRequest {
  workerEstablishmentServiceID: number;
  scheduledAt: Date;
  paidAt?: Date;
  isActive?: boolean;
}

// ========== MAPPERS/TRANSFORMERS ==========

export const mapAppointmentFromApi = withApiTransformUUID<
  AppointmentResponseAPI,
  Appointment
>((apiResponse) => ({
  workerEstablishmentServiceID: apiResponse.worker_establishment_service_id,
  customerUUID: apiResponse.customer_uuid,
  scheduledAt: new Date(apiResponse.scheduled_at),
  paidAt: apiResponse.paid_at ? new Date(apiResponse.paid_at) : undefined,
  isActive: apiResponse.is_active,
  duration: apiResponse.duration,
}));

export const mapAppointmentWithDetailsFromApi = withApiTransformUUID<
  AppointmentWithDetailsResponseAPI,
  AppointmentWithDetails
>((apiResponse) => ({
  ...mapAppointmentFromApi(apiResponse),
  workerUUID: apiResponse.worker_uuid,
  workerName: apiResponse.worker_name,
  workerPhone: apiResponse.worker_phone,
  workerPhotoURL: apiResponse.worker_photo_url,

  customerName: apiResponse.customer_name,
  customerPhone: apiResponse.customer_phone,
  customerPhotoURL: apiResponse.customer_photo_url,
  customerIdentification: apiResponse.customer_identification,

  establishmentID: apiResponse.establishment_id,
  establishmentUUID: apiResponse.establishment_uuid,
  establishmentName: apiResponse.establishment_name,
  establishmentAddress: apiResponse.establishment_address,
  establishmentPhotoURL: apiResponse.establishment_photo_url,

  serviceName: apiResponse.service_name,
  servicePrice: apiResponse.service_price,
}));
