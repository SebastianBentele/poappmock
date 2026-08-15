"use client";

import { createContext, useContext, ReactNode } from "react";

export type Variant = "vision" | "v1" | "kam";

/**
 * Feature matrix per portal variant.
 *
 * "vision" = the full target picture (everything in the mockup).
 * "v1"     = the first development stage. Scope follows the data & information
 *            requirements alignment (July 2026): only what Ops/Nexus confirmed
 *            as available and undisputed ships here.
 *
 * Why each V1 flag is off:
 *  - operations / maintenanceTickets: Breezeway data isn't reliable enough yet
 *    (inconsistent logging, no bill-to-owner vs bill-to-guest tag) — parked.
 *  - costApprovals: no standardised process yet; scoped with maintenance.
 *  - recommendations: needs to be defined from scratch.
 *  - guestNames: PMS fetches strip PII today; DPA + storage boundaries first.
 *  - cleaningDetail: cleaning types sit in a billing gray zone → disputes.
 *  - accruedPayout / instantPayout: monthly cutover only; instant is a future topic.
 *  - contract: contract data/documents aren't in Nexus yet.
 *
 * What V1 gains instead: ownRequests — tickets the owner raises through the
 * portal, which we own end-to-end and can therefore show a status for.
 */
export const FEATURES = {
  vision: {
    operations: true,
    maintenanceTickets: true,
    costApprovals: true,
    recommendations: true,
    guestNames: true,
    cleaningDetail: true,
    accruedPayout: true,
    instantPayout: true,
    contract: true,
    ownRequests: false,
    liveClosedSplit: false,
  },
  v1: {
    operations: false,
    maintenanceTickets: false,
    costApprovals: false,
    recommendations: false,
    guestNames: false,
    cleaningDetail: false,
    accruedPayout: false,
    instantPayout: false,
    contract: false,
    ownRequests: true,
    liveClosedSplit: true,
  },
  kam: {
    operations: true,
    maintenanceTickets: true,
    costApprovals: true,
    recommendations: true,
    guestNames: true,
    cleaningDetail: true,
    accruedPayout: true,
    instantPayout: true,
    contract: true,
    ownRequests: true,
    liveClosedSplit: true,
  },
} as const;

export type FeatureFlags = (typeof FEATURES)[Variant];

const VariantCtx = createContext<Variant>("vision");

export function VariantProvider({
  variant,
  children,
}: {
  variant: Variant;
  children: ReactNode;
}) {
  return <VariantCtx.Provider value={variant}>{children}</VariantCtx.Provider>;
}

export function useVariant() {
  return useContext(VariantCtx);
}

export function useFeatures(): FeatureFlags {
  return FEATURES[useContext(VariantCtx)];
}
