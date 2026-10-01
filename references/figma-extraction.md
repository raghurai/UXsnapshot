# Extracting project context from Figma

Tool names vary by connector version. With the official Figma MCP server they are typically `get_metadata`, `get_screenshot`, `get_design_context`, and sometimes `get_figjam`. Use whichever equivalents are available; the order below matters more than the exact names.

## Order of operations

1. **Map the structure first** (`get_metadata` on the file or node). Get page names, sections, and top-level frame names before pulling anything heavy. This tells you how the project is organized and where the narrative lives. Screenshotting everything first wastes context and buries the signal.

2. **Find the context-rich places.** In order of usefulness:
   - Cover or "Read me" pages
   - Section names and large text labels on the canvas (e.g. "Current state", "Explorations", "Final", "V2 / Future")
   - Sticky notes, callouts and annotation components
   - FigJam boards linked to or embedded in the file (use `get_figjam` if available): research synthesis, journey maps and flows often live here
   - Prototype connections between frames, which reveal the intended user flow
   - Comments, if the connector exposes them

3. **Classify frames into buckets** by name and position:
   - *Current state / as-is* → feeds Problem and "Today"
   - *Final / ready for dev / handoff* → feeds User flow and "This release"
   - *Explorations / future / vision / v2* → feeds "North star"
   - *Components / specs / redlines* → usually skip for a stakeholder snapshot

4. **Screenshot only the key frames** (`get_screenshot`): typically the 3–6 frames that make up the main flow, plus one current-state frame if it exists. Look at them; they're your evidence for the flow and for inferred users.

5. **Pull text where needed** (`get_design_context` on specific frames) to capture real UI copy, button labels, table headers and empty-state messages. These reveal roles, permissions and edge cases.

## Reading signals

| What you see | What it likely means |
|---|---|
| Approve / Reject buttons, status pills | A reviewer or approver role; a multi-step workflow |
| Admin, Settings, Permissions screens | An admin user distinct from the end user |
| Empty states, error banners, validation messages | Edge paths to include in the flow |
| Multiple versions of one screen side by side | An open decision; check annotations for which won |
| Frames named "v1/v2/final_final" | Iteration history; use the latest for "This release" |
| Strikethrough frames or "Deprecated" labels | Rejected directions, possible "decisions made" |

Anything you derive from a row in this table is **inferred**. Mark it *Confirm*.

## When the file is large

If the file has many pages, summarize the structure for the user and ask which page or section is the project, unless the link already points to a node. Don't try to cover an entire design-system or multi-project file in one snapshot.

## When there's no Figma connector

Work from screenshots the user uploads. Frame names and annotations are often lost in exports, so expect more *Needs input* items, and say so.
