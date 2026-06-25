import {
  ExternalLink,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";
import type { ComponentType } from "react";
import { Card, CardContent, CardHeader, CardTitle, Input } from "@/shared/ui";
import { SOCIAL_FIELDS } from "../types";
import type { SiteSettings, SocialLinks } from "../types";

interface SocialLinksSectionProps {
  settings: SiteSettings;
  onChange: (patch: Partial<SiteSettings>) => void;
}

const ICONS: Record<
  keyof SocialLinks,
  ComponentType<{ className?: string }>
> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
};

/** External social profile URLs. */
export function SocialLinksSection({
  settings,
  onChange,
}: SocialLinksSectionProps) {
  const updateLink = (key: keyof SocialLinks, value: string) =>
    onChange({ socialLinks: { ...settings.socialLinks, [key]: value } });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-indigo-600" />
            Social links
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {SOCIAL_FIELDS.map(({ key, placeholder }) => {
          const Icon = ICONS[key];
          return (
            <div key={key} className="relative">
              <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                className="pl-9"
                value={settings.socialLinks[key]}
                onChange={(e) => updateLink(key, e.target.value)}
                placeholder={placeholder}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
