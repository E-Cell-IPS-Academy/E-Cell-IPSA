import { useState } from "react";
import { Save } from "lucide-react";
import { Button, Card, Input, Textarea } from "@/shared/ui";
import { EVENT_TOKEN, NAME_TOKEN } from "../types";

interface EmailTemplateEditorProps {
  emailSubject: string;
  emailBody: string;
  saving?: boolean;
  onSave: (emailSubject: string, emailBody: string) => void;
}

/**
 * Lets the admin write the actual subject + intro text sent to recipients,
 * instead of a hardcoded backend template. The Full Name / Certificate ID
 * summary, Download button, and verification link are always appended
 * automatically by the backend — only the subject and greeting are editable
 * here, so nobody can accidentally break the structural part of the email.
 */
export function EmailTemplateEditor({
  emailSubject,
  emailBody,
  saving = false,
  onSave,
}: EmailTemplateEditorProps) {
  const [subject, setSubject] = useState(emailSubject);
  const [body, setBody] = useState(emailBody);

  return (
    <Card className="space-y-5 p-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Email subject
        </label>
        <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Email intro text
        </label>
        <Textarea
          rows={6}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <p className="mt-1 text-xs text-slate-400">
          Use <code className="rounded bg-slate-100 px-1">{NAME_TOKEN}</code>{" "}
          and <code className="rounded bg-slate-100 px-1">{EVENT_TOKEN}</code> —
          both are replaced per recipient when the email is sent. The Full Name,
          Certificate ID, a Download button, and the verification link are added
          automatically below this text — you don't need to write those
          yourself.
        </p>
      </div>

      <Button
        leftIcon={<Save className="h-4 w-4" />}
        loading={saving}
        onClick={() => onSave(subject, body)}
      >
        Save Email Template
      </Button>
    </Card>
  );
}
