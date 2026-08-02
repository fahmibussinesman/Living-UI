import { cookies } from "next/headers";
import { ensureVisitor } from "@/lib/data/repo";

export const VISITOR_COOKIE = "lu_visitor";
export const SEEN_HEAD_COOKIE = "lu_seen_head";

export async function getOrCreateVisitorId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(VISITOR_COOKIE)?.value;
  return ensureVisitor(existing);
}

export async function readSeenHeadId(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(SEEN_HEAD_COOKIE)?.value ?? null;
}
