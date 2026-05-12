import { VideoMetadata } from "@/domain/model/VideoMetadata";
import { ArchiveRepository } from "@/domain/repository/ArchiveRepository";
import { Api } from "../Api";
import { ApiResult } from "../ApiResult";
import { Video } from "@/domain/model/Video";
import { ThumbnailCandidate } from "@/domain/model/ThumbnailCandidate";

interface PresignedUploadUrlResponse {
  videoId: string;
  uploadUrl: string;
  expiresAt: string;
}

export class ArchiveRepositoryImpl implements ArchiveRepository {
  constructor(private api: Api) {}

  async getVideo(videoId: string): Promise<VideoMetadata> {
    const requestPath = `/archive/video/${videoId}`;
    const result: ApiResult<VideoMetadata> = await this.api.get<VideoMetadata>(
      requestPath
    );

    if (result.statusCode !== "200" || result.data === null) {
      throw new Error(
        `[API Error] ArchiveRepositoryImpl.getVideo\n` +
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
    const uploadUrlPath = `/archive/upload-url?storyboardId=${encodeURIComponent(
      storyboardId
    )}`;
    const uploadUrlResult: ApiResult<PresignedUploadUrlResponse> =
      await this.api.getV1<PresignedUploadUrlResponse>(uploadUrlPath);

    if (uploadUrlResult.statusCode !== "200" || uploadUrlResult.data === null) {
      throw new Error(
        `[API Error] ArchiveRepositoryImpl.uploadVideo.requestUploadUrl\n` +
          `Parameters:\n` +
          `  - storyboardId: ${storyboardId}\n` +
          `Response:\n` +
          `  - Status: ${uploadUrlResult.statusCode}\n` +
          `  - Message: ${uploadUrlResult.message}`
      );
    }

    const { videoId, uploadUrl } = uploadUrlResult.data;
    const directUploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": video.type || "video/mp4",
      },
      body: video,
    });

    if (!directUploadResponse.ok) {
      throw new Error(
        `[API Error] ArchiveRepositoryImpl.uploadVideo.directUpload\n` +
          `Parameters:\n` +
          `  - videoId: ${videoId}\n` +
          `  - storyboardId: ${storyboardId}\n` +
          `Response:\n` +
          `  - Status: ${directUploadResponse.status}\n` +
          `  - Message: ${directUploadResponse.statusText}`
      );
    }

    const confirmPath = "/archive/recorded-video";
    const confirmResult: ApiResult<string> = await this.api.postV1<string>(
      confirmPath,
      { videoId }
    );

    if (confirmResult.statusCode !== "200" || confirmResult.data === null) {
      throw new Error(
        `[API Error] ArchiveRepositoryImpl.uploadVideo.confirmUpload\n` +
          `Parameters:\n` +
          `  - videoId: ${videoId}\n` +
          `  - storyboardId: ${storyboardId}\n` +
          `Response:\n` +
          `  - Status: ${confirmResult.statusCode}\n` +
          `  - Message: ${confirmResult.message}`
      );
    }

    return confirmResult.data;
  }

  async renameVideo(videoId: string, title: string): Promise<void> {
    const requestPath = `/archive/video/${videoId}`;
    const result: ApiResult<void> = await this.api.patch<void>(
      requestPath,
      { title: title }
    );

    if (result.statusCode !== "200") {
      throw new Error(
        `[API Error] ArchiveRepositoryImpl.renameVideo\n` +
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
    const requestPath = `/archive/video/${videoId}/thumbnail/upload`;

    const formData = new FormData();
    formData.append("thumbnail", capturedImage, "thumbnail");

    const result: ApiResult<boolean> = await this.api.putV1<boolean>(
      requestPath,
      formData
    );

    if (result.statusCode !== "200" || result.data === false) {
      throw new Error(
        `[API Error] ArchiveRepositoryImpl.updateThumbnail\n` +
          `Parameters:\n` +
          `  - videoId: ${videoId}\n` +
          `  - capturedImage: ${capturedImage}\n` +
          `Response:\n` +
          `  - Status: ${result.statusCode}\n` +
          `  - Message: ${result.message}`
      );
    }
  }

  async getThumbnailCandidates(videoId: string): Promise<ThumbnailCandidate[]> {
    const requestPath = `/archive/video/${videoId}/thumbnail-candidates`;

    const result: ApiResult<ThumbnailCandidate[]> = await this.api.getV1<
      ThumbnailCandidate[]
    >(requestPath);

    if (result.statusCode !== "200") {
      throw new Error(
        `[API Error] ArchiveRepositoryImpl.getThumbnailCandidates\n` +
          `Parameters:\n` +
          `  - videoId: ${videoId}\n` +
          `Response:\n` +
          `  - Status: ${result.statusCode}\n` +
          `  - Message: ${result.message}`
      );
    }

    return result.data ?? [];
  }

  async selectThumbnailCandidate(
    videoId: string,
    candidateId: number
  ): Promise<void> {
    const requestPath = `/archive/video/${videoId}/thumbnail/select`;

    const result: ApiResult<void> = await this.api.putV1<void>(requestPath, {
      candidateId,
    });

    if (result.statusCode !== "200") {
      throw new Error(
        `[API Error] ArchiveRepositoryImpl.selectThumbnailCandidate\n` +
          `Parameters:\n` +
          `  - videoId: ${videoId}\n` +
          `  - candidateId: ${candidateId}\n` +
          `Response:\n` +
          `  - Status: ${result.statusCode}\n` +
          `  - Message: ${result.message}`
      );
    }
  }

  async getMyVideos(): Promise<Video[]> {
    const requestPath = `/archive/videos/my`;

    const result: ApiResult<Video[]> = await this.api.get<Video[]>(
      requestPath
    );

    if (result.statusCode !== "200") {
      throw new Error(
        `[API Error] ArchiveRepositoryImpl.getMyVideos\n` +
          `Response:\n` +
          `  - Status: ${result.statusCode}\n` +
          `  - Message: ${result.message}`
      );
    }

    return result.data!;
  }
}
