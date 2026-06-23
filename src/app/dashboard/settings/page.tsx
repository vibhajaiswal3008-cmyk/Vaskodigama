import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { SettingsForm } from "@/components/dashboard/settings-form";

export default function SettingsPage() {
  return (
    <>
      <DashboardPageHeader
        title="Settings"
        description="Manage your profile and preferences. These are demonstration settings saved locally."
        showIllustrative={false}
      />
      <SettingsForm />
    </>
  );
}
