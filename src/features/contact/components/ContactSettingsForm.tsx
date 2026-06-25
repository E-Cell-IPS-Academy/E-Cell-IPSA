import { useState } from "react";
import type { FormEvent } from "react";
import { Save } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Textarea,
} from "@/shared/ui";
import { SOCIAL_FIELDS } from "../types";
import type { ContactData, SocialLinks } from "../types";

interface ContactSettingsFormProps {
  initialValues: ContactData;
  submitting?: boolean;
  onSubmit: (values: ContactData) => void;
}

/** Create / edit form for the public contact-info settings. */
export function ContactSettingsForm({
  initialValues,
  submitting = false,
  onSubmit,
}: ContactSettingsFormProps) {
  const [values, setValues] = useState<ContactData>(initialValues);

  const setField = <K extends keyof ContactData>(
    key: K,
    value: ContactData[K]
  ) => setValues((prev) => ({ ...prev, [key]: value }));

  const setSocial = (key: keyof SocialLinks, value: string) =>
    setValues((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [key]: value },
    }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Email"
              type="email"
              value={values.email}
              onChange={(e) => setField("email", e.target.value)}
              placeholder="contact@ecell.com"
            />
            <Input
              label="Phone"
              value={values.phone}
              onChange={(e) => setField("phone", e.target.value)}
              placeholder="+91 ..."
            />
          </div>
          <Textarea
            label="Address"
            rows={2}
            value={values.address}
            onChange={(e) => setField("address", e.target.value)}
            placeholder="Full address..."
          />
          <Input
            label="Google Maps embed URL"
            value={values.mapEmbedUrl}
            onChange={(e) => setField("mapEmbedUrl", e.target.value)}
            placeholder="https://www.google.com/maps/embed?..."
          />

          <label className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
            <span>
              <span className="block text-sm font-medium text-slate-900">
                Contact form
              </span>
              <span className="block text-xs text-slate-500">
                Enable or disable the public contact form
              </span>
            </span>
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              checked={values.formEnabled}
              onChange={(e) => setField("formEnabled", e.target.checked)}
            />
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {SOCIAL_FIELDS.map(({ key, label }) => (
            <Input
              key={key}
              label={label}
              value={values.socialLinks[key]}
              onChange={(e) => setSocial(key, e.target.value)}
              placeholder={label}
            />
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          type="submit"
          loading={submitting}
          leftIcon={<Save className="h-4 w-4" />}
        >
          Save settings
        </Button>
      </div>
    </form>
  );
}
