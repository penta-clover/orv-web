"use client";

import "@/app/components/blackBody.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useArchiveRepository } from "@/providers/ArchiveRepositoryContext";
import {
  Suspense,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { VideoMetadata } from "@/domain/model/VideoMetadata";
import { ThumbnailCandidate } from "@/domain/model/ThumbnailCandidate";
import { useMemberRepository } from "@/providers/MemberRepositoryContext";
import { MyInfo } from "@/domain/model/MyInfo";
import Image from "next/image";
import ExitInterviewModal from "../../(components)/exitInterviewModal";
import { getPermissionGuideText } from "../../(components)/getPermissionGuideText";
import usePermissionReload from "../../(components)/usePermissionReload";

export default function Page() {
  return (
    <Suspense>
      <Body />
    </Suspense>
  );
}

function Body() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("videoId");
  const [progress, setProgress] = useState<string>("ready");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [capturedImage, setCapturedImage] = useState<Blob | null>(null);
  const [nickname, setNickname] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isRecommendationModalOpen, setIsRecommendationModalOpen] =
    useState<boolean>(false);
  const [thumbnailCandidates, setThumbnailCandidates] = useState<
    ThumbnailCandidate[]
  >([]);
  const [isThumbnailCandidatesLoading, setIsThumbnailCandidatesLoading] =
    useState<boolean>(false);
  const [thumbnailCandidateError, setThumbnailCandidateError] = useState<
    string | null
  >(null);
  const [selectingCandidateId, setSelectingCandidateId] = useState<
    number | null
  >(null);
  const router = useRouter();

  const memberRepository = useMemberRepository();
  const archiveRepository = useArchiveRepository();

  useEffect(() => {
    memberRepository
      .getMyInfo()
      .then((myInfo: MyInfo) => setNickname(myInfo.nickname));
  }, []);

  const fetchThumbnailCandidates = useCallback(
    async (showLoading: boolean = true) => {
      if (!videoId) {
        return;
      }

      if (showLoading) {
        setIsThumbnailCandidatesLoading(true);
      }
      setThumbnailCandidateError(null);

      try {
        const candidates = await archiveRepository.getThumbnailCandidates(
          videoId
        );
        setThumbnailCandidates(candidates);
      } catch (error: any) {
        console.error("썸네일 후보 조회 실패:", error);
        setThumbnailCandidateError(
          "썸네일 후보를 불러오지 못했어요. 잠시 후 다시 시도해주세요."
        );
      } finally {
        if (showLoading) {
          setIsThumbnailCandidatesLoading(false);
        }
      }
    },
    [archiveRepository, videoId]
  );

  useEffect(() => {
    if (
      !isRecommendationModalOpen ||
      !videoId ||
      thumbnailCandidates.length > 0 ||
      selectingCandidateId !== null
    ) {
      return;
    }

    const intervalId = window.setInterval(() => {
      fetchThumbnailCandidates(false);
    }, 3000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    fetchThumbnailCandidates,
    isRecommendationModalOpen,
    selectingCandidateId,
    thumbnailCandidates.length,
    videoId,
  ]);

  const openRecommendationModal = () => {
    if (!videoId) {
      alert("비디오 정보를 찾을 수 없습니다.");
      return;
    }

    setThumbnailCandidates([]);
    setThumbnailCandidateError(null);
    setSelectingCandidateId(null);
    setIsRecommendationModalOpen(true);
    fetchThumbnailCandidates(true);
  };

  const selectThumbnailCandidate = async (candidate: ThumbnailCandidate) => {
    if (!videoId || selectingCandidateId !== null) {
      return;
    }

    setSelectingCandidateId(candidate.id);
    setThumbnailCandidateError(null);

    try {
      await archiveRepository.selectThumbnailCandidate(videoId, candidate.id);
      const videoMetadata: VideoMetadata = await archiveRepository.getVideo(
        videoId
      );
      router.replace(`/interview/finish/download?videoId=${videoMetadata.id}`);
    } catch (error: any) {
      console.error("추천 썸네일 선택 실패:", error);
      setThumbnailCandidateError(
        "썸네일 선택에 실패했어요. 다시 시도해주세요."
      );
      setSelectingCandidateId(null);
    }
  };

  return (
    <ExitInterviewModal
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
      onExitInterview={() => {
        router.replace("/");
      }}
    >
      <div className="relative flex flex-col items-center h-[100dvh]">
        <Image
          unoptimized
          src="/icons/x.svg"
          width={32}
          height={32}
          alt="close"
          onClick={() => setIsModalOpen(true)}
          className="fixed top-[10px] right-[10px] px-[16px] py-[12px] w-[64px] h-[56px] focus:outline-none cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center w-full">
          <div className="h-[80px]" />
          <div className="text-white font-semibold text-[40px] leading-[44px]">
            마지막으로 오늘을 기념할 사진 한장을 남길게요
          </div>

          <div className="h-[62px]" />

          <div className="flex flex-col justify-start w-full h-full">
            {progress === "ready" ? (
              <div className="flex flex-col justify-center items-center h-[calc(55dvh)] w-full max-w-[calc(55dvh*16/9)] self-center bg-grayscale-900 rounded-[12px]">
                <div className="text-grayscale-500 text-center font-medium text-[16px] leading-[26px] xl:text-[18px] xl:leading-[28px]">
                  인터뷰 썸네일 그리고 인터뷰 Recap에 들어가는 사진이에요.
                  <br />
                  아래 버튼을 누르면 {nickname}님의 모습이 화면에 나오고 5초
                  뒤에 사진이 찍혀요.
                </div>

                <div className="h-[24px]" />
                <button
                  className="w-[91px] h-[56px] bg-grayscale-50 text-grayscale-800 rounded-[12px] text-head3 transition-all active:scale-95"
                  onClick={() => {
                    setProgress("countdown");
                  }}
                >
                  촬영하기
                </button>

                <div className="h-[12px]" />
                <button
                  className="h-[48px] px-[18px] bg-grayscale-800 border border-grayscale-600 text-grayscale-50 rounded-[12px] text-head4 transition-all active:scale-95"
                  onClick={openRecommendationModal}
                >
                  썸네일 추천 받기
                </button>
              </div>
            ) : (
              <></>
            )}

            {progress === "countdown" ? (
              <CountdownComponent
                className="h-[calc(55dvh)] w-full max-w-[calc(55dvh*16/9)] self-center"
                onComplete={() => {
                  if (videoRef.current) {
                    const video = videoRef.current;
                    const canvas = document.createElement("canvas");
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const context = canvas.getContext("2d");
                    if (context) {
                      context.drawImage(
                        video,
                        0,
                        0,
                        canvas.width,
                        canvas.height
                      );
                      canvas.toBlob((blob) => {
                        if (blob) {
                          setCapturedImage(blob);

                          // 캡처 후에 스트림 종료
                          const stream = video.srcObject as MediaStream | null;
                          if (stream) {
                            stream.getTracks().forEach((track) => track.stop());
                            video.srcObject = null;
                          }

                          setProgress("flash");
                          setTimeout(() => {
                            setProgress("complete");
                          }, 1000);
                        }
                      }, "image/png");
                    }
                  }
                }}
                ref={videoRef}
              />
            ) : (
              <></>
            )}

            {progress === "flash" ? (
              <div className="flex justify-center items-center h-[calc(55dvh)] w-full max-w-[calc(55dvh*16/9)] self-center w-full bg-grayscale-white rounded-[12px]"></div>
            ) : (
              <></>
            )}

            {progress === "complete" ? (
              <ResultPreview
                className="h-[calc(55dvh)] w-full max-w-[calc(55dvh*16/9)] self-center w-full"
                capturedImage={capturedImage}
                onClickAgain={() => {
                  setProgress("countdown");
                }}
                onClickConfirm={() => {
                  if (!capturedImage || !videoId) {
                    return;
                  }

                  archiveRepository
                    .updateThumbnail(videoId, capturedImage)
                    .then(async () => {
                      const videoMetadata: VideoMetadata =
                        await archiveRepository.getVideo(videoId);
                      router.replace(
                        `/interview/finish/download?videoId=${videoMetadata.id}`
                      );
                    })
                    .catch((error: any) => {
                      console.error("썸네일 업데이트 실패:", error);
                    });
                }}
              />
            ) : (
              <></>
            )}
          </div>
        </div>

        <div
          className={`absolute flex flex-row justify-center items-center left-[48px] bottom-[48px] w-[139px] h-[56px] bg-main-lilac50 rounded-[12px] duration-all transition-allactive:scale-95 ${
            progress === "ready" || progress === "complete"
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => router.back()}
        >
          <Image
            unoptimized
            src="/icons/left-arrow-black.svg"
            width={24}
            height={24}
            alt="left arrow"
          />
          <span className="text-head3 text-grayscale-800">이전으로</span>
        </div>

        <ThumbnailRecommendationModal
          isOpen={isRecommendationModalOpen}
          candidates={thumbnailCandidates}
          isLoading={isThumbnailCandidatesLoading}
          errorMessage={thumbnailCandidateError}
          selectingCandidateId={selectingCandidateId}
          onClose={() => setIsRecommendationModalOpen(false)}
          onRetry={() => fetchThumbnailCandidates(true)}
          onSelect={selectThumbnailCandidate}
        />
      </div>
    </ExitInterviewModal>
  );
}

function ThumbnailRecommendationModal(props: {
  isOpen: boolean;
  candidates: ThumbnailCandidate[];
  isLoading: boolean;
  errorMessage: string | null;
  selectingCandidateId: number | null;
  onClose: () => void;
  onRetry: () => void;
  onSelect: (candidate: ThumbnailCandidate) => void;
}) {
  const {
    isOpen,
    candidates,
    isLoading,
    errorMessage,
    selectingCandidateId,
    onClose,
    onRetry,
    onSelect,
  } = props;

  useEffect(() => {
    if (!isOpen || selectingCandidateId !== null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, selectingCandidateId]);

  if (!isOpen) {
    return null;
  }

  const shouldShowSkeleton =
    candidates.length === 0 && (isLoading || !errorMessage);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-[24px]"
      role="dialog"
      aria-modal="true"
      onClick={selectingCandidateId === null ? onClose : undefined}
    >
      <div
        className="relative w-full max-w-[920px] max-h-[calc(100dvh-64px)] overflow-y-auto rounded-[16px] border border-grayscale-700 bg-grayscale-900 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="닫기"
          className="absolute right-[16px] top-[16px] flex h-[44px] w-[44px] items-center justify-center rounded-[10px] bg-grayscale-800 transition-all active:scale-95 disabled:opacity-50"
          disabled={selectingCandidateId !== null}
          onClick={onClose}
        >
          <Image
            unoptimized
            src="/icons/x.svg"
            width={24}
            height={24}
            alt=""
          />
        </button>

        <div className="px-[28px] py-[32px] sm:px-[36px]">
          <div className="pr-[48px] text-white font-semibold text-[28px] leading-[36px]">
            썸네일 추천
          </div>
          <div className="h-[24px]" />

          {errorMessage && candidates.length > 0 && (
            <>
              <div className="rounded-[10px] bg-grayscale-800 px-[16px] py-[12px] text-grayscale-100 text-[14px] leading-[22px]">
                {errorMessage}
              </div>
              <div className="h-[14px]" />
            </>
          )}

          {errorMessage && candidates.length === 0 ? (
            <div className="flex min-h-[240px] flex-col items-center justify-center rounded-[12px] bg-grayscale-800 px-[24px] text-center">
              <p className="text-grayscale-200 text-[16px] leading-[26px]">
                {errorMessage}
              </p>
              <div className="h-[18px]" />
              <button
                type="button"
                className="h-[44px] px-[18px] rounded-[10px] bg-main-lilac50 text-grayscale-800 text-head4 transition-all active:scale-95"
                onClick={onRetry}
              >
                다시 시도
              </button>
            </div>
          ) : shouldShowSkeleton ? (
            <ThumbnailCandidateSkeleton />
          ) : (
            <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2 lg:grid-cols-3">
              {candidates.map((candidate) => (
                <button
                  type="button"
                  key={candidate.id}
                  className="group relative aspect-[16/9] overflow-hidden rounded-[12px] border-[2px] border-transparent bg-grayscale-800 text-left transition-all hover:border-main-lilac50 active:scale-[0.99] disabled:cursor-wait disabled:opacity-75"
                  disabled={selectingCandidateId !== null}
                  onClick={() => onSelect(candidate)}
                >
                  <img
                    src={candidate.imageUrl}
                    alt="썸네일 후보"
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                  />
                  <div className="absolute bottom-[10px] right-[10px] rounded-full bg-black/70 px-[10px] py-[4px] text-[13px] leading-[18px] text-white">
                    {formatTimestamp(candidate.timestampMs)}
                  </div>
                  {selectingCandidateId === candidate.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-head4">
                      선택 중...
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ThumbnailCandidateSkeleton() {
  return (
    <div className="flex min-h-[300px] flex-col justify-center">
      <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="relative aspect-[16/9] overflow-hidden rounded-[12px] bg-grayscale-800"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-grayscale-900 via-grayscale-700 to-grayscale-900 animate-skeleton-wave" />
          </div>
        ))}
      </div>
      <div className="h-[24px]" />
      <p className="text-center text-grayscale-300 text-[16px] leading-[26px]">
        썸네일로 쓸만한 장면을 고르고 있어요. 잠시만 기다려주세요
      </p>
    </div>
  );
}

function formatTimestamp(timestampMs: number) {
  if (!Number.isFinite(timestampMs)) {
    return "0:00";
  }

  const totalSeconds = Math.max(0, Math.floor(timestampMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function CountdownComponent(props: {
  onComplete: () => void;
  ref: React.ForwardedRef<HTMLVideoElement>;
  className?: string;
}) {
  const [second, setSecond] = useState<number>(5);
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  usePermissionReload("camera");
  usePermissionReload("microphone");

  useImperativeHandle(
    props.ref,
    () => localVideoRef.current as HTMLVideoElement
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setSecond((prev) => {
        if (prev === 1) {
          setIsEnd(true);
          return prev;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isEnd) {
      props.onComplete();
    }
  }, [isEnd]);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const enableCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        alert(getPermissionGuideText());
      }
    };

    enableCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
    };
  }, []);

  return (
    <div
      className={`relative flex justify-center items-center bg-grayscale-900 rounded-[12px] ${props.className}`}
    >
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        className="absolute top-0 left-0 w-full h-full rounded-[12px]"
        style={{
          width: "100%",
          aspectRatio: "16/9",
          objectFit: "cover",
          transform: "scaleX(-1)",
        }}
      />
      <div className="flex justify-center items-center font-semibold absolute top-0 left-0 w-full h-full text-[72px] leading-[44px] text-white ">
        {second}
      </div>
    </div>
  );
}

function ResultPreview(props: {
  capturedImage: Blob | null;
  onClickAgain: () => void;
  onClickConfirm: () => void;
  className?: string;
}) {
  return (
    <div className="flex flex-col">
      <div
        className={`flex justify-center items-center bg-grayscale-900 rounded-[12px] ${props.className}`}
      >
        {props.capturedImage ? (
          <img
            src={URL.createObjectURL(props.capturedImage)}
            alt="Captured"
            className="w-full h-full object-cover rounded-[12px]"
            style={{
              transform: "scaleX(-1)",
            }}
          />
        ) : (
          <p>사진이 없습니다.</p>
        )}
      </div>

      <div className="h-[16px]" />

      <div className="flex flex-row gap-[10px] justify-end w-full max-w-[calc(55dvh*16/9)] self-center">
        <button
          className="w-[88px] h-[44px] text-grayscale-50 bg-grayscale-600 text-head4 rounded-[10px] transition-all active:scale-95"
          onClick={props.onClickAgain}
        >
          다시 찍기
        </button>
        <button
          className="w-[145px] h-[44px] text-grayscale-800 bg-main-lilac50 text-head4 rounded-[10px] transition-all active:scale-95"
          onClick={props.onClickConfirm}
        >
          이 사진으로 할게요
        </button>
      </div>
    </div>
  );
}
