"use client";

import { useSearchParams } from "next/navigation";
import MyProfilePage from "./myprofile/page";
import MyWalletPage from "./mywallet/page";
import MyCoursePage from "./mycourse/page";

export default function MyBeyondPage() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "MyProfile";

  return (
    <>
      {currentTab === "myprofile" && <MyProfilePage />}
      
      {currentTab === "mywallet" && <MyWalletPage/>}
      
      {currentTab === "mycourse" && <MyCoursePage/>}
    </>
  );
}
