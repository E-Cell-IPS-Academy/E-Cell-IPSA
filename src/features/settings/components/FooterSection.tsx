import { Settings } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Textarea,
} from "@/shared/ui";
import type { SiteSettings } from "../types";

interface FooterSectionProps {
  settings: SiteSettings;
  onChange: (patch: Partial<SiteSettings>) => void;
}

/** Footer text and copyright year. */
export function FooterSection({ settings, onChange }: FooterSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-indigo-600" />
            Footer
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          label="Footer text"
          rows={2}
          value={settings.footerText}
          onChange={(e) => onChange({ footerText: e.target.value })}
          placeholder="Footer text content…"
        />
        <Input
          label="Copyright year"
          className="max-w-xs"
          value={settings.copyrightYear}
          onChange={(e) => onChange({ copyrightYear: e.target.value })}
          placeholder="2024"
        />
      </CardContent>
    </Card>
  );
}
