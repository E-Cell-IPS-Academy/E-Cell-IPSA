import { Award } from "lucide-react";
import { Badge } from "@/shared/ui";
import { StartupStatusBadge } from "./StartupStatusBadge";
import type { Startup } from "../types";

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

function Block({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="mb-1 text-xs uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="text-sm text-slate-600">{value}</p>
    </div>
  );
}

/** Read-only details view for a startup (shown in the modal). */
export function StartupDetails({ startup }: { startup: Startup }) {
  return (
    <div className="space-y-6">
      {startup.coverImage && (
        <img
          src={startup.coverImage}
          alt={startup.name}
          className="h-56 w-full rounded-lg object-cover"
        />
      )}

      <div className="flex items-start gap-4">
        {startup.logo && (
          <img
            src={startup.logo}
            alt={`${startup.name} logo`}
            className="h-16 w-16 rounded-lg border border-slate-200 object-cover"
          />
        )}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StartupStatusBadge status={startup.status} />
            {startup.industry && <Badge>{startup.industry}</Badge>}
          </div>
          <p className="mt-2 text-sm text-slate-600">
            {startup.shortDescription}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Founded" value={String(startup.foundedYear)} />
        <Field label="Location" value={startup.location} />
        <Field label="Funding stage" value={startup.fundingStage} />
        <Field
          label="Funding amount"
          value={
            startup.fundingAmount
              ? `$${startup.fundingAmount.toLocaleString()}`
              : "—"
          }
        />
        <Field
          label="Team size"
          value={
            startup.employeeCount ? `${startup.employeeCount} employees` : "—"
          }
        />
        <Field label="Website" value={startup.website ?? ""} />
        <Field label="Featured date" value={startup.featuredDate ?? ""} />
      </dl>

      <Block label="Description" value={startup.description} />
      <Block label="Problem" value={startup.problem} />
      <Block label="Solution" value={startup.solution} />
      <Block label="Business model" value={startup.businessModel} />
      <Block label="Target market" value={startup.targetMarket} />

      {startup.founders.length > 0 && (
        <div>
          <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
            Founders
          </p>
          <div className="space-y-3">
            {startup.founders.map((founder, i) => (
              <div key={i} className="rounded-lg border border-slate-200 p-3">
                <p className="text-sm font-medium text-slate-900">
                  {founder.name}
                </p>
                <p className="text-xs text-indigo-600">{founder.position}</p>
                {founder.bio && (
                  <p className="mt-1 text-sm text-slate-500">{founder.bio}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {startup.achievements.length > 0 && (
        <div>
          <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
            Achievements
          </p>
          <ul className="space-y-1.5">
            {startup.achievements.map((achievement, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-sm text-slate-600"
              >
                <Award className="h-4 w-4 text-emerald-500" />
                {achievement}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
