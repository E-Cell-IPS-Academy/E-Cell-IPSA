"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Search, Users } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Spinner,
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/shared/ui";
import { useToast } from "@/shared/feedback";
import {
  downloadCsv,
  getIgnitexSettings,
  listSpeakerRegistrations,
  registrationsToCsv,
  saveIgnitexSettings,
} from "./ignitexService";
import {
  IGNITEX_EVENT_NAME,
  IGNITEX_EVENT_STATUSES,
  IGNITEX_STATUS_LABEL,
} from "./types";
import type { IgnitexEventStatus, IgnitexSpeakerRegistration } from "./types";

export function IgnitexAdminPage() {
  const toast = useToast();
  const [registrations, setRegistrations] = useState<
    IgnitexSpeakerRegistration[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [eventStatus, setEventStatus] =
    useState<IgnitexEventStatus>("started");
  const [saving, setSaving] = useState(false);

  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    const [regsResult, settingsResult] = await Promise.allSettled([
      listSpeakerRegistrations(),
      getIgnitexSettings(),
    ]);
    if (regsResult.status === "fulfilled") {
      setRegistrations(regsResult.value);
    } else {
      const err = regsResult.reason as { code?: string; message?: string };
      setLoadError(
        err?.code === "permission-denied"
          ? "Permission denied reading registrations. Update your Firestore rules to allow admins to read the ignitexRegistrations collection."
          : `Failed to load registrations: ${err?.message ?? "unknown error"}`
      );
    }
    if (settingsResult.status === "fulfilled") {
      const settings = settingsResult.value;
      setRegistrationOpen(settings.registrationOpen);
      setEventStatus(settings.eventStatus ?? "started");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return registrations.filter(
      (r) =>
        r.name.toLowerCase().includes(term) ||
        r.email.toLowerCase().includes(term) ||
        r.enrollmentNo.toLowerCase().includes(term) ||
        r.phone.includes(term)
    );
  }, [registrations, search]);

  const persist = async (
    next: { registrationOpen: boolean; eventStatus: IgnitexEventStatus },
    successMessage: string
  ) => {
    setSaving(true);
    try {
      await saveIgnitexSettings(next);
      toast.success(successMessage);
      return true;
    } catch {
      toast.error(
        "Failed to save. Check that your Firestore rules allow admins to write settings/ignitex."
      );
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (next: IgnitexEventStatus) => {
    if (next === eventStatus || saving) return;
    const previous = eventStatus;
    setEventStatus(next);
    const ok = await persist(
      { registrationOpen, eventStatus: next },
      `Event status set to "${IGNITEX_STATUS_LABEL[next]}"`
    );
    if (!ok) setEventStatus(previous);
  };

  const handleToggleRegistration = async () => {
    if (saving) return;
    const next = !registrationOpen;
    setRegistrationOpen(next);
    const ok = await persist(
      { registrationOpen: next, eventStatus },
      `Registration ${next ? "enabled" : "disabled"}`
    );
    if (!ok) setRegistrationOpen(!next);
  };

  const handleDownload = () => {
    if (registrations.length === 0) {
      toast.info("No registrations to export yet");
      return;
    }
    downloadCsv(
      registrationsToCsv(filtered),
      `ignitex-speaker-session-${new Date().toISOString().split("T")[0]}.csv`
    );
    toast.success("CSV downloaded");
  };

  return (
    <div>
      <PageHeader
        title={`${IGNITEX_EVENT_NAME} — Speaker Session`}
        description="Control registration and review submitted responses."
        actions={
          <Button
            leftIcon={<Download className="h-4 w-4" />}
            onClick={handleDownload}
          >
            Download CSV
          </Button>
        }
      />

      <Card className="mb-6 p-4">
        <p className="mb-4 text-sm font-medium text-slate-700">
          Registration controls
        </p>
        <div className="mt-4">
          <p className="mb-2 text-xs text-slate-500">Event status</p>
          <div className="flex flex-wrap gap-2">
            {IGNITEX_EVENT_STATUSES.map((s) => (
              <Button
                key={s}
                size="sm"
                variant={eventStatus === s ? "primary" : "outline"}
                loading={saving && eventStatus === s}
                onClick={() => handleStatusChange(s)}
              >
                {IGNITEX_STATUS_LABEL[s]}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button
            size="sm"
            variant={registrationOpen ? "primary" : "outline"}
            onClick={handleToggleRegistration}
          >
            Registration: {registrationOpen ? "Enabled" : "Disabled"}
          </Button>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Changes save instantly. The public form shows &quot;opens soon&quot;
          while <strong>Upcoming</strong>, the live form while{" "}
          <strong>Started</strong>, and &quot;registration ended&quot; once{" "}
          <strong>Ended</strong>. Disabling registration also closes the form.
        </p>
      </Card>

      <Card className="mb-6 p-4">
        <p className="text-2xl font-semibold text-slate-900">
          {registrations.length}
        </p>
        <p className="text-xs text-slate-500">Total registrations</p>
      </Card>

      <Card className="mb-6 p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-9"
            placeholder="Search by name, email, enrollment no. or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </Card>

      {loadError && (
        <Card className="mb-6 border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {loadError}
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="h-10 w-10" />}
          title="No registrations found"
          description="Speaker session registrations will show up here."
        />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Name</TH>
              <TH>Year / Branch</TH>
              <TH>Enrollment</TH>
              <TH>Contact</TH>
              <TH>Gender</TH>
              <TH>College</TH>
              <TH>Registered</TH>
            </TR>
          </THead>
          <TBody>
            {filtered.map((r) => (
              <TR key={r.id}>
                <TD className="font-medium text-slate-900">{r.name}</TD>
                <TD>
                  <div>{r.year}</div>
                  <div className="text-xs text-slate-400">{r.branch}</div>
                </TD>
                <TD>{r.enrollmentNo}</TD>
                <TD>
                  <div>{r.email}</div>
                  <div className="text-xs text-slate-400">{r.phone}</div>
                </TD>
                <TD>{r.gender}</TD>
                <TD>
                  <Badge tone="info">{r.collegeName}</Badge>
                </TD>
                <TD className="text-xs text-slate-500">
                  {r.createdAt ? r.createdAt.toDate().toLocaleString() : "—"}
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}
