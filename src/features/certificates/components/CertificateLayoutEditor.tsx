import { useEffect, useRef, useState } from "react";
import { Bold, GripVertical, Save } from "lucide-react";
import { Button, Select, Textarea } from "@/shared/ui";
import { FONT_FAMILIES, NAME_TOKEN } from "../types";
import type {
  CertFieldPlacement,
  FontFamily,
  TextAlign,
  TextBlockPlacement,
} from "../types";

interface CertificateLayoutEditorProps {
  templateUrl: string;
  /** Natural pixel width of the uploaded template — needed to scale preview font sizes correctly. */
  templateWidth: number;
  bodyTemplate: string;
  bodyPlacement: TextBlockPlacement;
  certificateIdPlacement: CertFieldPlacement;
  saving?: boolean;
  onSave: (
    bodyTemplate: string,
    bodyPlacement: TextBlockPlacement,
    certificateIdPlacement: CertFieldPlacement
  ) => void;
}

type DragTarget = "body" | "certId" | null;

const CSS_FONT_STACK: Record<FontFamily, string> = {
  helvetica: "Arial, Helvetica, sans-serif",
  times: "Georgia, 'Times New Roman', Times, serif",
  courier: "'Courier New', Courier, monospace",
};

/**
 * Drag-and-drop layout editor for the two things printed on a certificate:
 * the body paragraph (with a {{NAME}} merge token) and the certificate ID.
 *
 * All dragging and editing happens on LOCAL state only — nothing is written
 * to Firestore until "Save Layout" is clicked (writing to Firestore on every
 * pointermove used to trigger a full reload on every drag tick).
 *
 * Preview font sizes are scaled to the container's actual rendered width
 * relative to the template's natural width, so what you see here matches
 * the generated PDF (font size is defined in the template's own pixel/point
 * space, same as xPct/yPct, not the on-screen CSS pixel space).
 */
