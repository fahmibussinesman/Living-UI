import { describe, expect, it } from "vitest";
import { computeScore, isHeadEligible } from "./scoring";

describe("computeScore", () => {
  it("rewards votes and favorites", () => {
    const low = computeScore({
      votesUp: 0,
      votesDown: 0,
      favorites: 0,
      createdAt: new Date().toISOString(),
      status: "proposed",
    });
    const high = computeScore({
      votesUp: 5,
      votesDown: 0,
      favorites: 2,
      createdAt: new Date().toISOString(),
      status: "proposed",
    });
    expect(high).toBeGreaterThan(low);
  });

  it("penalizes downvotes", () => {
    const a = computeScore({
      votesUp: 3,
      votesDown: 0,
      favorites: 0,
      createdAt: new Date().toISOString(),
      status: "proposed",
    });
    const b = computeScore({
      votesUp: 3,
      votesDown: 2,
      favorites: 0,
      createdAt: new Date().toISOString(),
      status: "proposed",
    });
    expect(b).toBeLessThan(a);
  });

  it("gives genesis a floor", () => {
    const g = computeScore({
      votesUp: 0,
      votesDown: 0,
      favorites: 0,
      createdAt: new Date().toISOString(),
      status: "genesis",
    });
    const p = computeScore({
      votesUp: 0,
      votesDown: 0,
      favorites: 0,
      createdAt: new Date().toISOString(),
      status: "proposed",
    });
    expect(g).toBeGreaterThan(p);
  });
});

describe("isHeadEligible", () => {
  it("allows proposed featured genesis only", () => {
    expect(isHeadEligible("proposed")).toBe(true);
    expect(isHeadEligible("personal")).toBe(false);
    expect(isHeadEligible("hidden")).toBe(false);
  });
});
