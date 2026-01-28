"use client";

import { useSearchParams } from "next/navigation";
import MyProfilePage from "./myprofile/page";
import MyCoursePage from "./mycourse/page";
import AIUsagePage from "./myusage/page";

export default function MyBeyondPage() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "myprofile";

  return (
    <>
      {currentTab === "myprofile" && <MyProfilePage />}
            
      {currentTab === "mycourse" && <MyCoursePage/>}

      {currentTab === "myusage" && <AIUsagePage/>}
    </>
  );
}
