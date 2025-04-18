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
      description: "노트북으로 입장해주세요.",
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
      ogDescription: "노트북으로 입장해주세요.",
      ogImage:
        "http://d3bdjeyz3ry3pi.cloudfront.net/static/images/invitation-og.png",
    },
    HIDDEN_3fEMQ2: {
      text: "같은 주제의 질문 중 “왜 HySpark에 들어 오려고 했나요?”라는 질문에 “언젠가 죽는 날이 다가왔을 때 그때 해볼 걸이라고 후회할 것 같아서 모든 것을 해보겠다는 마음으로 지원했습니다.”라고 답변",
      ogTitle: "오브를 즐겨쓰는 친구가 초대했어요.",
      ogDescription: "노트북으로 입장해주세요.",
      ogImage:
        "http://d3bdjeyz3ry3pi.cloudfront.net/static/images/invitation-og.png",
    },
    HIDDEN_3fEMQ3: {
      text: "같은 주제의 질문 중 “이번 생일에 가장 고마움을 느끼는 상대가 있나요?”라는 질문에 “축하해준 사람들 모두한테 정말 고맙다고 느끼지만, 그 중에서도 예상치 못하게 오랜만에 연락을 준 친구들이 특히 더 고마웠던 것 같아요. 생일이라고 하더라도 연락을 안하다가 갑자기 연락하는 일은 쉬운 일이 아니라고 생각해서요”라고 답변",
      ogTitle: "오브를 즐겨쓰는 친구가 초대했어요.",
      ogDescription: "노트북으로 입장해주세요.",
      ogImage:
        "http://d3bdjeyz3ry3pi.cloudfront.net/static/images/invitation-og.png",
    },
    HIDDEN_3fEMQ4: {
      text: "같은 주제의 질문 중 “만약 주변 사람들의 시선이나 경제적인 제약이 없다면 당장 무엇을 할 건가요?”라는 질문에 “명품차까지는 아니더라도 차 사고 집도 좋은 곳으로 사고 싶어요. 노숙인들도 돕고 싶고.. 가치있는 일을 하고 싶어요.”라고 답변",
      ogTitle: "오브를 즐겨쓰는 친구가 초대했어요.",
      ogDescription: "노트북으로 입장해주세요.",
      ogImage:
        "http://d3bdjeyz3ry3pi.cloudfront.net/static/images/invitation-og.png",
    },
  };

  return data[topic];
}
