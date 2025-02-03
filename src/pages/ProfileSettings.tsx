import { DashboardLayout } from "@/components/DashboardLayout";
import { ProfileSettings as ProfileSettingsComponent } from "@/components/profile/ProfileSettings";

export default function ProfileSettings() {
  return (
    <DashboardLayout>
      <ProfileSettingsComponent />
    </DashboardLayout>
  );
}