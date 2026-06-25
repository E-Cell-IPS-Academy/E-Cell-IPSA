import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link as LinkIcon, Save } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Textarea,
} from "@/shared/ui";
import { HeroBackgroundFields } from "./HeroBackgroundFields";
import type { HeroFormValues } from "../types";

interface HeroFormProps {
  initialValues: HeroFormValues;
  submitting?: boolean;
  onSubmit: (values: HeroFormValues) => void;
  onChange?: (values: HeroFormValues) => void;
  onError?: (message: string) => void;
}

/** Editor form for the single hero document. Owns its own field state. */
export function HeroForm({
  initialValues,
  submitting = false,
  onSubmit,
  onChange,
  onError,
}: HeroFormProps) {
  const [values, setValues] = useState<HeroFormValues>(initialValues);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const setField = <K extends keyof HeroFormValues>(
    key: K,
    value: HeroFormValues[K]
  ) => {
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      onChange?.(next);
      return next;
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Title"
              value={values.title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="Main heading"
            />
            <Input
              label="Subtitle"
              value={values.subtitle}
              onChange={(e) => setField("subtitle", e.target.value)}
              placeholder="Supporting text"
            />
          </div>

          <Textarea
            label="Description"
            rows={3}
            value={values.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Hero description…"
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="CTA button text"
              value={values.ctaText}
              onChange={(e) => setField("ctaText", e.target.value)}
              placeholder="e.g. Get Started"
            />
            <div className="relative">
              <Input
                label="CTA link"
                className="pl-9"
                value={values.ctaLink}
                onChange={(e) => setField("ctaLink", e.target.value)}
                placeholder="/events or https://…"
              />
              <LinkIcon className="pointer-events-none absolute left-3 top-[34px] h-4 w-4 text-slate-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Background</CardTitle>
        </CardHeader>
        <CardContent>
          <HeroBackgroundFields
            values={values}
            onChange={setField}
            onError={onError}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          type="submit"
          loading={submitting}
          leftIcon={<Save className="h-4 w-4" />}
        >
          Save hero
        </Button>
      </div>
    </form>
  );
}