export function CertificateLayoutEditor({
  templateUrl,
  templateWidth,
  bodyTemplate,
  bodyPlacement,
  certificateIdPlacement,
  saving = false,
  onSave,
}: CertificateLayoutEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<DragTarget>(null);
  const [scale, setScale] = useState(1);

  const [localBody, setLocalBody] = useState(bodyTemplate);
  const [localBodyPlacement, setLocalBodyPlacement] =
    useState<TextBlockPlacement>(bodyPlacement);
  const [localIdPlacement, setLocalIdPlacement] = useState<CertFieldPlacement>(
    certificateIdPlacement
  );

  // Keep the preview's font sizes accurate as the container resizes
  // (window resize, sidebar collapse, etc.) by tracking its rendered width
  // relative to the template's natural pixel width.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !templateWidth) return;

    const updateScale = () => {
      const renderedWidth = el.getBoundingClientRect().width;
      if (renderedWidth > 0) setScale(renderedWidth / templateWidth);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, [templateWidth]);

  const pointerToPct = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      xPct: Math.min(
        100,
        Math.max(0, ((clientX - rect.left) / rect.width) * 100)
      ),
      yPct: Math.min(
        100,
        Math.max(0, ((clientY - rect.top) / rect.height) * 100)
      ),
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const pct = pointerToPct(e.clientX, e.clientY);
    if (!pct) return;
    if (dragging === "body") {
      setLocalBodyPlacement((p) => ({ ...p, ...pct }));
    } else {
      setLocalIdPlacement((p) => ({ ...p, ...pct }));
    }
  };

  const handleSave = () => {
    onSave(localBody, localBodyPlacement, localIdPlacement);
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Certificate body text
        </label>
        <Textarea
          rows={5}
          value={localBody}
          onChange={(e) => setLocalBody(e.target.value)}
        />
        <p className="mt-1 text-xs text-slate-400">
          Use <code className="rounded bg-slate-100 px-1">{NAME_TOKEN}</code>{" "}
          wherever the recipient's name (with salutation, e.g. "Mr. Rahul
          Sharma") should be inserted. Everything else prints exactly as
          written.
        </p>
      </div>

      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerUp={() => setDragging(null)}
        onPointerLeave={() => setDragging(null)}
        className="relative w-full select-none overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
      >
        <img
          src={templateUrl}
          alt="Certificate template"
          className="pointer-events-none block w-full"
          draggable={false}
        />

        {/* Body block preview */}
        <div
          onPointerDown={(e) => {
            e.preventDefault();
            setDragging("body");
          }}
          style={{
            position: "absolute",
            left: `${localBodyPlacement.xPct}%`,
            top: `${localBodyPlacement.yPct}%`,
            width: `${localBodyPlacement.widthPct}%`,
            transform: "translate(-50%, -50%)",
            color: localBodyPlacement.color,
            fontWeight: localBodyPlacement.bold ? 700 : 400,
            fontFamily: CSS_FONT_STACK[localBodyPlacement.fontFamily],
            fontSize: Math.max(6, localBodyPlacement.fontSize * scale),
            textAlign: localBodyPlacement.align,
          }}
          className="flex cursor-grab flex-col items-center gap-1 rounded-md border border-dashed border-indigo-400 bg-white/85 px-2 py-1.5 leading-tight shadow-sm active:cursor-grabbing"
        >
          <span
            style={{ fontFamily: "inherit" }}
            className="flex items-center gap-1 self-start text-[9px] font-semibold text-indigo-500"
          >
            <GripVertical className="h-3 w-3" />
            Body
          </span>
          <span className="line-clamp-3">{localBody}</span>
        </div>

        {/* Certificate ID chip */}
        <div
          onPointerDown={(e) => {
            e.preventDefault();
            setDragging("certId");
          }}
          style={{
            position: "absolute",
            left: `${localIdPlacement.xPct}%`,
            top: `${localIdPlacement.yPct}%`,
            transform: "translate(-50%, -50%)",
            color: localIdPlacement.color,
            fontWeight: localIdPlacement.bold ? 700 : 400,
            fontFamily: CSS_FONT_STACK[localIdPlacement.fontFamily],
            fontSize: Math.max(6, localIdPlacement.fontSize * scale),
          }}
          className="flex cursor-grab items-center gap-1 whitespace-nowrap rounded-md border border-dashed border-emerald-400 bg-white/85 px-2 py-1 shadow-sm active:cursor-grabbing"
        >
          <GripVertical className="h-3 w-3 shrink-0 text-emerald-500" />
          Certificate ID
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FieldControls
          title="Body text style"
          fontSize={localBodyPlacement.fontSize}
          fontFamily={localBodyPlacement.fontFamily}
          color={localBodyPlacement.color}
          align={localBodyPlacement.align}
          bold={localBodyPlacement.bold}
          onChange={(patch) =>
            setLocalBodyPlacement((p) => ({ ...p, ...patch }))
          }
          extra={
            <>
              <div>
                <label className="mb-1 block text-xs text-slate-500">
                  Wrap width (%)
                </label>
                <input
                  type="number"
                  min={20}
                  max={100}
                  value={localBodyPlacement.widthPct}
                  onChange={(e) =>
                    setLocalBodyPlacement((p) => ({
                      ...p,
                      widthPct: Number(e.target.value) || p.widthPct,
                    }))
                  }
                  className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">
                  Line height (%)
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  step={0.5}
                  value={localBodyPlacement.lineHeightPct}
                  onChange={(e) =>
                    setLocalBodyPlacement((p) => ({
                      ...p,
                      lineHeightPct: Number(e.target.value) || p.lineHeightPct,
                    }))
                  }
                  className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm"
                />
              </div>
            </>
          }
        />
        <FieldControls
          title="Certificate ID style"
          fontSize={localIdPlacement.fontSize}
          fontFamily={localIdPlacement.fontFamily}
          color={localIdPlacement.color}
          align={localIdPlacement.align}
          bold={localIdPlacement.bold}
          onChange={(patch) => setLocalIdPlacement((p) => ({ ...p, ...patch }))}
        />
      </div>

      <Button
        leftIcon={<Save className="h-4 w-4" />}
        loading={saving}
        onClick={handleSave}
      >
        Save Layout
      </Button>
      <p className="text-xs text-slate-400">
        Drag the "Body" or "Certificate ID" box on the template to reposition
        it. Nothing is saved until you click Save Layout.
      </p>
    </div>
  );
}

function FieldControls({
  title,
  fontSize,
  fontFamily,
  color,
  align,
  bold,
  onChange,
  extra,
}: {
  title: string;
  fontSize: number;
  fontFamily: FontFamily;
  color: string;
  align: TextAlign;
  bold?: boolean;
  onChange: (patch: Partial<CertFieldPlacement>) => void;
  extra?: React.ReactNode;
}) {
  return (
    <div className="space-y-3 rounded-lg border border-slate-200 p-3">
      <p className="text-xs font-semibold text-slate-600">{title}</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs text-slate-500">Font</label>
          <Select
            value={fontFamily}
            onChange={(e) =>
              onChange({ fontFamily: e.target.value as FontFamily })
            }
          >
            {FONT_FAMILIES.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">Font size</label>
          <input
            type="number"
            min={8}
            max={96}
            value={fontSize}
            onChange={(e) =>
              onChange({ fontSize: Number(e.target.value) || fontSize })
            }
            className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">Color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => onChange({ color: e.target.value })}
            className="h-9 w-full cursor-pointer rounded-md border border-slate-200"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">Align</label>
          <Select
            value={align}
            onChange={(e) => onChange({ align: e.target.value as TextAlign })}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </Select>
        </div>
        <div className="col-span-2 flex items-end">
          <button
            type="button"
            onClick={() => onChange({ bold: !bold })}
            className={`flex h-9 w-full items-center justify-center gap-1 rounded-md border text-xs font-medium ${
              bold
                ? "border-indigo-400 bg-indigo-50 text-indigo-600"
                : "border-slate-200 text-slate-500"
            }`}
          >
            <Bold className="h-3.5 w-3.5" />
            Bold
          </button>
        </div>
        {extra}
      </div>
    </div>
  );
}
