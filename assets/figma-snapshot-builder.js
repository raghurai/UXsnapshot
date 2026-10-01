// Figma Project Snapshot: page builder for the Figma Plugin API (run via use_figma).
// 1. Replace DATA below with the snapshot content. Keep the shape; use [] or "" for empty.
// 2. Run the whole file. It creates (or rebuilds) a "📋 Project Snapshot" page as the
//    FIRST page of the file, so it acts as the file's cover / read-me.
// 3. It returns { pageId, frameId } so you can link the user straight to it.
//
// Re-running replaces the old snapshot frame on that page, so there is always one version.

const DATA = {
  title: "Project name",
  status: "In design",                 // e.g. In design, In review, Ready for dev
  owner: "Owner name",
  updated: "Oct 1, 2026",
  source: "Pages covered: Current state, Final",
  tldr: "For [who], we're [what] so that [why], by [how].",
  goal: "Outcome, not a feature list.",
  problem: "Current pain, who feels it, and the evidence.",
  problemNeeds: [],                    // ["How many resubmissions per month?"]
  users: [
    // { role: "Partner contact", need: "Find, complete and upload the right template", confirm: false }
  ],
  experience: { type: "Net-new feature", platform: "Web, desktop-first", pattern: "Table + per-row actions" },
  flow: [
    // { step: "Open Documents", screenId: "12:345", screenName: "Documents list", edge: false }
  ],
  journey: { today: "", release: "", northStar: "", northStarConfirm: false },
  decisions: [],                       // ["One upload per document in v1 (annotation)"]
  questions: [],                       // ["Do expired documents notify partners?"]
  gaps: [
    // Numbered checklist shown on canvas. Remove items as the user answers them.
    // { n: 1, kind: "Confirm", text: "Users: an internal reviewer approves uploads." }
  ],
};

