import { ReservationRepository } from "@/domain/repository/ReservationRepository";
import { Api } from "../Api";
import { Storage } from "../Storage";
import { Reservation } from "@/domain/model/Reservation";
import { RecapReservation } from "@/domain/model/RecapReservation";

export class ReservationRepositoryImpl implements ReservationRepository {
  constructor(private api: Api, private storage: Storage) {}

  async reserveInterview(
    storyboardId: string,
    scheduledAt: Date
  ): Promise<Reservation> {
    const result = await this.api.post<Reservation>(
      "/reservation/interview",
      {
        storyboardId: storyboardId,
        reservedAt: scheduledAt,
      },
      {
        Authorization: `Bearer ${this.storage.getAuthToken()}`,
      }
    );

    if (result.statusCode !== "201" || result.data === null) {
      throw new Error(result.message);
    }

    return result.data;
  }

  async getForwardReservations(): Promise<Reservation[] | null> {
    const result = await this.api.get<Reservation[]>("/reservation/interview/forward", {
      Authorization: `Bearer ${this.storage.getAuthToken()}`,
    });

    if (result.statusCode !== "200") {
      throw new Error(result.message);
    }

    return result.data;
  }

  async reserveVideoRecap(
    videoId: string,
    scheduledAt: Date
  ): Promise<RecapReservation> {
    const result = await this.api.post<RecapReservation>(
      "/reservation/recap/video",
      {
        videoId: videoId,
        reservedAt: scheduledAt,
      },
      {
        Authorization: `Bearer ${this.storage.getAuthToken()}`,
      }
    );

    if (result.statusCode !== "201" || result.data === null) {
      throw new Error(result.message);
    }

    return result.data;
  }
}
