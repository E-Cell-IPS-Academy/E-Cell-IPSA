import { Type } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Input } from "@/shared/ui";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { SiteSettings } from "../types";

interface BrandingSectionProps {
  settings: SiteSettings;
  onChange: (patch: Partial<SiteSettings>) => void;
  onError?: (message: string) => void;
}

/** Site name, tagline, logo, and favicon. */
export function BrandingSection({
  settings,
  onChange,
  onError,
}: BrandingSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="flex items-center gap-2">
            <Type className="h-5 w-5 text-indigo-600" />
            Branding
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Site name"
            value={settings.siteName}
            onChange={(e) => onChange({ siteName: e.target.value })}
            placeholder="E-Cell IPSA"
          />
          <Input
            label="Tagline"
            value={settings.tagline}
            onChange={(e) => onChange({ tagline: e.target.value })}
            placeholder="Empowering Entrepreneurs"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <span className="block text-sm font-medium text-slate-700">
              Logo
            </span>
            <ImageUploader
              label="Upload logo"
              value={settings.logo}
              folder="site"
              onUploaded={(url) => onChange({ logo: url })}
              onError={onError}
            />
            <Input
              value={settings.logo}
              onChange={(e) => onChange({ logo: e.target.value })}
              placeholder="or paste image URL"
            />
          </div>

          <div className="space-y-1.5">
            <span className="block text-sm font-medium text-slate-700">
              Favicon
            </span>
            <ImageUploader
              label="Upload favicon"
              value={settings.favicon}
              folder="site"
              onUploaded={(url) => onChange({ favicon: url })}
              onError={onError}
            />
            <Input
              value={settings.favicon}
              onChange={(e) => onChange({ favicon: e.target.value })}
              placeholder="or paste image URL"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
