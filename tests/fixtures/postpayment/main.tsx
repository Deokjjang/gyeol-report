import { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { ReportGenerationStatus } from "../../../src/components/report/ReportGenerationStatus";
import { ReportStatusView } from "../../../src/components/report/ReportStatusView";
import BusinessFooter from "../../../src/components/legal/BusinessFooter";
import { TestRouter } from "./router";
import "../../../src/app/globals.css";

// Only fixture markup and local assets are fetched. No application server runs.
const localFetch = window.fetch.bind(window);
const metrics = { refreshes: 0, externalRequests: 0 };
Object.assign(window, { postPaymentQa: metrics });
window.fetch = (input, init) => {
  const url = new URL(input instanceof Request ? input.url : String(input), location.href);
  if (url.origin !== location.origin) {
    metrics.externalRequests++;
    return Promise.reject(new Error("External requests forbidden in local QA"));
  }
  return localFetch(input, init);
};
const completed = await fetch("/completed.html").then((response) => response.text());

function Fixture() {
  const query = new URLSearchParams(location.search);
  const [state, setState] = useState(query.get("state") ?? "QUEUED");
  const finish = query.get("finish");
  const router = useMemo(() => ({ refresh() {
    metrics.refreshes++;
    if (finish) setState(finish);
  } }), [finish, setState]);
  return (
    <TestRouter.Provider value={router}>
      {state === "COMPLETED" ? <div dangerouslySetInnerHTML={{ __html: completed }} />
        : state === "EXPIRED" ? <ReportStatusView state="expired" />
        : state === "PAYMENT_CHECK" ? <ReportStatusView state="payment-check" />
        : <ReportGenerationStatus attention={state === "FAILED_REQUIRES_ATTENTION"} delayed={state === "RETRYING"} />}
      <BusinessFooter />
    </TestRouter.Provider>
  );
}

createRoot(document.getElementById("root")!).render(<Fixture />);
