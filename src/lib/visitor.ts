import { cookies } from "next/headers";
import { ensureVisitor } from "@/lib/data/store";

export const VISITOR_COOKIE = "lu_visitor";
export const SEEN_HEAD_COOKIE = "lu_seen_head";

/** Read visitor id (middleware seeds cookie). Register in store. */
export async function getOrCreateVisitorId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(VISITOR_COOKIE)?.value;
  return ensureVisitor(existing);
}

export async function readSeenHeadId(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(SEEN_HEAD_COOKIE)?.value ?? null;
}
