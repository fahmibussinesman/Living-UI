/**
 * Unified repository: Supabase when configured, else file/memory store.
 * Server-only — import from Server Components / Server Actions.
 */
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { LineageHead, TokenSnapshot, VersionRecord } from "@/lib/tokens/types";
import * as local from "./store";
import * as remote from "./supabase-store";
import { GENESIS_TOKENS, GENESIS_VERSION } from "./constants";

export { GENESIS_TOKENS, GENESIS_VERSION };

const remoteOn = () => isSupabaseConfigured();

export async function getHead(): Promise<LineageHead> {
  if (remoteOn()) return remote.sbGetHead();
  return local.getHead();
}

export async function getVersion(
  id: string,
): Promise<VersionRecord | undefined> {
  if (remoteOn()) return remote.sbGetVersion(id);
  return local.getVersion(id);
}

export async function getHeadVersion(): Promise<VersionRecord> {
  if (remoteOn()) return remote.sbGetHeadVersion();
  return local.getHeadVersion();
}

export async function listVersions(): Promise<VersionRecord[]> {
  if (remoteOn()) return remote.sbListVersions();
  return local.listVersions();
}

export async function listMainPath(): Promise<VersionRecord[]> {
  if (remoteOn()) return remote.sbListMainPath();
  return local.listMainPath();
}

export async function listProposals(): Promise<VersionRecord[]> {
  if (remoteOn()) return remote.sbListProposals();
  return local.listProposals();
}

export async function ensureVisitor(
  visitorId?: string | null,
): Promise<string> {
  if (remoteOn()) return remote.sbEnsureVisitor(visitorId);
  return local.ensureVisitor(visitorId);
}

export async function commitPersonalBranch(input: {
  parentId: string;
  tokens: TokenSnapshot;
  spellId: string;
  spellLabel: string;
}): Promise<VersionRecord> {
  if (remoteOn()) return remote.sbCommitPersonalBranch(input);
  return local.commitPersonalBranch(input);
}

export async function proposeVersion(
  versionId: string,
): Promise<VersionRecord> {
  if (remoteOn()) return remote.sbProposeVersion(versionId);
  return local.proposeVersion(versionId);
}

export async function setHead(
  versionId: string,
  opts?: { force?: boolean },
): Promise<LineageHead> {
  if (remoteOn()) return remote.sbSetHead(versionId, opts);
  return local.setHead(versionId, opts);
}

export async function lockHead(locked: boolean): Promise<LineageHead> {
  if (remoteOn()) return remote.sbLockHead(locked);
  return local.lockHead(locked);
}

export async function castVote(input: {
  visitorId: string;
  versionId: string;
  value: -1 | 1;
}): Promise<VersionRecord> {
  if (remoteOn()) return remote.sbCastVote(input);
  return local.castVote(input);
}

export async function toggleFavorite(input: {
  visitorId: string;
  versionId: string;
}): Promise<VersionRecord> {
  if (remoteOn()) return remote.sbToggleFavorite(input);
  return local.toggleFavorite(input);
}

export async function getVisitorVote(
  visitorId: string | null | undefined,
  versionId: string,
): Promise<-1 | 1 | 0> {
  if (remoteOn()) return remote.sbGetVisitorVote(visitorId, versionId);
  return local.getVisitorVote(visitorId, versionId);
}

export async function isFavorited(
  visitorId: string | null | undefined,
  versionId: string,
): Promise<boolean> {
  if (remoteOn()) return remote.sbIsFavorited(visitorId, versionId);
  return local.isFavorited(visitorId, versionId);
}

export async function recomputeHead(): Promise<LineageHead> {
  if (remoteOn()) return remote.sbRecomputeHead();
  return local.recomputeHead();
}

export async function resetToGenesis(): Promise<LineageHead> {
  if (remoteOn()) return remote.sbResetToGenesis();
  return local.resetToGenesis();
}
