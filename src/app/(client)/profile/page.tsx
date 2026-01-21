import Footer from "@/components/footer";
import Navbar from "@/components/navbar/navbar";
import ProfileDashboard from "@/components/profile/profile-dashboard";
import ScrollToTop from "@/components/scroll-to-top";
import Switcher from "@/components/switcher";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Profile | Maximum",
  description: "Manage your Maximum profile, courses, and account settings",
};

export default function ProfilePage() {
  return (
    <>
      <Navbar navlight={false} />
      <div className="container mx-auto py-[50px]">
        <ProfileDashboard />
      </div>

      <Footer />

      <ScrollToTop />
      <Switcher />
    </>
  );
}
