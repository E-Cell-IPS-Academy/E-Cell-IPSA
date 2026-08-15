import { Badge } from "@/shared/ui";
import { EventStatusBadge } from "./EventStatusBadge";
import type { EventItem } from "../types";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-slate-800">{value || "—"}</dd>
    </div>
  );
}

/** Read-only details view for an event (shown in the modal). */
export function EventDetails({ event }: { event: EventItem }) {
  return (
    <div className="space-y-6">
      {event.image && (
        <img
          src={event.image}
          alt={event.title}
          className="h-56 w-full rounded-lg object-cover"
        />
      )}

      <div className="flex items-center gap-2">
        <EventStatusBadge status={event.status} />
        {event.category && <Badge>{event.category}</Badge>}
      </div>

      <p className="text-sm text-slate-600">{event.description}</p>

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Date & time"
          value={`${event.date}${event.time ? ` · ${event.time}` : ""}`}
        />
        <Field label="Location" value={event.location} />
        <Field
          label="Attendees"
          value={`${event.attendees} / ${event.maxAttendees}`}
        />
        <Field label="Price" value={event.price ? `₹${event.price}` : "Free"} />
      </dl>

      {event.tags && event.tags.length > 0 && (
        <div>
          <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
            Tags
          </p>
          <div className="flex flex-wrap gap-1.5">
            {event.tags.map((tag) => (
              <Badge key={tag} tone="info">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {event.speakers && event.speakers.length > 0 && (
        <div>
          <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
            Speakers
          </p>
          <div className="space-y-3">
            {event.speakers.map((speaker, i) => (
              <div key={i} className="rounded-lg border border-slate-200 p-3">
                <p className="text-sm font-medium text-slate-900">
                  {speaker.name}
                </p>
                <p className="text-xs text-indigo-600">{speaker.title}</p>
                {speaker.bio && (
                  <p className="mt-1 text-sm text-slate-500">{speaker.bio}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
