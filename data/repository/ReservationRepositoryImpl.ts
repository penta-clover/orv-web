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
      throw new Error(
        `[API Error] ReservationRepositoryImpl.reserveInterview\n` +
        `Headers:\n` +
        `  - Authorization: ${this.storage.getAuthToken()}\n` +
        `Parameters:\n` +
        `  - storyboardId: ${storyboardId}\n` +
        `  - scheduledAt: ${scheduledAt}\n` +
        `Response:\n` +
        `  - Status: ${result.statusCode}\n` +
        `  - Message: ${result.message}`
      );
    }

    return result.data;
  }

  async reserveInstantInterview(
    storyboardId: string
  ): Promise<Reservation> {
    const result = await this.api.post<Reservation>(
      "/reservation/interview?startNow=true",
      {
        storyboardId: storyboardId,
      },
      {
        Authorization: `Bearer ${this.storage.getAuthToken()}`,
      }
    );

    if (result.statusCode !== "201" || result.data === null) {
      throw new Error(
        `[API Error] ReservationRepositoryImpl.reserveInstantInterview\n` +
        `Headers:\n` +
        `  - Authorization: ${this.storage.getAuthToken()}\n` +
        `Parameters:\n` +
        `  - storyboardId: ${storyboardId}\n` +
        `Response:\n` +
        `  - Status: ${result.statusCode}\n` +
        `  - Message: ${result.message}`
      );
    }

    return result.data;
  }


  async getReservation(reservationId: string): Promise<Reservation | null> {
    const result = await this.api.get<Reservation>(
      `/reservation/interview/${reservationId}`,
      {
        Authorization: `Bearer ${this.storage.getAuthToken()}`,
      }
    );

    if (result.statusCode !== "200") {
      throw new Error(
        `[API Error] ReservationRepositoryImpl.getReservation\n` +
        `Headers:\n` +
        `  - Authorization: ${this.storage.getAuthToken()}\n` +
        `Parameters:\n` +
        `  - reservationId: ${reservationId}\n` +
        `Response:\n` +
        `  - Status: ${result.statusCode}\n` +
        `  - Message: ${result.message}`
      );
    }

    return result.data;
  }

  async getForwardReservations(): Promise<Reservation[] | null> {
    const result = await this.api.get<Reservation[]>("/reservation/interview/forward", {
      Authorization: `Bearer ${this.storage.getAuthToken()}`,
    });

    if (result.statusCode !== "200") {
      throw new Error(
        `[API Error] ReservationRepositoryImpl.getForwardReservations\n` +
        `Headers:\n` +
        `  - Authorization: ${this.storage.getAuthToken()}\n` +
        `Response:\n` +
        `  - Status: ${result.statusCode}\n` +
        `  - Message: ${result.message}`
      );
    }

    return result.data;
  }

  async getForwardReservationsAfter(from: Date): Promise<Reservation[] | null> {
    const result = await this.api.get<Reservation[]>(`/reservation/interview/forward?from=${from.toISOString()}`, {
      Authorization: `Bearer ${this.storage.getAuthToken()}`,
    });

    if (result.statusCode !== "200") {
      throw new Error(
        `[API Error] ReservationRepositoryImpl.getForwardReservationsAfter\n` +
        `Headers:\n` +
        `  - Authorization: ${this.storage.getAuthToken()}\n` +
        `Parameters:\n` +
        `  - from: ${from}\n` +
        `Response:\n` +
        `  - Status: ${result.statusCode}\n` +
        `  - Message: ${result.message}`
      );
    }

    return result.data;
  }

  async changeInterviewReservationStatusAsDone(reservationId: string): Promise<boolean> {
    const result = await this.api.patch<void>(
      `/reservation/interview/${reservationId}/done`,
      {},
      {
        Authorization: `Bearer ${this.storage.getAuthToken()}`,
      }
    );

    if (result.statusCode !== "200") {
      throw new Error(
        `[API Error] ReservationRepositoryImpl.changeInterviewReservationStatusAsDone\n` +
        `Headers:\n` +
        `  - Authorization: ${this.storage.getAuthToken()}\n` +
        `Parameters:\n` +
        `  - reservationId: ${reservationId}\n` +
        `Response:\n` +
        `  - Status: ${result.statusCode}\n` +
        `  - Message: ${result.message}`
      );
    }
    return true;
  }

  async reserveVideoRecap(
    videoId: string,
    scheduledAt: Date
  ): Promise<RecapReservation> {
    const result = await this.api.post<RecapReservation>(
      "/reservation/recap/video",
      {
        videoId: videoId,
        scheduledAt: scheduledAt,
      },
      {
        Authorization: `Bearer ${this.storage.getAuthToken()}`,
      }
    );

    if (result.statusCode !== "201" || result.data === null) {
      throw new Error(
        `[API Error] ReservationRepositoryImpl.reserveVideoRecap\n` +
        `Headers:\n` +
        `  - Authorization: ${this.storage.getAuthToken()}\n` +
        `Parameters:\n` +
        `  - videoId: ${videoId}\n` +
        `  - scheduledAt: ${scheduledAt}\n` +
        `Response:\n` +
        `  - Status: ${result.statusCode}\n` +
        `  - Message: ${result.message}`
      );
    }

    return result.data;
  }
}
