import { matchRoutes } from "react-router-dom";
import { describe, expect, it } from "vitest";

const routes = [{ path: "/blog/tag/:tag" }];

function routeTag(pathname: string): string | undefined {
  return matchRoutes(routes, pathname)?.[0]?.params.tag;
}

describe("blog tag route decoding", () => {
  it("keeps a literal percent without a second decode", () => {
    expect(routeTag("/blog/tag/%25")).toBe("%");
  });

  it("decodes unicode once", () => {
    expect(routeTag("/blog/tag/dise%C3%B1o")).toBe("diseño");
  });

  it("does not double-decode an encoded percent sequence", () => {
    expect(routeTag("/blog/tag/%2525")).toBe("%25");
  });
});
