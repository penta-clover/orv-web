import { Reservation } from "../model/Reservation";

export interface ReservationRepository {
    reserveInterview(storyboardId: string, scheduledAt: Date): Promise<Reservation>;
  }
  