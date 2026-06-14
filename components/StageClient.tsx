"use client";
import dynamic from "next/dynamic";

const SlideStage = dynamic(() => import("./SlideStage"), { ssr: false });

export default function StageClient() {
  return <SlideStage />;
}
