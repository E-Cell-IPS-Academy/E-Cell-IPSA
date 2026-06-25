import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Save } from "lucide-react";
import { Button, Input, Select, Textarea } from "@/shared/ui";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type {
  TeamCategory,
  TeamMemberFormValues,
  TeamSocialLinks,
} from "../types";

interface TeamMemberFormProps {
  initialValues: TeamMemberFormValues;
  categories: TeamCategory[];
  submitLabel: string;
  submitting?: boolean;
  onSubmit: (values: TeamMemberFormValues) => void;
  onCancel: () => void;
  onError?: (message: string) => void;
}

/** Create / edit form for a team member. Owns its own field state. */
export function TeamMemberForm({
  initialValues,
  categories,
  submitLabel,
  submitting = false,
  onSubmit,
  onCancel,
  onError,
}: TeamMemberFormProps) {
  const [values, setValues] = useState<TeamMemberFormValues>(initialValues);

  const setField = <K extends keyof TeamMemberFormValues>(
    key: K,
    value: TeamMemberFormValues[K]
  ) => setValues((prev) => ({ ...prev, [key]: value }));

  const setSocial = (key: keyof TeamSocialLinks, value: string) =>
    setValues((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [key]: value },
    }));

  const handleOrder = (e: ChangeEvent<HTMLInputElement>) =>
    setField("order", parseInt(e.target.value, 10) || 0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  const leadCategoryName = categories.find(
    (c) => c.id === values.category
  )?.name;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <ImageUploader
        label="Photo"
        value={values.photo}
        folder="team"
        onUploaded={(url, publicId) => {
          setField("photo", url);
          setField("photoPublicId", publicId);
        }}
        onError={onError}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Name"
          value={values.name}
          onChange={(e) => setField("name", e.target.value)}
          placeholder="Full name"
          required
        />
        <Input
          label="Position / Role"
          value={values.position}
          onChange={(e) => setField("position", e.target.value)}
          placeholder="e.g. Technical Head"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Select
          label="Category"
          value={values.category}
          onChange={(e) => setField("category", e.target.value)}
          required
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <Select
          label="Team lead"
          value={values.isLead ? "yes" : "no"}
          onChange={(e) => setField("isLead", e.target.value === "yes")}
        >
          <option value="no">Not a lead</option>
          <option value="yes">Lead</option>
        </Select>
        <Select
          label="Status"
          value={values.isActive ? "active" : "inactive"}
          onChange={(e) => setField("isActive", e.target.value === "active")}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      </div>

      {values.isLead && values.category && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Only one lead per category. Saving this member as lead will remove
          lead status from any existing lead in{" "}
          <strong>{leadCategoryName}</strong>.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Email"
          type="email"
          value={values.email}
          onChange={(e) => setField("email", e.target.value)}
          placeholder="member@email.com"
        />
        <Input
          label="Order / Priority"
          type="number"
          min={0}
          value={values.order}
          onChange={handleOrder}
          hint="Lower numbers appear first"
        />
      </div>

      <Textarea
        label="Bio"
        rows={3}
        value={values.bio}
        onChange={(e) => setField("bio", e.target.value)}
        placeholder="Short bio about the team member…"
      />

      <div>
        <span className="mb-2 block text-sm font-medium text-slate-700">
          Social links
        </span>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Input
            type="url"
            value={values.socialLinks.linkedin ?? ""}
            onChange={(e) => setSocial("linkedin", e.target.value)}
            placeholder="LinkedIn URL"
          />
          <Input
            type="url"
            value={values.socialLinks.instagram ?? ""}
            onChange={(e) => setSocial("instagram", e.target.value)}
            placeholder="Instagram URL"
          />
          <Input
            type="url"
            value={values.socialLinks.github ?? ""}
            onChange={(e) => setSocial("github", e.target.value)}
            placeholder="GitHub URL"
          />
          <Input
            type="url"
            value={values.socialLinks.twitter ?? ""}
            onChange={(e) => setSocial("twitter", e.target.value)}
            placeholder="Twitter / X URL"
          />
        </div>
      </div>

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
