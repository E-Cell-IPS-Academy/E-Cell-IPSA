import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button, Spinner } from "@/shared/ui";
import { useToast } from "@/shared/feedback";
import { useHero } from "./hooks/useHero";
import { HeroForm } from "./components/HeroForm";
import { HeroPreview } from "./components/HeroPreview";
import { EMPTY_HERO } from "./types";
import type { HeroFormValues } from "./types";

const toFormValues = (hero: HeroFormValues): HeroFormValues => ({
  title: hero.title,
  subtitle: hero.subtitle,
  description: hero.description,
  ctaText: hero.ctaText,
  ctaLink: hero.ctaLink,
  videoUrl: hero.videoUrl,
  backgroundType: hero.backgroundType,
  backgroundUrl: hero.backgroundUrl,
});

/** Single-document editor for the landing-page hero section. */
export function HeroAdminPage() {
  const { hero, loading, save } = useHero();
  const toast = useToast();

  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [draft, setDraft] = useState<HeroFormValues>(EMPTY_HERO);

  const initialValues = useMemo(() => toFormValues(hero), [hero]);

  useEffect(() => {
    setDraft(initialValues);
  }, [initialValues]);

  const handleSubmit = async (values: HeroFormValues) => {
    setSaving(true);
    try {
      await save(values);
      toast.success("Hero section saved");
    } catch {
      toast.error("Failed to save hero section");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Hero section"
        description="Manage the landing page hero content."
        actions={
          <Button
            variant="outline"
            leftIcon={
              showPreview ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )
            }
            onClick={() => setShowPreview((prev) => !prev)}
          >
            {showPreview ? "Hide preview" : "Show preview"}
          </Button>
        }
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="space-y-6">
          {showPreview && <HeroPreview values={draft} />}
          <HeroForm
            initialValues={initialValues}
            submitting={saving}
            onSubmit={handleSubmit}
            onChange={setDraft}
            onError={(message) => toast.error(message)}
          />
        </div>
      )}
    </div>
  );
}
