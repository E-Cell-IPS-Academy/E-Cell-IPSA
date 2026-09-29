import type { ReactNode } from "react";
import { parseInline } from "../../lib/inline";
import type { InlineNode } from "../../lib/inline";

function render(nodes: InlineNode[]): ReactNode[] {
  return nodes.map((n, i) => {
    switch (n.type) {
      case "text":
        return n.value;
      case "br":
        return <br key={i} />;
      case "strong":
        return <strong key={i}>{render(n.children)}</strong>;
      case "em":
        return <em key={i}>{render(n.children)}</em>;
      case "link": {
        const external = /^https?:/i.test(n.href);
        return (
          <a
            key={i}
            href={n.href}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {render(n.children)}
          </a>
        );
      }
    }
  });
}

/** Render **bold**, *italic*, [links](url) as React nodes — never raw HTML. */
export function Inline({ text }: { text: string }) {
  return <>{render(parseInline(text))}</>;
}
