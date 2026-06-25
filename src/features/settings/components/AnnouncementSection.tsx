import {
  Link as LinkIcon,
  Megaphone,
  Palette,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Input } from "@/shared/ui";
import { COLOR_PRESETS } from "../types";
import type { AnnouncementBar, SiteSettings } from "../types";

interface AnnouncementSectionProps {
  settings: SiteSettings;
  onChange: (patch: Partial<SiteSettings>) => void;
}

/** Top-of-site announcement banner: toggle, text, link, and color. */
export function AnnouncementSection({
  settings,
  onChange,
}: AnnouncementSectionProps) {
  const bar = settings.announcementBar;

  const update = <K extends keyof AnnouncementBar>(
    key: K,
    value: AnnouncementBar[K]
  ) => onChange({ announcementBar: { ...bar, [key]: value } });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-indigo-600" />
            Announcement bar
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-slate-900">
              Show announcement bar
            </p>
            <p className="text-xs text-slate-500">
              Display a banner at the top of the site.
            </p>
          </div>
          <button
            type="button"
            aria-pressed={bar.enabled}
            onClick={() => update("enabled", !bar.enabled)}
            className={bar.enabled ? "text-indigo-600" : "text-slate-400"}
          >
            {bar.enabled ? (
              <ToggleRight className="h-9 w-9" />
            ) : (
              <ToggleLeft className="h-9 w-9" />
            )}
          </button>
        </div>

        {bar.enabled && (
          <div className="space-y-4">
            <div
              className="rounded-lg px-4 py-2.5 text-center text-sm font-medium text-white"
              style={{ backgroundColor: bar.bgColor }}
            >
              {bar.text || "Announcement text here…"}
              {bar.link && (
                <span className="ml-2 underline opacity-80">Learn more</span>
              )}
            </div>

            <Input
              label="Text"
              value={bar.text}
              onChange={(e) => update("text", e.target.value)}
              placeholder="Announcement message…"
            />

            <div className="space-y-1.5">
              <span className="block text-sm font-medium text-slate-700">
                Link (optional)
              </span>
              <div className="relative">
                <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  className="pl-9"
                  value={bar.link}
                  onChange={(e) => update("link", e.target.value)}
                  placeholder="https://…"
                />
              </div>
            </div>

            <div className="space-y-2">
              <span className="block text-sm font-medium text-slate-700">
                Background color
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-label={`Use color ${color}`}
                    onClick={() => update("bgColor", color)}
                    className={`h-8 w-8 rounded-lg border-2 transition-transform hover:scale-110 ${
                      bar.bgColor === color
                        ? "border-slate-900"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
                <div className="ml-2 flex items-center gap-2">
                  <Palette className="h-4 w-4 text-slate-400" />
                  <input
                    type="color"
                    value={bar.bgColor}
                    onChange={(e) => update("bgColor", e.target.value)}
                    className="h-8 w-8 cursor-pointer rounded-lg border border-slate-300 bg-transparent"
                  />
                  <Input
                    className="w-28"
                    value={bar.bgColor}
                    onChange={(e) => update("bgColor", e.target.value)}
                    placeholder="#7c3aed"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
