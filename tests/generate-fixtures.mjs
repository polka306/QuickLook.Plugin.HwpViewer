/*
 * 테스트 fixture를 rhwp 내장 빈 문서 템플릿에서 생성한다.
 * 사용자 문서를 저장소에 넣지 않기 위해 실물 대신 이 산출물을 쓴다.
 *
 *   node tests/generate-fixtures.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const testsDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(testsDir, "..");
const fixturesDir = join(testsDir, "fixtures");

// index.html이 제공하는 호스트 훅. rhwp가 텍스트 폭 측정에 사용한다.
globalThis.measureTextWidth = (font, text) => text.length * 10;

const rhwp = await import(pathToFileURL(join(repoRoot, "rhwp.js")).href);
await rhwp.default({
  module_or_path: readFileSync(join(repoRoot, "rhwp_bg.wasm")),
});

const doc = rhwp.HwpDocument.createEmpty();
doc.createBlankDocument();

writeFileSync(join(fixturesDir, "blank.hwp"), doc.exportHwp());
writeFileSync(join(fixturesDir, "blank.hwpx"), doc.exportHwpx());
doc.free();

console.log("Wrote tests/fixtures/blank.hwp and tests/fixtures/blank.hwpx");
