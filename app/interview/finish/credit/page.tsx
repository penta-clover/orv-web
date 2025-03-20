"use client";

import "@/app/components/blackBody.css";
import { useSearchParams } from "next/navigation";
import { useArchiveRepository } from "@/providers/ArchiveRepositoryContext";


export default function Page() {
  const searchParams = useSearchParams();
  const videoUrl = searchParams.get("videoUrl");
  const archiveRepository = useArchiveRepository();

  return (
    <div>
      <div>hello, world!</div>
    </div>
  );
}

