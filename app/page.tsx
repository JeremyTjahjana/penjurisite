"use client";

import { useEffect, useState } from "react";
import { HomeHeader } from "@/components/HomeHeader";
import { PracticeRecommendations } from "@/components/PracticeRecommendations";
import { YouTubeRecommendations } from "@/components/YouTubeRecommendations";
import { ViewProblemsButton } from "@/components/ViewProblemsButton";
import { TotalVisitorsFooter } from "@/components/TotalVisitorsFooter";

export default function Home() {
  const [totalVisitors, setTotalVisitors] = useState<number>(0);
  const [todayVisitors, setTodayVisitors] = useState<number>(0);
  const [weeklyVisitors, setWeeklyVisitors] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const response = await fetch("/api/visitors");
        const data = await response.json();
        if (data.success) {
          setTotalVisitors(data.totalVisitors);
          setTodayVisitors(data.todayVisitors);
          setWeeklyVisitors(data.weeklyVisitors);
        }
      } catch (error) {
        console.error("Error tracking visitor:", error);
      } finally {
        setLoading(false);
      }
    };

    trackVisitor();
  }, []);

  return (
    <>
      <section className="flex flex-1 flex-col bg-zinc-100 px-4 py-6 md:px-10 md:py-12">
        <div className="mx-auto w-full max-w-7xl">
          <HomeHeader weeklyVisitors={weeklyVisitors} loading={loading} />

          <div className="grid gap-4 md:grid-cols-2">
            <PracticeRecommendations />
            <YouTubeRecommendations />
          </div>

          <ViewProblemsButton />
        </div>
      </section>

      <TotalVisitorsFooter totalVisitors={totalVisitors} loading={loading} />
    </>
  );
}
