import { describe, expect, it } from "vitest";
import {
  createWorkspaceFileTabTarget,
  normalizeWorkspaceFileLocation,
  normalizeWorkspaceFileRenderMode,
  workspaceFileLocationsEqual,
  workspaceFileTabTargetsEqual,
} from ".";

describe("normalizeWorkspaceFileLocation", () => {
  it("normalizes paths and valid line ranges", () => {
    expect(
      normalizeWorkspaceFileLocation({
        path: "src\\app.ts",
        lineStart: 12.8,
        lineEnd: 20.2,
      }),
    ).toEqual({
      path: "src/app.ts",
      lineStart: 12,
      lineEnd: 20,
    });
  });

  it("drops invalid or backwards line ranges", () => {
    expect(normalizeWorkspaceFileLocation({ path: "src/app.ts", lineStart: -1 })).toEqual({
      path: "src/app.ts",
    });
    expect(
      normalizeWorkspaceFileLocation({ path: "src/app.ts", lineStart: 20, lineEnd: 12 }),
    ).toEqual({
      path: "src/app.ts",
      lineStart: 20,
    });
  });

  it("rejects empty paths", () => {
    expect(normalizeWorkspaceFileLocation({ path: " " })).toBeNull();
  });
});

describe("workspace file tab targets", () => {
  it("keeps file tab identity separate from line selection", () => {
    expect(createWorkspaceFileTabTarget({ path: "src/app.ts", lineStart: 12 })).toEqual({
      kind: "file",
      path: "src/app.ts",
      lineStart: 12,
      renderMode: "preview",
    });
  });

  it("normalizes missing render mode to preview", () => {
    expect(normalizeWorkspaceFileRenderMode(undefined)).toBe("preview");
    expect(normalizeWorkspaceFileRenderMode("preview")).toBe("preview");
    expect(normalizeWorkspaceFileRenderMode("source")).toBe("source");
    expect(createWorkspaceFileTabTarget({ path: "README.md" })).toEqual({
      kind: "file",
      path: "README.md",
      renderMode: "preview",
    });
    expect(createWorkspaceFileTabTarget({ path: "README.md", renderMode: "preview" })).toEqual({
      kind: "file",
      path: "README.md",
      renderMode: "preview",
    });
    expect(createWorkspaceFileTabTarget({ path: "README.md", renderMode: "source" })).toEqual({
      kind: "file",
      path: "README.md",
      renderMode: "source",
    });
  });

  it("compares full location equality", () => {
    expect(
      workspaceFileLocationsEqual(
        { path: "src/app.ts", lineStart: 12 },
        { path: "src/app.ts", lineStart: 12 },
      ),
    ).toBe(true);
    expect(
      workspaceFileLocationsEqual(
        { path: "src/app.ts", lineStart: 12 },
        { path: "src/app.ts", lineStart: 13 },
      ),
    ).toBe(false);
  });

  it("includes render mode in tab target equality", () => {
    expect(
      workspaceFileTabTargetsEqual(
        { kind: "file", path: "README.md" },
        { kind: "file", path: "README.md", renderMode: "preview" },
      ),
    ).toBe(true);
    expect(
      workspaceFileTabTargetsEqual(
        { kind: "file", path: "README.md" },
        { kind: "file", path: "README.md", renderMode: "source" },
      ),
    ).toBe(false);
  });
});
