import {
  type BaseApiResponse,
  type BaseEntity,
  type BaseTimeSlot,
  type CreateRequest,
  formatTimeFromISO8601,
  parseTimestamps,
  withApiTransform,
} from "./base";

// ========== DOMAIN INTERFACES ==========

export interface UserWeeklySchedule extends BaseEntity {
  userUUID: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface UserScheduleBreak extends BaseEntity {
  weeklyScheduleID: number;
  startTime: string;
  endTime: string;
}

export interface UserWeeklyScheduleAndBreaks extends UserWeeklySchedule {
  breaks: UserScheduleBreak[];
}

export interface TimeSlot extends BaseTimeSlot {}

export interface WorkingHours extends BaseTimeSlot {
  isActive: boolean;
  breaks: UserScheduleBreak[];
}

export interface UnavailableSlot extends BaseTimeSlot {
  type: "break" | "appointment";
  reason?: string;
}

export interface GetUserAvailability {
  userUUID: string;
  date: string;
  dayOfWeek: number;
  timezone: string; // IANA timezone identifier (e.g., "America/Sao_Paulo")
  workingHours: WorkingHours | null;
  availableSlots: TimeSlot[];
  unavailableSlots: UnavailableSlot[];
}

// ========== API RESPONSE INTERFACES ==========

export interface UserScheduleBreakResponse extends BaseApiResponse {
  weekly_schedule_id: number;
  start_time: string;
  end_time: string;
}

export interface GetUserWeeklyScheduleResponse extends BaseApiResponse {
  user_uuid: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  breaks: UserScheduleBreakResponse[];
}

export interface DayScheduleResponse extends BaseApiResponse {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  breaks: UserScheduleBreakResponse[];
}

export interface GetAllWorkerSchedulesResponse {
  user_uuid: string;
  schedules: DayScheduleResponse[];
}

export interface TimeSlotResponseAPI {
  start_time: string;
  end_time: string;
}

export interface WorkingHoursResponseAPI {
  start_time: string;
  end_time: string;
  is_active: boolean;
  breaks: UserScheduleBreak[];
}

export interface UnavailableSlotResponseAPI {
  start_time: string;
  end_time: string;
  type: "break" | "appointment";
  reason?: string;
}

export interface GetUserAvailabilityResponseAPI {
  user_uuid: string;
  date: string;
  day_of_week: number;
  timezone: string; // IANA timezone identifier (e.g., "America/Sao_Paulo")
  working_hours: WorkingHoursResponseAPI | null;
  available_slots: TimeSlotResponseAPI[];
  unavailable_slots: UnavailableSlotResponseAPI[];
}

// ========== REQUEST INTERFACES ==========

export interface UserScheduleBreakRequest {
  startTime: string;
  endTime: string;
}

export type CreateUserWeeklyScheduleRequest = CreateRequest<UserWeeklySchedule>;

export interface InsertWorkerScheduleRequest {
  startTime: string;
  endTime: string;
  isActive: boolean;
  breaks: UserScheduleBreakRequest[];
}

// Alias for clarity - this is actually an upsert operation
export type UpsertWorkerScheduleRequest = InsertWorkerScheduleRequest;

export interface UpdateScheduleRequest {
  id: number;
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  isActive?: boolean;
}

export interface UpdateScheduleBreakRequest {
  id: number;
  weeklyScheduleID?: number;
  startTime?: string;
  endTime?: string;
}

// ========== MAPPERS/TRANSFORMERS ==========

export const mapBreakFromApi = withApiTransform<
  UserScheduleBreakResponse,
  UserScheduleBreak
>((breakItem) => ({
  weeklyScheduleID: breakItem.weekly_schedule_id,
  startTime: formatTimeFromISO8601(breakItem.start_time),
  endTime: formatTimeFromISO8601(breakItem.end_time),
}));

export const mapScheduleFromApi = (
  apiResponse: GetUserWeeklyScheduleResponse
): UserWeeklyScheduleAndBreaks => ({
  id: apiResponse.id,
  userUUID: apiResponse.user_uuid,
  dayOfWeek: apiResponse.day_of_week,
  startTime: formatTimeFromISO8601(apiResponse.start_time),
  endTime: formatTimeFromISO8601(apiResponse.end_time),
  isActive: apiResponse.is_active,
  ...parseTimestamps(apiResponse),
  breaks: apiResponse.breaks.map(mapBreakFromApi),
});

export const mapDayScheduleFromApi = (
  apiResponse: DayScheduleResponse
): UserWeeklyScheduleAndBreaks => ({
  id: apiResponse.id,
  userUUID: "", // Will be set from parent
  dayOfWeek: apiResponse.day_of_week,
  startTime: formatTimeFromISO8601(apiResponse.start_time),
  endTime: formatTimeFromISO8601(apiResponse.end_time),
  isActive: apiResponse.is_active,
  ...parseTimestamps(apiResponse),
  breaks: apiResponse.breaks.map(mapBreakFromApi),
});

export const mapAllWorkerSchedulesFromApi = (
  apiResponse: GetAllWorkerSchedulesResponse
): Record<number, UserWeeklyScheduleAndBreaks> => {
  const schedulesMap: Record<number, UserWeeklyScheduleAndBreaks> = {};

  apiResponse.schedules.forEach((schedule) => {
    const mapped = mapDayScheduleFromApi(schedule);
    mapped.userUUID = apiResponse.user_uuid;
    schedulesMap[schedule.day_of_week] = mapped;
  });

  return schedulesMap;
};

export const mapWorkingHoursFromApi = (
  workingHours: WorkingHoursResponseAPI
): WorkingHours => ({
  startTime: workingHours.start_time,
  endTime: workingHours.end_time,
  isActive: workingHours.is_active,
  breaks: workingHours.breaks.map((breakItem) => ({
    id: breakItem.id,
    weeklyScheduleID: breakItem.weeklyScheduleID,
    startTime: breakItem.startTime,
    endTime: breakItem.endTime,
    createdAt: breakItem.createdAt,
    updatedAt: breakItem.updatedAt,
  })),
});

export const mapUnavailableSlots = (
  slots: UnavailableSlotResponseAPI[]
): UnavailableSlot[] =>
  slots.map((slot) => ({
    startTime: slot.start_time,
    endTime: slot.end_time,
    type: slot.type,
    reason: slot.reason,
  }));

export const mapTimeSlots = (
  apiSlots: Array<{ start_time: string; end_time: string }>
): BaseTimeSlot[] =>
  apiSlots.map((slot) => ({
    startTime: slot.start_time,
    endTime: slot.end_time,
  }));

export const mapUserAvailabilityFromApi = (
  response: GetUserAvailabilityResponseAPI
): GetUserAvailability => ({
  userUUID: response.user_uuid,
  date: response.date,
  dayOfWeek: response.day_of_week,
  timezone: response.timezone,
  workingHours: response.working_hours
    ? mapWorkingHoursFromApi(response.working_hours)
    : null,
  availableSlots: mapTimeSlots(response.available_slots),
  unavailableSlots: mapUnavailableSlots(response.unavailable_slots),
});
