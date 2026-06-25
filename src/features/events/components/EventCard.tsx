import { Calendar, Edit, Eye, MapPin, Trash2, Users } from "lucide-react";
import { Button, Card } from "@/shared/ui";
import { EventStatusBadge } from "./EventStatusBadge";
import type { EventItem } from "../types";

interface EventCardProps {
  event: EventItem;
  onView: (event: EventItem) => void;
  onEdit: (event: EventItem) => void;
  onDelete: (event: EventItem) => void;
}

/** Single event tile for the admin grid. */
export function EventCard({ event, onView, onEdit, onDelete }: EventCardProps) {
  const fillPct = event.maxAttendees
    ? Math.min(Math.round((event.attendees / event.maxAttendees) * 100), 100)
    : 0;

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative h-40 bg-slate-100">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <Calendar className="h-10 w-10" />
          </div>
        )}
        <div className="absolute left-3 top-3">
          <EventStatusBadge status={event.status} />
        </div>
        {event.category && (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-slate-600 shadow-sm">
            {event.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 text-base font-semibold text-slate-900">
          {event.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
          {event.description}
        </p>

        <dl className="mt-3 space-y-1.5 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>
              {event.date ? new Date(event.date).toLocaleDateString() : "—"}
              {event.time ? ` · ${event.time}` : ""}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span className="line-clamp-1">{event.location || "—"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-400" />
            <span>
              {event.attendees}/{event.maxAttendees} attendees ({fillPct}%)
            </span>
          </div>
        </dl>

        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all"
            style={{ width: `${fillPct}%` }}
          />
        </div>

        <div className="mt-4 flex items-center gap-1 border-t border-slate-100 pt-3">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Eye className="h-4 w-4" />}
            onClick={() => onView(event)}
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Edit className="h-4 w-4" />}
            onClick={() => onEdit(event)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto text-red-600 hover:bg-red-50"
            leftIcon={<Trash2 className="h-4 w-4" />}
            onClick={() => onDelete(event)}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}
