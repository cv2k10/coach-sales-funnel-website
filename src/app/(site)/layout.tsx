import type { ReactNode } from "react";
import { AnnouncementBar, SiteFooter, SiteHeader } from "@/components/site";
import { SocialProof, TrackView } from "@/components/client";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <SocialProof />
      <TrackView />
    </>
  );
}
