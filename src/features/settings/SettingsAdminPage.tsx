import { Save } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button, Spinner } from "@/shared/ui";
import { useToast } from "@/shared/feedback";
import { useSettings } from "./hooks/useSettings";
import { BrandingSection } from "./components/BrandingSection";
import { FooterSection } from "./components/FooterSection";
import { SocialLinksSection } from "./components/SocialLinksSection";
import { MaintenanceSection } from "./components/MaintenanceSection";
import { AnnouncementSection } from "./components/AnnouncementSection";
import type { SiteSettings } from "./types";

/** Site-wide settings form, composed from grouped sections. */
export function SettingsAdminPage() {
  const { settings, setSettings, loading, saving, save } = useSettings();
  const toast = useToast();

  const onChange = (patch: Partial<SiteSettings>) =>
    setSettings((prev) => ({ ...prev, ...patch }));

  const handleSave = async () => {
    try {
      await save();
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    }
  };

  return (
    <div>
      <PageHeader
        title="Site settings"
        description="Configure global site options and branding."
        actions={
          <Button
            leftIcon={<Save className="h-4 w-4" />}
            loading={saving}
            disabled={loading}
            onClick={handleSave}
          >
            Save settings
          </Button>
        }
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="mx-auto max-w-4xl space-y-6">
          <BrandingSection
            settings={settings}
            onChange={onChange}
            onError={(message) => toast.error(message)}
          />
          <FooterSection settings={settings} onChange={onChange} />
          <SocialLinksSection settings={settings} onChange={onChange} />
          <MaintenanceSection settings={settings} onChange={onChange} />
          <AnnouncementSection settings={settings} onChange={onChange} />

          <div className="flex justify-end">
            <Button
              leftIcon={<Save className="h-4 w-4" />}
              loading={saving}
              onClick={handleSave}
            >
              Save settings
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
