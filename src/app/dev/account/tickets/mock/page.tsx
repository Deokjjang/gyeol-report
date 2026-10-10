import { Suspense } from "react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { localAccountAllowed } from "../../../../../lib/account/gate";
import { BundleMockCheckout } from "../../../../../components/account/BundleMockCheckout";
export default async function Page() {
  if (!localAccountAllowed(new Request("http://localhost/dev/account/tickets/mock", { headers: await headers() }))) notFound();
  return <Suspense><BundleMockCheckout /></Suspense>;
}
