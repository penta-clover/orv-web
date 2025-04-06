"use client";

import "@/app/components/blackBody.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useArchiveRepository } from "@/providers/ArchiveRepositoryContext";
import {
  Suspense,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { VideoMetadata } from "@/domain/model/VideoMetadata";
import { useMemberRepository } from "@/providers/MemberRepositoryContext";
import { MyInfo } from "@/domain/model/MyInfo";
import Image from "next/image";
import ExitInterviewModal from "../../(components)/exitInterviewModal";
import { get } from "http";
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
  const router = useRouter();

  const memberRepository = useMemberRepository();
  const archiveRepository = useArchiveRepository();

  useEffect(() => {
    memberRepository
      .getMyInfo()
      .then((myInfo: MyInfo) => setNickname(myInfo.nickname));
  }, []);

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
      </div>
    </ExitInterviewModal>
  );
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
