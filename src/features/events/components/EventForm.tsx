import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { Button, Input, Select, Textarea } from "@/shared/ui";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { EVENT_CATEGORIES, EVENT_STATUSES } from "../types";
import type { EventFormValues, Speaker } from "../types";

interface EventFormProps {
  initialValues: EventFormValues;
  submitLabel: string;
  submitting?: boolean;
  onSubmit: (values: EventFormValues) => void;
  onCancel: () => void;
  onError?: (message: string) => void;
}

const csv = (list?: string[]) => (list ?? []).join(", ");
const fromCsv = (value: string) =>
  value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

/** Create / edit form for an event. Owns its own field state. */
export function EventForm({
  initialValues,
  submitLabel,
  submitting = false,
  onSubmit,
  onCancel,
  onError,
}: EventFormProps) {
  const [values, setValues] = useState<EventFormValues>(initialValues);

  const setField = <K extends keyof EventFormValues>(
    key: K,
    value: EventFormValues[K]
  ) => setValues((prev) => ({ ...prev, [key]: value }));

  const handleNumber = (e: ChangeEvent<HTMLInputElement>) =>
    setField(
      e.target.name as keyof EventFormValues,
      (parseInt(e.target.value, 10) || 0) as never
    );

  const addSpeaker = () =>
    setField("speakers", [
      ...(values.speakers ?? []),
      { name: "", title: "", bio: "" },
    ]);

  const updateSpeaker = (index: number, field: keyof Speaker, value: string) =>
    setField(
      "speakers",
      (values.speakers ?? []).map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      )
    );

  const removeSpeaker = (index: number) =>
    setField(
      "speakers",
      (values.speakers ?? []).filter((_, i) => i !== index)
    );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <ImageUploader
        label="Event image"
        value={values.image}
        folder="events"
        onUploaded={(url, publicId) => {
          setField("image", url);
          setField("imagePublicId", publicId);
        }}
        onError={onError}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Title"
          name="title"
          value={values.title}
          onChange={(e) => setField("title", e.target.value)}
          placeholder="Enter event title"
          required
        />
        <Select
          label="Category"
          value={values.category}
          onChange={(e) => setField("category", e.target.value)}
          required
        >
          <option value="">Select category</option>
          {EVENT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </div>

      <Textarea
        label="Description"
        value={values.description}
        onChange={(e) => setField("description", e.target.value)}
        placeholder="Enter event description"
        required
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Input
          label="Date"
          type="date"
          value={values.date}
          onChange={(e) => setField("date", e.target.value)}
          required
        />
        <Input
          label="Time"
          type="time"
          value={values.time}
          onChange={(e) => setField("time", e.target.value)}
          required
        />
        <Select
          label="Status"
          value={values.status}
          onChange={(e) =>
            setField("status", e.target.value as EventFormValues["status"])
          }
        >
          {EVENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </Select>
      </div>

      <Input
        label="Location"
        value={values.location}
        onChange={(e) => setField("location", e.target.value)}
        placeholder="Enter event location"
        required
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Input
          label="Current attendees"
          type="number"
          name="attendees"
          min={0}
          value={values.attendees}
          onChange={handleNumber}
        />
        <Input
          label="Max attendees"
          type="number"
          name="maxAttendees"
          min={1}
          value={values.maxAttendees}
          onChange={handleNumber}
          required
        />
        <Input
          label="Price (₹)"
          type="number"
          name="price"
          min={0}
          value={values.price}
          onChange={handleNumber}
          hint="0 for free"
        />
      </div>

      <Input
        label="Tags (comma separated)"
        value={csv(values.tags)}
        onChange={(e) => setField("tags", fromCsv(e.target.value))}
        placeholder="entrepreneurship, technology, innovation"
      />
      <Input
        label="Requirements (comma separated)"
        value={csv(values.requirements)}
        onChange={(e) => setField("requirements", fromCsv(e.target.value))}
        placeholder="laptop required, prior registration"
      />
      <Input
        label="Agenda (comma separated)"
        value={csv(values.agenda)}
        onChange={(e) => setField("agenda", fromCsv(e.target.value))}
        placeholder="Opening keynote, Panel discussion, Networking"
      />

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">Speakers</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={addSpeaker}
          >
            Add speaker
          </Button>
        </div>
        <div className="space-y-3">
          {(values.speakers ?? []).map((speaker, index) => (
            <div
              key={index}
              className="space-y-3 rounded-lg border border-slate-200 p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">
                  Speaker {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeSpeaker(index)}
                  className="rounded p-1 text-red-500 hover:bg-red-50"
                  aria-label="Remove speaker"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Input
                  placeholder="Speaker name"
                  value={speaker.name}
                  onChange={(e) => updateSpeaker(index, "name", e.target.value)}
                />
                <Input
                  placeholder="Title / designation"
                  value={speaker.title}
                  onChange={(e) =>
                    updateSpeaker(index, "title", e.target.value)
                  }
                />
              </div>
              <Textarea
                rows={2}
                placeholder="Short bio"
                value={speaker.bio}
                onChange={(e) => updateSpeaker(index, "bio", e.target.value)}
              />
            </div>
          ))}
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
