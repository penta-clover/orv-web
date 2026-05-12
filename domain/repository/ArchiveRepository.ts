import { Video } from "../model/Video";
import { VideoMetadata } from "../model/VideoMetadata";
import { ThumbnailCandidate } from "../model/ThumbnailCandidate";

export interface ArchiveRepository {
  getVideo(videoId: string): Promise<VideoMetadata>;

  uploadVideo(video: Blob, storyboardId: string): Promise<string>;

  renameVideo(videoId: string, title: string): Promise<void>;

  updateThumbnail(videoId: string, capturedImage: Blob): Promise<void>;

  getThumbnailCandidates(videoId: string): Promise<ThumbnailCandidate[]>;

  selectThumbnailCandidate(videoId: string, candidateId: number): Promise<void>;

  getMyVideos(): Promise<Video[]>;
}
