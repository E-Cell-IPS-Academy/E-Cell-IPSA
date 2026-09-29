import type { ReactNode } from "react";

/** Loading placeholder shaped like the front page (no spinner, no layout jump). */
export function ListingSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading stories">
      <div className="np-hero">
        <div className="np-skel np-ar-16-10" />
        <div className="np-hero-text" style={{ width: "100%" }}>
          <div className="np-skel" style={{ height: 12, width: "35%" }} />
          <div className="np-skel" style={{ height: 44, width: "100%" }} />
          <div className="np-skel" style={{ height: 44, width: "70%" }} />
          <div className="np-skel" style={{ height: 14, width: "90%" }} />
          <div className="np-skel" style={{ height: 14, width: "80%" }} />
        </div>
      </div>
      <div className="np-grid" style={{ marginTop: "2.5rem" }}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="np-grid-mid" style={{ border: 0, padding: 0, gridColumn: "span 4" }}>
            <div className="np-skel np-ar-3-2" />
            <div className="np-skel" style={{ height: 22, margin: "1rem 0 0.5rem" }} />
            <div className="np-skel" style={{ height: 14, width: "60%" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ArticleSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading story" className="np-art-head">
      <div className="np-skel" style={{ height: 12, width: 140 }} />
      <div className="np-skel" style={{ height: 52, width: "90%" }} />
      <div className="np-skel" style={{ height: 52, width: "60%" }} />
      <div className="np-skel" style={{ height: 20, width: "70%" }} />
      <div className="np-skel np-ar-16-10" style={{ width: "100%", marginTop: "1.5rem" }} />
    </div>
  );
}

/** Empty / error / not-found panel. */
export function StateMessage({
  title,
  message,
  action,
  role,
}: {
  title: string;
  message: string;
  action?: ReactNode;
  role?: "alert" | "status";
}) {
  return (
    <div className="np-state" role={role}>
      <h2 className="np-headline np-h-lg">{title}</h2>
      <p>{message}</p>
      {action}
    </div>
  );
}
