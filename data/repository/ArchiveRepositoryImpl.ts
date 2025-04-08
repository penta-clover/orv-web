import { VideoMetadata } from "@/domain/model/VideoMetadata";
import { ArchiveRepository } from "@/domain/repository/ArchiveRepository";
import { Api } from "../Api";
import { ApiResult } from "../ApiResult";
import { Storage } from "../Storage";
import { Video } from "@/domain/model/Video";

export class ArchiveRepositoryImpl implements ArchiveRepository {
  constructor(private api: Api, private storage: Storage) {}

  async getVideo(videoId: string): Promise<VideoMetadata> {
    const requestPath = `/archive/video/${videoId}`;
    const result: ApiResult<VideoMetadata> = await this.api.get<VideoMetadata>(
      requestPath,
      {
        Authorization: `Bearer ${this.storage.getAuthToken()}`,
      }
    );

    if (result.statusCode !== "200" || result.data === null) {
      throw new Error(
        `[API Error] ArchiveRepositoryImpl.getVideo\n` +
          `Headers:\n` +
          `  - Authorization: ${this.storage.getAuthToken()}\n` +
          `Parameters:\n` +
          `  - videoId: ${videoId}\n` +
          `Response:\n` +
          `  - Status: ${result.statusCode}\n` +
          `  - Message: ${result.message}`
      );
    }
    return result.data;
  }

  async uploadVideo(video: Blob, storyboardId: string): Promise<string> {
    const requestPath = "/archive/recorded-video";
    const formData = new FormData();
    formData.append("video", video, "video");
    formData.append("storyboardId", storyboardId);

    console.log(formData.get("video"));

    const result: ApiResult<string> = await this.api.post<string>(
      requestPath,
      formData,
      { Authorization: `Bearer ${this.storage.getAuthToken()}` }
    );

    if (result.statusCode !== "201" || result.data === null) {
      throw new Error(
        `[API Error] ArchiveRepositoryImpl.uploadVideo\n` +
          `Headers:\n` +
          `  - Authorization: ${this.storage.getAuthToken()}\n` +
          `Parameters:\n` +
          `  - video: ${video}\n` +
          `  - storyboardId: ${storyboardId}\n` +
          `Response:\n` +
          `  - Status: ${result.statusCode}\n` +
          `  - Message: ${result.message}`
      );
    }

    return result.data;
  }

  async renameVideo(videoId: string, title: string): Promise<void> {
    const requestPath = `/archive/video/${videoId}`;
    const result: ApiResult<void> = await this.api.patch<void>(
      requestPath,
      { title: title },
      {
        Authorization: `Bearer ${this.storage.getAuthToken()}`,
      }
    );

    if (result.statusCode !== "200") {
      throw new Error(
        `[API Error] ArchiveRepositoryImpl.renameVideo\n` +
          `Headers:\n` +
          `  - Authorization: ${this.storage.getAuthToken()}\n` +
          `Parameters:\n` +
          `  - videoId: ${videoId}\n` +
          `  - title: ${title}\n` +
          `Response:\n` +
          `  - Status: ${result.statusCode}\n` +
          `  - Message: ${result.message}`
      );
    }
  }

  async updateThumbnail(videoId: string, capturedImage: Blob): Promise<void> {
    const requestPath = `/archive/video/${videoId}/thumbnail`;

    const formData = new FormData();
    formData.append("thumbnail", capturedImage, "thumbnail");

    const result: ApiResult<void> = await this.api.put<void>(
      requestPath,
      formData,
      {
        Authorization: `Bearer ${this.storage.getAuthToken()}`,
      }
    );

    if (result.statusCode !== "200") {
      throw new Error(
        `[API Error] ArchiveRepositoryImpl.updateThumbnail\n` +
          `Headers:\n` +
          `  - Authorization: ${this.storage.getAuthToken()}\n` +
          `Parameters:\n` +
          `  - videoId: ${videoId}\n` +
          `  - capturedImage: ${capturedImage}\n` +
          `Response:\n` +
          `  - Status: ${result.statusCode}\n` +
          `  - Message: ${result.message}`
      );
    }
  }

  async getMyVideos(): Promise<Video[]> {
    const requestPath = `/archive/videos/my`;

    const result: ApiResult<Video[]> = await this.api.get<Video[]>(
      requestPath,
      {
        Authorization: `Bearer ${this.storage.getAuthToken()}`,
      }
    );

    if (result.statusCode !== "200") {
      throw new Error(
        `[API Error] ArchiveRepositoryImpl.getMyVideos\n` +
          `Headers:\n` +
          `  - Authorization: ${this.storage.getAuthToken()}\n` +
          `Response:\n` +
          `  - Status: ${result.statusCode}\n` +
          `  - Message: ${result.message}`
      );
    }

    return result.data!;
  }
}
