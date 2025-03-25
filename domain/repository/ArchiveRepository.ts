import { VideoMetadata } from "../model/VideoMetadata";


export interface ArchiveRepository {
  getVideo(videoId: string): Promise<VideoMetadata>;

  uploadVideo(video: Blob, storyboardId: string): Promise<string>;

  renameVideo(videoId: string, title: string): Promise<void>;

  updateThumbnail(videoId: string, capturedImage: Blob): Promise<void>;
}