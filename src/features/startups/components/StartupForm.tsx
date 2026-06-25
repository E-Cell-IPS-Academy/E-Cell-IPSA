import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Save } from "lucide-react";
import { Button, Input, Select, Textarea } from "@/shared/ui";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { FoundersEditor } from "./FoundersEditor";
import { FUNDING_STAGES, STARTUP_INDUSTRIES, STARTUP_STATUSES } from "../types";
import type { StartupFormValues, StartupSocialLinks } from "../types";

interface StartupFormProps {
  initialValues: StartupFormValues;
  submitLabel: string;
  submitting?: boolean;
  onSubmit: (values: StartupFormValues) => void;
  onCancel: () => void;
  onError?: (message: string) => void;
}

const csv = (list?: string[]) => (list ?? []).join(", ");
const fromCsv = (value: string) =>
  value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const SOCIAL_PLATFORMS: { key: keyof StartupSocialLinks; label: string }[] = [
  { key: "linkedin", label: "LinkedIn URL" },
  { key: "twitter", label: "Twitter URL" },
  { key: "instagram", label: "Instagram URL" },
  { key: "facebook", label: "Facebook URL" },
];

/** Create / edit form for a startup. Owns its own field state. */
export function StartupForm({
  initialValues,
  submitLabel,
  submitting = false,
  onSubmit,
  onCancel,
  onError,
}: StartupFormProps) {
  const [values, setValues] = useState<StartupFormValues>(initialValues);

  const setField = <K extends keyof StartupFormValues>(
    key: K,
    value: StartupFormValues[K]
  ) => setValues((prev) => ({ ...prev, [key]: value }));

  const handleNumber = (e: ChangeEvent<HTMLInputElement>) =>
    setField(
      e.target.name as keyof StartupFormValues,
      (parseInt(e.target.value, 10) || 0) as never
    );

  const setSocial = (platform: keyof StartupSocialLinks, value: string) =>
    setField("socialLinks", { ...values.socialLinks, [platform]: value });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ImageUploader
          label="Startup logo"
          value={values.logo}
          folder="startups/logos"
          onUploaded={(url, publicId) => {
            setField("logo", url);
            setField("logoPublicId", publicId);
          }}
          onError={onError}
        />
        <ImageUploader
          label="Cover image"
          value={values.coverImage}
          folder="startups/covers"
          onUploaded={(url, publicId) => {
            setField("coverImage", url);
            setField("coverImagePublicId", publicId);
          }}
          onError={onError}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Startup name"
          value={values.name}
          onChange={(e) => setField("name", e.target.value)}
          placeholder="Enter startup name"
          required
        />
        <Select
          label="Industry"
          value={values.industry}
          onChange={(e) => setField("industry", e.target.value)}
          required
        >
          <option value="">Select industry</option>
          {STARTUP_INDUSTRIES.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </Select>
      </div>

      <Input
        label="Short description"
        value={values.shortDescription}
        onChange={(e) => setField("shortDescription", e.target.value)}
        placeholder="Brief one-line description"
        required
      />

      <Textarea
        label="Full description"
        rows={4}
        value={values.description}
        onChange={(e) => setField("description", e.target.value)}
        placeholder="Detailed description of the startup"
        required
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Input
          label="Location"
          value={values.location}
          onChange={(e) => setField("location", e.target.value)}
          placeholder="City, Country"
          required
        />
        <Input
          label="Founded year"
          type="number"
          name="foundedYear"
          min={1900}
          max={new Date().getFullYear()}
          value={values.foundedYear}
          onChange={handleNumber}
          required
        />
        <Select
          label="Status"
          value={values.status}
          onChange={(e) =>
            setField("status", e.target.value as StartupFormValues["status"])
          }
        >
          {STARTUP_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Website"
          type="url"
          value={values.website ?? ""}
          onChange={(e) => setField("website", e.target.value)}
          placeholder="https://example.com"
        />
        <Input
          label="Featured date"
          type="date"
          value={values.featuredDate ?? ""}
          onChange={(e) => setField("featuredDate", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Select
          label="Funding stage"
          value={values.fundingStage}
          onChange={(e) => setField("fundingStage", e.target.value)}
        >
          {FUNDING_STAGES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        <Input
          label="Funding amount ($)"
          type="number"
          name="fundingAmount"
          min={0}
          value={values.fundingAmount}
          onChange={handleNumber}
          placeholder="0"
        />
        <Input
          label="Team size"
          type="number"
          name="employeeCount"
          min={0}
          value={values.employeeCount}
          onChange={handleNumber}
          placeholder="0"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Textarea
          label="Problem statement"
          rows={3}
          value={values.problem}
          onChange={(e) => setField("problem", e.target.value)}
          placeholder="What problem does this startup solve?"
          required
        />
        <Textarea
          label="Solution"
          rows={3}
          value={values.solution}
          onChange={(e) => setField("solution", e.target.value)}
          placeholder="How does this startup solve the problem?"
          required
        />
        <Textarea
          label="Business model"
          rows={3}
          value={values.businessModel}
          onChange={(e) => setField("businessModel", e.target.value)}
          placeholder="How does the startup make money?"
          required
        />
        <Textarea
          label="Target market"
          rows={3}
          value={values.targetMarket}
          onChange={(e) => setField("targetMarket", e.target.value)}
          placeholder="Who are the target customers?"
          required
        />
      </div>

      <div>
        <span className="mb-2 block text-sm font-medium text-slate-700">
          Social media links
        </span>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {SOCIAL_PLATFORMS.map(({ key, label }) => (
            <Input
              key={key}
              type="url"
              placeholder={label}
              value={values.socialLinks[key] ?? ""}
              onChange={(e) => setSocial(key, e.target.value)}
            />
          ))}
        </div>
      </div>

      <Input
        label="Achievements (comma separated)"
        value={csv(values.achievements)}
        onChange={(e) => setField("achievements", fromCsv(e.target.value))}
        placeholder="Winner of XYZ Award, $1M raised, 10k+ users"
      />

      <FoundersEditor
        founders={values.founders}
        onChange={(founders) => setField("founders", founders)}
      />

      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          checked={values.isActive}
          onChange={(e) => setField("isActive", e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        />
        Mark as active startup
      </label>

      <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          loading={submitting}
          leftIcon={<Save className="h-4 w-4" />}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
