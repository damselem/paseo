export type OpenFileDisposition = "main" | "side";

export interface WorkspaceFileLocation {
  path: string;
  lineStart?: number;
  lineEnd?: number;
}

export type WorkspaceFileRenderMode = "preview" | "source";

export type WorkspaceFileTabTarget = {
  kind: "file";
  renderMode: WorkspaceFileRenderMode;
} & WorkspaceFileLocation;

export type WorkspaceFileTabTargetInput = {
  kind: "file";
  renderMode?: WorkspaceFileRenderMode | null;
} & WorkspaceFileLocation;

export interface WorkspaceFileOpenRequest {
  location: WorkspaceFileLocation;
  disposition: OpenFileDisposition;
}

export function normalizeWorkspaceFileLocation(
  location: WorkspaceFileLocation | null | undefined,
): WorkspaceFileLocation | null {
  if (!location) {
    return null;
  }

  const path = location.path.trim().replace(/\\/g, "/");
  if (!path) {
    return null;
  }

  const lineStart = normalizeLineNumber(location.lineStart);
  const lineEnd = normalizeLineNumber(location.lineEnd);
  return {
    path,
    ...(lineStart ? { lineStart } : {}),
    ...(lineStart && lineEnd && lineEnd >= lineStart ? { lineEnd } : {}),
  };
}

export function normalizeWorkspaceFileRenderMode(
  value: WorkspaceFileRenderMode | null | undefined,
): WorkspaceFileRenderMode {
  return value === "source" ? "source" : "preview";
}

export function workspaceFileLocationsEqual(
  left: WorkspaceFileLocation,
  right: WorkspaceFileLocation,
): boolean {
  return (
    left.path === right.path && left.lineStart === right.lineStart && left.lineEnd === right.lineEnd
  );
}

export function workspaceFileTabTargetsEqual(
  left: WorkspaceFileTabTarget | WorkspaceFileTabTargetInput,
  right: WorkspaceFileTabTarget | WorkspaceFileTabTargetInput,
): boolean {
  return (
    workspaceFileLocationsEqual(left, right) &&
    normalizeWorkspaceFileRenderMode(left.renderMode) ===
      normalizeWorkspaceFileRenderMode(right.renderMode)
  );
}

export function createWorkspaceFileTabTarget(
  location: WorkspaceFileLocation & { renderMode?: WorkspaceFileRenderMode | null },
): WorkspaceFileTabTarget {
  const renderMode = normalizeWorkspaceFileRenderMode(location.renderMode);
  const { renderMode: _renderMode, ...fileLocation } = location;
  return {
    kind: "file",
    ...fileLocation,
    renderMode,
  };
}

function normalizeLineNumber(value: number | null | undefined): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : undefined;
}
