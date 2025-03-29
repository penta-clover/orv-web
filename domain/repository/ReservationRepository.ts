import { RecapReservation } from "../model/RecapReservation";
import { Reservation } from "../model/Reservation";

export interface ReservationRepository {
  reserveInterview(storyboardId: string, scheduledAt: Date): Promise<Reservation>;
  getForwardReservations(): Promise<Reservation[] | null>;
  getForwardReservationsAfter(from: Date): Promise<Reservation[] | null>;
  changeInterviewReservationStatusAsDone(reservationId: string): Promise<boolean>;
  reserveVideoRecap(videoId: string, scheduledAt: Date): Promise<RecapReservation>;
}