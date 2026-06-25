import {
  Crown,
  Edit,
  Github,
  Instagram,
  Linkedin,
  Trash2,
  Twitter,
} from "lucide-react";
import { Badge, Button, Card } from "@/shared/ui";
import { TeamIcon } from "./TeamIcon";
import type { TeamMember } from "../types";

interface TeamMemberCardProps {
  member: TeamMember;
  categoryName: string;
  categoryIcon: string;
  onEdit: (member: TeamMember) => void;
  onDelete: (member: TeamMember) => void;
}

const SOCIAL = [
  { key: "linkedin", Icon: Linkedin, label: "LinkedIn" },
  { key: "instagram", Icon: Instagram, label: "Instagram" },
  { key: "github", Icon: Github, label: "GitHub" },
  { key: "twitter", Icon: Twitter, label: "Twitter" },
] as const;

/** Single team member tile for the admin grid. */
export function TeamMemberCard({
  member,
  categoryName,
  categoryIcon,
  onEdit,
  onDelete,
}: TeamMemberCardProps) {
  return (
    <Card className="flex flex-col p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="h-14 w-14 rounded-full object-cover ring-1 ring-slate-200"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-500">
            {member.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold text-slate-900">
              {member.name}
            </h3>
            {member.isLead && (
              <Badge tone="warning">
                <Crown className="mr-1 h-3 w-3" />
                Lead
              </Badge>
            )}
          </div>
          <p className="truncate text-sm text-slate-500">{member.position}</p>
        </div>
        <Badge tone={member.isActive ? "success" : "danger"}>
          {member.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-sm text-slate-600">
        <TeamIcon name={categoryIcon} className="h-4 w-4 text-slate-400" />
        <span className="truncate">{categoryName}</span>
        <span className="ml-auto font-mono text-xs text-slate-400">
          #{member.order}
        </span>
      </div>

      {member.bio && (
        <p className="mt-2 line-clamp-2 text-sm text-slate-500">{member.bio}</p>
      )}

      <div className="mt-3 flex items-center gap-3">
        {SOCIAL.map(({ key, Icon, label }) =>
          member.socialLinks?.[key] ? (
            <a
              key={key}
              href={member.socialLinks[key]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 transition-colors hover:text-indigo-600"
              aria-label={label}
            >
              <Icon className="h-4 w-4" />
            </a>
          ) : null
        )}
      </div>

      <div className="mt-4 flex items-center gap-1 border-t border-slate-100 pt-3">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Edit className="h-4 w-4" />}
          onClick={() => onEdit(member)}
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto text-red-600 hover:bg-red-50"
          leftIcon={<Trash2 className="h-4 w-4" />}
          onClick={() => onDelete(member)}
        >
          Delete
        </Button>
      </div>
    </Card>
  );
}
