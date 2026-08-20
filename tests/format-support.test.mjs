/*
 * 뷰어가 지원한다고 선언한 파일 형식이 실제로 끝까지 동작하는지 검증한다.
 *
 * 배경: 릴리스 0.2.13은 rhwp가 hwpx를 완전히 지원하는데도 CanHandle이 ".hwp"만
 * 받아서 QuickLook이 플러그인을 아예 호출하지 않았다. 엔진 지원과 확장자 게이트가
 * 어긋나는 이 조합을 잡는 것이 이 테스트의 목적이다.
 *
 *   node --test tests/
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { after, before, describe, test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const testsDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(testsDir, "..");

/*
 * 뷰어가 지원하기로 한 형식. 여기에 항목을 추가하면 엔진 테스트와
 * CanHandle 테스트가 함께 그 형식을 요구한다.
 */
const SUPPORTED_FORMATS = [
  { extension: ".hwp", fixture: "blank.hwp", sourceFormat: "hwp" },
  { extension: ".hwpx", fixture: "blank.hwpx", sourceFormat: "hwpx" },
];

describe("rhwp engine", () => {
  let rhwp;

  before(async () => {
    globalThis.measureTextWidth = (font, text) => text.length * 10;

    rhwp = await import(pathToFileURL(join(repoRoot, "rhwp.js")).href);
    await rhwp.default({
      module_or_path: readFileSync(join(repoRoot, "rhwp_bg.wasm")),
    });
  });

  after(() => {
    delete globalThis.measureTextWidth;
  });

  for (const format of SUPPORTED_FORMATS) {
    test(`opens and renders ${format.extension}`, () => {
      const bytes = new Uint8Array(
        readFileSync(join(testsDir, "fixtures", format.fixture)),
      );

      const doc = new rhwp.HwpDocument(bytes);

      try {
        assert.equal(doc.getSourceFormat(), format.sourceFormat);
        assert.ok(doc.pageCount() > 0, "pageCount must be positive");

        const pageInfo = JSON.parse(doc.getPageInfo(0));
        assert.ok(pageInfo.width > 0 && pageInfo.height > 0);

        assert.match(doc.renderPageSvg(0), /^<svg/);
      } finally {
        doc.free();
      }
    });
  }
});

describe("Plugin.cs CanHandle", () => {
  const source = readFileSync(join(repoRoot, "Plugin.cs"), "utf8");

  const body = source.match(
    /public bool CanHandle\(string path\)\s*\{([\s\S]*?)\n\s{8}\}/,
  )?.[1];

  test("CanHandle body is present", () => {
    assert.ok(body, "could not locate CanHandle in Plugin.cs");
  });

  for (const format of SUPPORTED_FORMATS) {
    test(`accepts ${format.extension}`, () => {
      assert.ok(
        body.includes(`"${format.extension}"`),
        `CanHandle must gate on "${format.extension}" — the engine supports ` +
          `it, so QuickLook will never invoke the plugin without it`,
      );
    });
  }

  test("uses case-insensitive extension comparison", () => {
    assert.ok(
      body.includes("OrdinalIgnoreCase") || body.includes("ToLower"),
      "extension matching must be case-insensitive",
    );
  });
});
