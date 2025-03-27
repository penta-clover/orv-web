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
      onExitInterview={() => router.replace("/")}
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
        <div className="flex flex-col grow items-center justify-center pb-[10px]">
          <div className="text-white font-semibold text-[40px] leading-[44px]">
            마지막으로 오늘을 기념할 사진 한장을 남길게요
          </div>

          <div className="h-[44px]" />

          <div className="text-grayscale-500 text-center font-medium text-[24px] leading-[36px]">
            인터뷰 썸네일 그리고 인터뷰 Recap에 들어가는 사진이에요.
            <br />
            아래 버튼을 누르면 {nickname}님의 모습이 화면에 나오고 5초 뒤에
            사진이 찍혀요.
          </div>

          <div className="h-[56px]" />

          <div className="flex flex-col justify-start w-full h-[536px]">
            {progress === "ready" ? (
              <div className="flex justify-center items-center h-[476px] w-[846px] bg-grayscale-900 rounded-[12px]">
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
                onComplete={() => {
                  if (videoRef.current) {
                    setProgress("flash");

                    setTimeout(() => {
                      setProgress("complete");
                    }, 1000);

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
              <div className="flex justify-center items-center h-[476px] w-[846px] bg-grayscale-white rounded-[12px]"></div>
            ) : (
              <></>
            )}

            {progress === "complete" ? (
              <ResultPreview
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
}) {
  const [second, setSecond] = useState<number>(5);
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
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
    if (typeof window !== "undefined" && navigator.mediaDevices) {
      const enableCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error("카메라를 활성화하는 도중 에러 발생:", error);
        }
      };

      enableCamera();
      return () => {
        if (localVideoRef.current && localVideoRef.current.srcObject) {
          const stream = localVideoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach((track) => track.stop());
          localVideoRef.current.srcObject = null;
        }
      };
    }
  }, []);

  return (
    <div className="relative flex justify-center items-center h-[476px] w-[846px] bg-grayscale-900 rounded-[12px]">
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
}) {
  return (
    <div className="flex flex-col">
      <div className="flex justify-center items-center h-[476px] w-[846px] bg-grayscale-900 rounded-[12px]">
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

      <div className="flex flex-row gap-[10px] justify-end">
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
