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
  competitionRegistrationsToCsv,
  downloadCsv,
  listCompetitionRegistrations,
} from "./ignitexService";
import { IGNITEX_COMPETITIONS, IGNITEX_EVENT_NAME } from "./types";
import type { IgnitexCompetitionRegistration } from "./types";

export function IgnitexCompetitionAdminPage() {
  const toast = useToast();
  const [registrations, setRegistrations] = useState<
    IgnitexCompetitionRegistration[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [eventType, setEventType] = useState<string>("all");

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setRegistrations(await listCompetitionRegistrations());
    } catch (e) {
      const err = e as { code?: string; message?: string };
      setLoadError(
        err?.code === "permission-denied"
          ? "Permission denied reading registrations. Update your Firestore rules to allow admins to read the ignitexCompetitionRegistrations collection."
          : `Failed to load registrations: ${err?.message ?? "unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: registrations.length };
    for (const c of IGNITEX_COMPETITIONS)
      map[c.eventType] = registrations.filter(
        (r) => r.eventType === c.eventType
      ).length;
    return map;
  }, [registrations]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return registrations.filter((r) => {
      if (eventType !== "all" && r.eventType !== eventType) return false;
      if (!term) return true;
      return (r.members ?? []).some(
        (m) =>
          m.name.toLowerCase().includes(term) ||
          m.email.toLowerCase().includes(term) ||
          m.enrollmentNo.toLowerCase().includes(term) ||
          m.phone.includes(term)
      );
    });
  }, [registrations, search, eventType]);

  const handleDownload = () => {
    if (filtered.length === 0) {
      toast.info("No registrations to export yet");
      return;
    }
    const label =
      eventType === "all"
        ? "all"
        : IGNITEX_COMPETITIONS.find((c) => c.eventType === eventType)?.id ??
          "competition";
    downloadCsv(
      competitionRegistrationsToCsv(filtered),
      `ignitex-competition-${label}-${new Date().toISOString().split("T")[0]}.csv`
    );
    toast.success("CSV downloaded");
  };

  return (
    <div>
      <PageHeader
        title={`${IGNITEX_EVENT_NAME} — Competitions`}
        description="Team registrations for IPL Auction and Venture 120."
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
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={eventType === "all" ? "primary" : "outline"}
            onClick={() => setEventType("all")}
          >
            All ({counts.all})
          </Button>
          {IGNITEX_COMPETITIONS.map((c) => (
            <Button
              key={c.id}
              size="sm"
              variant={eventType === c.eventType ? "primary" : "outline"}
              onClick={() => setEventType(c.eventType)}
            >
              {c.title} ({counts[c.eventType] ?? 0})
            </Button>
          ))}
        </div>
      </Card>

      <Card className="mb-6 p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-9"
            placeholder="Search by member name, email, enrollment no. or phone…"
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
          description="Team registrations will show up here."
        />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Competition</TH>
              <TH>Member 1 (Leader)</TH>
              <TH>Member 2</TH>
              <TH>College</TH>
              <TH>Registered</TH>
            </TR>
          </THead>
          <TBody>
            {filtered.map((r) => (
              <TR key={r.id}>
                <TD>
                  <Badge tone="info">{r.competitionTitle}</Badge>
                </TD>
                {[0, 1].map((i) => {
                  const m = r.members?.[i];
                  return (
                    <TD key={i}>
                      {m ? (
                        <>
                          <div className="font-medium text-slate-900">
                            {m.name}
                          </div>
                          <div className="text-xs text-slate-400">
                            {m.year} · {m.branch} · {m.enrollmentNo}
                          </div>
                          <div className="text-xs text-slate-400">
                            {m.email} · {m.phone} · {m.gender}
                          </div>
                        </>
                      ) : (
                        "—"
                      )}
                    </TD>
                  );
                })}
                <TD className="text-xs text-slate-500">
                  {Array.from(
                    new Set((r.members ?? []).map((m) => m.collegeName))
                  ).join(", ")}
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
