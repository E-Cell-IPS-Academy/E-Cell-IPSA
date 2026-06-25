import { CheckCircle2, ExternalLink, Shield, Trash2, User } from "lucide-react";
import { Badge, Button } from "@/shared/ui";
import { UserStatusBadge, UserTypeBadge } from "./UserBadges";
import type { UserRecord } from "../types";

interface UserDetailsProps {
  user: UserRecord;
  onToggleVerification: (user: UserRecord) => void;
  onDelete: (user: UserRecord) => void;
}

function Field({ label, value }: { label: string; value?: string | number }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-slate-800">{value || "—"}</dd>
    </div>
  );
}

function Chips({ label, items }: { label: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <Badge key={i} tone="info">
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function Link({ href, label }: { href?: string; label: string }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
    >
      <span className="flex-1">{label}</span>
      <ExternalLink className="h-4 w-4 text-slate-400" />
    </a>
  );
}

/** Read-only details view for a user (shown in the modal). */
export function UserDetails({
  user,
  onToggleVerification,
  onDelete,
}: UserDetailsProps) {
  const isStudent = user.userType === "student";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="h-14 w-14 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <User className="h-6 w-6" />
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold text-slate-900">
            {user.name}
          </p>
          <p className="truncate text-sm text-slate-500">{user.email}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <UserTypeBadge type={user.userType} />
        <UserStatusBadge status={user.status} />
        {user.isVerified && (
          <Badge tone="success">
            <Shield className="mr-1 h-3 w-3" /> Verified
          </Badge>
        )}
      </div>

      {user.bio && <p className="text-sm text-slate-600">{user.bio}</p>}

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Phone" value={user.phone} />
        <Field label="Location" value={user.location} />
        <Field
          label="Joined"
          value={
            user.joinedDate
              ? new Date(user.joinedDate).toLocaleDateString()
              : ""
          }
        />
        <Field
          label="Last login"
          value={
            user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : ""
          }
        />
        {isStudent ? (
          <>
            <Field label="Institution" value={user.institution} />
            <Field label="Course" value={user.course} />
            <Field label="Year" value={user.year} />
            <Field label="Student ID" value={user.studentId} />
            <Field label="GPA" value={user.gpa} />
          </>
        ) : (
          <>
            <Field label="Company" value={user.company} />
            <Field label="Position" value={user.position} />
            <Field label="Experience" value={user.experience} />
          </>
        )}
      </dl>

      <Chips label="Skills" items={user.skills} />
      <Chips label="Interests" items={user.interests} />
      <Chips label="Achievements" items={user.achievements} />
      <Chips label="Certifications" items={user.certifications} />

      {(user.linkedin ||
        user.github ||
        user.portfolio ||
        user.twitter ||
        user.instagram ||
        user.facebook) && (
        <div>
          <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
            Social & portfolio
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Link href={user.linkedin} label="LinkedIn" />
            <Link href={user.github} label="GitHub" />
            <Link href={user.portfolio} label="Portfolio" />
            <Link href={user.twitter} label="Twitter" />
            <Link href={user.instagram} label="Instagram" />
            <Link href={user.facebook} label="Facebook" />
          </div>
        </div>
      )}

      {user.projects?.length > 0 && (
        <div>
          <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
            Projects
          </p>
          <div className="space-y-3">
            {user.projects.map((project, i) => (
              <div key={i} className="rounded-lg border border-slate-200 p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-slate-900">
                    {project.name}
                  </p>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700"
                      aria-label="Open project"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                {project.description && (
                  <p className="mt-1 text-sm text-slate-500">
                    {project.description}
                  </p>
                )}
                {project.technologies?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {project.technologies.map((tech, ti) => (
                      <Badge key={ti}>{tech}</Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
          Platform activity
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Events attended", value: user.eventsAttended || 0 },
            { label: "Blogs read", value: user.blogsRead || 0 },
            {
              label: "Profile complete",
              value: `${user.profileCompletion || 0}%`,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-slate-200 p-3 text-center"
            >
              <p className="text-lg font-semibold text-slate-900">
                {stat.value}
              </p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
        <Button
          variant="outline"
          leftIcon={
            user.isVerified ? (
              <Shield className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )
          }
          onClick={() => onToggleVerification(user)}
        >
          {user.isVerified ? "Remove verification" : "Verify user"}
        </Button>
        <Button
          variant="danger"
          leftIcon={<Trash2 className="h-4 w-4" />}
          onClick={() => onDelete(user)}
        >
          Delete user
        </Button>
      </div>
    </div>
  );
}
