// ========== BASE INTERFACES & GENERIC TYPES ==========

export interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface BaseEntityWithUUID {
  uuid: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface BaseApiResponse {
  id: number;
  created_at: string;
  updated_at?: string;
}

export interface BaseApiResponseWithUUID {
  uuid: string;
  created_at: string;
  updated_at?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface BaseTimeSlot {
  startTime: string;
  endTime: string;
}

export type WithoutTimestamps<T extends BaseEntity> = Omit<T, keyof BaseEntity>;

export type CreateRequest<T extends BaseEntity | BaseEntityWithUUID> = Omit<
  T,
  "id" | "createdAt" | "updatedAt" | "uuid" | "isActive"
>;

// ========== UTILITY FUNCTIONS ==========

/**
 * Parse timestamp ISO8601 to Date
 */
export const parseDate = (isoString: string): Date => new Date(isoString);

/**
 * Parse API timestamps
 */
export const parseTimestamps = (apiResponse: {
  created_at: string;
  updated_at?: string;
}): Pick<BaseEntity, "createdAt" | "updatedAt"> => ({
  createdAt: parseDate(apiResponse.created_at),
  updatedAt: apiResponse.updated_at
    ? parseDate(apiResponse.updated_at)
    : undefined,
});

/**
 * Parse timestamps with UUID
 */
export const parseTimestampsWithUUID = (apiResponse: {
  uuid: string;
  created_at: string;
  updated_at?: string;
}): Pick<BaseEntityWithUUID, "uuid" | "createdAt" | "updatedAt"> => ({
  uuid: apiResponse.uuid,
  ...parseTimestamps(apiResponse),
});

/**
 * Format time from ISO8601 to HH:MM
 */
export const formatTimeFromISO8601 = (isoString: string): string => {
  const date = new Date(isoString);
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

/**
 * Higher-order function to transform API Responses
 */
export const withApiTransform =
  <TApi extends BaseApiResponse, TDomain extends BaseEntity>(
    transformer: (api: TApi) => WithoutTimestamps<TDomain>
  ) =>
  (apiResponse: TApi): TDomain =>
    ({
      id: apiResponse.id,
      ...parseTimestamps(apiResponse),
      ...transformer(apiResponse),
    } as TDomain);

/**
 * Higher-order function to transform API Responses with UUID
 */
export const withApiTransformUUID =
  <TApi extends BaseApiResponseWithUUID, TDomain extends BaseEntityWithUUID>(
    transformer: (api: TApi) => Omit<TDomain, keyof BaseEntityWithUUID>
  ) =>
  (apiResponse: TApi): TDomain =>
    ({
      ...parseTimestampsWithUUID(apiResponse),
      ...transformer(apiResponse),
    } as TDomain);
