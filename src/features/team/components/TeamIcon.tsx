import type { ComponentType } from "react";
import {
  Activity,
  Award,
  BookOpen,
  Briefcase,
  Camera,
  Code,
  Cpu,
  Crown,
  Database,
  FileText,
  Flag,
  Globe,
  Heart,
  Layers,
  Lightbulb,
  Megaphone,
  Music,
  Palette,
  PenTool,
  Rocket,
  Settings,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Wrench,
  Zap,
} from "lucide-react";

const ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  Users,
  Crown,
  Star,
  Shield,
  Award,
  Briefcase,
  Code,
  Cpu,
  Database,
  Megaphone,
  Palette,
  PenTool,
  Rocket,
  Target,
  TrendingUp,
  Zap,
  Heart,
  Music,
  Camera,
  BookOpen,
  FileText,
  Settings,
  Wrench,
  Lightbulb,
  Flag,
  Globe,
  Activity,
  Sparkles,
  Layers,
};

interface TeamIconProps {
  name: string;
  className?: string;
}

/** Renders a category icon by name, falling back to the Users icon. */
export function TeamIcon({ name, className }: TeamIconProps) {
  const Icon = ICON_MAP[name] ?? Users;
  return <Icon className={className} />;
}
