import { RecapReservation } from "../model/RecapReservation";
import { Reservation } from "../model/Reservation";

export interface ReservationRepository {
    reserveInterview(storyboardId: string, scheduledAt: Date): Promise<Reservation>;
    getForwardReservations(): Promise<Reservation[] | null>;
    reserveVideoRecap(videoId: string, scheduledAt: Date): Promise<RecapReservation>;
  }
  