import { useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Spinner } from "@/shared/ui";
import { useToast } from "@/shared/feedback";
import { useAbout } from "./hooks/useAbout";
import { AboutForm } from "./components/AboutForm";
import type { AboutFormValues } from "./types";

/** Admin page for managing the About page content, milestones, and stats. */
export function AboutAdminPage() {
  const { about, loading, save } = useAbout();
  const toast = useToast();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (values: AboutFormValues) => {
    setSaving(true);
    try {
      await save(values);
      toast.success("About page saved");
    } catch {
      toast.error("Failed to save about page");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="About Page"
        description="Manage the About page content, milestones, and stats."
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : (
        <AboutForm
          initialValues={about}
          submitting={saving}
          onSubmit={handleSubmit}
          onError={(message) => toast.error(message)}
        />
      )}
    </div>
  );
}
