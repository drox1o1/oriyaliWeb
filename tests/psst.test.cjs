const { scorePsst, SYMPTOM_ITEMS, INTERFERENCE_ITEMS } = require("../.psst-build/psst.js");
const S = SYMPTOM_ITEMS.map(i => i.id);
const I = INTERFERENCE_ITEMS.map(i => i.id);
const mk = (arr) => Object.fromEntries(S.map((id, i) => [id, arr[i] ?? 0]));
const mki = (arr) => Object.fromEntries(I.map((id, i) => [id, arr[i] ?? 0]));

const cases = [
  // [name, symptoms(14), interference(5), expected]
  ["textbook PMDD", [3,3,3,3,2,2,0,0,0,0,0,0,0,0], [3,0,0,0,0], "pmdd"],
  ["core severe + 4 mod-plus + interference severe = exactly at threshold",
    [3,0,0,0,2,2,2,0,0,0,0,0,0,0], [0,0,0,0,3], "pmdd"],
  ["core severe, 4 mod-plus, interference only MODERATE -> PMS not PMDD",
    [3,0,0,0,2,2,2,0,0,0,0,0,0,0], [2,0,0,0,0], "moderate-severe-pms"],
  ["core only MODERATE, 4 mod-plus, interference severe -> PMS not PMDD",
    [2,2,0,0,2,2,0,0,0,0,0,0,0,0], [3,0,0,0,0], "moderate-severe-pms"],
  ["only 3 mod-plus -> below threshold",
    [3,0,0,0,2,2,0,0,0,0,0,0,0,0], [3,0,0,0,0], "below-threshold"],
  ["severe core + severe interference but only 3 mod-plus -> below",
    [3,3,3,0,0,0,0,0,0,0,0,0,0,0], [3,3,3,3,3], "below-threshold"],
  ["4 mod-plus but none in items 1-4 -> below",
    [0,0,0,0,2,2,2,2,0,0,0,0,0,0], [3,0,0,0,0], "below-threshold"],
  ["all mild -> below", [1,1,1,1,1,1,1,1,1,1,1,1,1,1], [1,1,1,1,1], "below-threshold"],
  ["all zero -> below", [], [], "below-threshold"],
  ["everything severe -> pmdd", [3,3,3,3,3,3,3,3,3,3,3,3,3,3], [3,3,3,3,3], "pmdd"],
  ["physical-only severe, no mood -> below", [0,0,0,0,0,0,0,0,2,2,2,0,0,3], [3,0,0,0,0], "below-threshold"],
];

let fail = 0;
for (const [name, sym, int, want] of cases) {
  const r = scorePsst(mk(sym), mki(int));
  const ok = r.classification === want;
  if (!ok) fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}\n        got=${r.classification} want=${want} modPlus=${r.detail.moderatePlusCount} coreSev=${r.detail.coreSevere} intSev=${r.detail.interferenceSevere}`);
}
// missing keys must not crash
const partial = scorePsst({ anger: 3 }, { productivity: 3 });
console.log(`${partial.classification === "below-threshold" ? "PASS" : "FAIL"}  partial answers don't crash (got ${partial.classification})`);
console.log(fail === 0 ? "\nAll PSST scoring cases pass." : `\n${fail} FAILURES`);
process.exit(fail ? 1 : 0);
