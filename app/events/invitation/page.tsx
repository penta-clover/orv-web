// app/events/invitation/page.tsx
import type { Metadata, ResolvingMetadata } from "next";
import InvitationPage from "./InvitationPage.client";

type Props = {
  searchParams: Promise<{ t?: string; f?: string; c?: string }>;
};

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    openGraph: {
      title: "오브를 즐겨쓰는 친구가 초대했어요.",
      description: "친구가 추천하는 주제로 참여가능해요.",
      images: [
        "http://d3bdjeyz3ry3pi.cloudfront.net/static/images/invitation-og.png",
      ],
    },
  };
}

export default function Page({ searchParams }: Props) {
  // 서버 컴포넌트에서는 props.searchParams를 직접 받아 클라이언트 컴포넌트에 전달
  return <InvitationPage />;
}

function topicMapper(topic: string): {
  text: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
} {
  const data: any = {
    HIDDEN_3fEMQ1: {
      text: "같은 주제의 질문 중 “유튜브를 운영하며 가장 힘들었던 점은 무엇인가요?”라는 질문에 “열심히 만든 영상이었는데 사람들이 반응이 나타나지 않을 때”라고 답변",
      ogTitle: "오브를 즐겨쓰는 친구가 초대했어요.",
      ogDescription: "친구가 추천하는 주제로 참여가능해요.",
      ogImage:
        "http://d3bdjeyz3ry3pi.cloudfront.net/static/images/invitation-og.png",
    },
    HIDDEN_3fEMQ2: {
      text: "같은 주제의 질문 중 “왜 HySpark에 들어 오려고 했나요?”라는 질문에 “언젠가 죽는 날이 다가왔을 때 그때 해볼 걸이라고 후회할 것 같아서 모든 것을 해보겠다는 마음으로 지원했습니다.”라고 답변",
      ogTitle: "오브를 즐겨쓰는 친구가 초대했어요.",
      ogDescription: "친구가 추천하는 주제로 참여가능해요.",
      ogImage:
        "http://d3bdjeyz3ry3pi.cloudfront.net/static/images/invitation-og.png",
    },
  };

  return data[topic];
}