// ---------- tokens ----------
const PAGE_NAME = "📋 Project Snapshot";
const FRAME_NAME = "Project Snapshot";
function hex(h) {
  const n = parseInt(h.replace("#", ""), 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}
const C = {
  page: hex("#FFFFFF"), surface: hex("#F6F7F9"), line: hex("#E3E6EA"),
  text: hex("#15171A"), muted: hex("#5D6470"),
  accent: hex("#2563EB"), accentSoft: hex("#E8EFFF"),
  warn: hex("#9A5B00"), warnSoft: hex("#FFF3DC"), warnDot: hex("#D98A00"),
  ok: hex("#11744A"), okSoft: hex("#E3F6EC"), white: hex("#FFFFFF"),
};
const solid = (c) => [{ type: "SOLID", color: c }];

await Promise.all([
  figma.loadFontAsync({ family: "Inter", style: "Regular" }),
  figma.loadFontAsync({ family: "Inter", style: "Semi Bold" }),
  figma.loadFontAsync({ family: "Inter", style: "Bold" }),
]);

// ---------- helpers ----------
function stack(name, dir, gap, pad = 0) {
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = dir; // "VERTICAL" | "HORIZONTAL"
  f.itemSpacing = gap;
  f.paddingTop = f.paddingBottom = f.paddingLeft = f.paddingRight = pad;
  f.primaryAxisSizingMode = "AUTO";
  f.counterAxisSizingMode = "AUTO";
  f.fills = [];
  f.clipsContent = false;
  return f;
}
function txt(chars, size = 15, style = "Regular", color = C.text) {
  const t = figma.createText();
  t.fontName = { family: "Inter", style };
  t.fontSize = size;
  t.lineHeight = { unit: "PERCENT", value: 145 };
  t.characters = chars || " ";
  t.fills = solid(color);
  return t;
}
// Append a child and make it fill the parent's width (vertical parent) or share width (horizontal parent).
function add(parent, child, fill = true) {
  parent.appendChild(child);
  if (fill) {
    child.layoutSizingHorizontal = "FILL";
    if (child.type === "TEXT") child.textAutoResize = "HEIGHT";
  }
  return child;
}
function label(chars, color = C.muted) {
  const t = txt(chars.toUpperCase(), 12, "Bold", color);
  t.letterSpacing = { unit: "PERCENT", value: 6 };
  return t;
}
function pill(chars, fg, bg) {
  const p = stack("Tag · " + chars, "HORIZONTAL", 0);
  p.paddingLeft = p.paddingRight = 10; p.paddingTop = p.paddingBottom = 3;
  p.cornerRadius = 99; p.fills = solid(bg);
  p.appendChild(txt(chars, 12, "Semi Bold", fg));
  return p;
}
function card(name, title, opts = {}) {
  const f = stack(name, "VERTICAL", 10, 24);
  f.cornerRadius = 12;
  f.fills = solid(opts.fill || C.surface);
  f.strokes = solid(opts.stroke || C.line);
  f.strokeWeight = opts.strokeWeight || 1;
  if (title) add(f, label(title, opts.titleColor || C.muted));
  return f;
}
function needs(parent, q) {
  const box = stack("Needs input", "HORIZONTAL", 0);
  box.paddingLeft = box.paddingRight = 12; box.paddingTop = box.paddingBottom = 8;
  box.cornerRadius = 8; box.fills = solid(C.warnSoft);
  add(parent, box);
  add(box, txt("Needs input: " + q, 13, "Regular", C.warn));
}
function lineWithTag(parent, chars, confirm, style = "Regular") {
  const row = stack("Line", "HORIZONTAL", 8);
  row.counterAxisAlignItems = "CENTER";
  add(parent, row);
  const t = txt(chars, 15, style);
  row.appendChild(t);
  t.layoutSizingHorizontal = "FILL"; t.textAutoResize = "HEIGHT";
  if (confirm) row.appendChild(pill("Confirm", C.warn, C.warnSoft));
  return row;
}
function row(parent, name) {
  const r = stack(name, "HORIZONTAL", 20);
  r.counterAxisAlignItems = "MIN";
  add(parent, r);
  return r;
}
function cell(r, child) {
  r.appendChild(child);
  child.layoutSizingHorizontal = "FILL";
  try { child.layoutSizingVertical = "FILL"; } catch (e) { /* equal heights are a nice-to-have */ }
  return child;
}

// ---------- page ----------
let page = figma.root.children.find((p) => p.name === PAGE_NAME);
if (!page) {
  page = figma.createPage();
  page.name = PAGE_NAME;
}
figma.root.insertChild(0, page); // first page = cover / read-me
await figma.setCurrentPageAsync(page);
page.children.filter((n) => n.name === FRAME_NAME).forEach((n) => n.remove());

const root = stack(FRAME_NAME, "VERTICAL", 32, 64);
root.resize(1280, 100);
root.counterAxisSizingMode = "FIXED";
root.fills = solid(C.page);
root.cornerRadius = 16;
page.appendChild(root);
root.x = 0; root.y = 0;

// Header
const header = stack("Header", "VERTICAL", 10);
add(root, header);
add(header, label("Project snapshot", C.accent));
add(header, txt(DATA.title, 40, "Bold"));
const meta = stack("Meta", "HORIZONTAL", 16);
meta.counterAxisAlignItems = "CENTER";
add(header, meta);
meta.appendChild(pill(DATA.status, C.ok, C.okSoft));
meta.appendChild(txt(`Owner: ${DATA.owner}   ·   Updated: ${DATA.updated}   ·   ${DATA.source}`, 13, "Regular", C.muted));

// TL;DR
const tl = stack("TL;DR", "VERTICAL", 8, 24);
tl.cornerRadius = 12; tl.fills = solid(C.accentSoft);
add(root, tl);
add(tl, txt(DATA.tldr, 20, "Semi Bold"));
add(tl, txt("Solution = Why + Who + What + How", 12, "Regular", C.muted));

// Why
const r1 = row(root, "Why");
const goal = cell(r1, card("Goal", "Goal · Why"));
add(goal, txt(DATA.goal));
const prob = cell(r1, card("Problem", "Problem · Why"));
add(prob, txt(DATA.problem));
DATA.problemNeeds.forEach((q) => needs(prob, q));

// Who / What
const r2 = row(root, "Who + What");
const users = cell(r2, card("Users", "Users · Who"));
if (!DATA.users.length) needs(users, "Who are the main users?");
DATA.users.forEach((u) => lineWithTag(users, `${u.role}: ${u.need}`, u.confirm));
const exp = cell(r2, card("Type of experience", "Type of experience · What"));
add(exp, txt(DATA.experience.type, 15, "Semi Bold"));
add(exp, txt(`${DATA.experience.platform}  ·  Pattern: ${DATA.experience.pattern}`, 13, "Regular", C.muted));

// How
const flowWrap = stack("User flow", "VERTICAL", 14);
add(root, flowWrap);
add(flowWrap, label("User flow · How"));
const steps = stack("Steps", "HORIZONTAL", 12);
steps.layoutWrap = "WRAP"; steps.counterAxisSpacing = 12;
add(flowWrap, steps);
DATA.flow.forEach((s, i) => {
  const c = card(`Step ${i + 1}`, null, s.edge ? { fill: C.warnSoft, stroke: C.warnSoft } : {});
  c.paddingTop = c.paddingBottom = c.paddingLeft = c.paddingRight = 16;
  c.resize(180, 100); c.layoutSizingHorizontal = "FIXED";
  steps.appendChild(c);
  const dot = stack("Number", "HORIZONTAL", 0);
  dot.resize(28, 28); dot.primaryAxisSizingMode = "FIXED"; dot.counterAxisSizingMode = "FIXED";
  dot.primaryAxisAlignItems = "CENTER"; dot.counterAxisAlignItems = "CENTER";
  dot.cornerRadius = 14; dot.fills = solid(s.edge ? C.warnDot : C.accent);
  dot.appendChild(txt(s.edge ? "!" : String(i + 1), 13, "Bold", C.white));
  c.appendChild(dot);
  add(c, txt(s.step, 14, "Semi Bold"));
  if (s.screenName) {
    const link = add(c, txt("↗ " + s.screenName, 12, "Regular", C.accent));
    if (s.screenId) link.hyperlink = { type: "NODE", value: s.screenId };
  }
});
if (!DATA.flow.length) needs(flowWrap, "What are the main steps a user takes?");

// Arc
const arcWrap = stack("Current state to North star", "VERTICAL", 14);
add(root, arcWrap);
add(arcWrap, label("Current state → North star"));
const arc = row(arcWrap, "Journey");
const j = DATA.journey;
[["Today", j.today, {}], ["This release", j.release, { titleColor: C.accent }],
 ["North star ★", j.northStar, { fill: C.page, stroke: C.accent, strokeWeight: 2, titleColor: C.accent }]]
  .forEach(([t, body, o], i) => {
    const c = cell(arc, card(t, t, o));
    if (body) lineWithTag(c, body, i === 2 && j.northStarConfirm);
    else needs(c, `What does "${t}" look like?`);
  });

// Decisions / questions
const r3 = row(root, "Decisions + Questions");
const dec = cell(r3, card("Decisions", "Decisions made"));
(DATA.decisions.length ? DATA.decisions : ["None recorded yet"]).forEach((d) => add(dec, txt("• " + d)));
const qs = cell(r3, card("Open questions", "Open questions & risks"));
(DATA.questions.length ? DATA.questions : ["None recorded yet"]).forEach((q) => add(qs, txt("• " + q)));

// Gap checklist (only while items are open)
if (DATA.gaps.length) {
  const g = card("Fill the gaps", "Fill the gaps", { fill: C.warnSoft, stroke: C.warnSoft, titleColor: C.warn });
  add(root, g);
  add(g, txt("Reply to Claude with the numbers, e.g. \"1 yes, 3 about 40 a month\". Inferred items are tagged Confirm.", 13, "Regular", C.warn));
  DATA.gaps.forEach((x) => add(g, txt(`${x.n}.  ${x.kind}: ${x.text}`, 14)));
}

add(root, txt(`Generated by the Figma Project Snapshot skill · ${DATA.source}`, 12, "Regular", C.muted));

figma.viewport.scrollAndZoomIntoView([root]);
return { pageId: page.id, frameId: root.id };
