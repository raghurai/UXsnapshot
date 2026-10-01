---
name: figma-project-snapshot
description: Turn a Figma file, frame, or page (link or screenshots) into a one-page project snapshot that lets any stakeholder understand a design project in two minutes — the why, who, what and how, the problem, users, user flow, and the path from current state to north star. Claude fills in everything the file supports, flags the rest, and the user fills the gaps in a follow-up reply. Use this whenever someone shares a Figma link or design screenshots, or describes a design project, and wants a project summary, overview, brief, one-pager, status update, stakeholder update, handoff summary, kickoff recap, or "help people understand this project" — even if they don't say the word "snapshot". Also use it when the user answers Confirm / Needs input items or asks to update an existing snapshot.
---

# Figma Project Snapshot

Produce a single-page snapshot of a design project from its Figma file, so a PM, engineer, exec or new teammate can understand the project without opening Figma or sitting through a walkthrough.

The snapshot follows one framework, read top to bottom as a journey from **Current state → North star**:

> **Solution = Why + Who + What + How**

| Section | Answers | Framework part |
|---|---|---|
| TL;DR | The whole project in one sentence | all four |
| Goal | What we're setting out to achieve | Why |
| Problem | What's broken or missing today, and the cost of it | Why |
| Users | Who this is for, and what each person needs | Who |
| Type of experience | What kind of thing we're building | What |
| User flow | How someone moves through it, step by step | How |
| Current state → North star | Where it is now, what ships next, where it's headed | the arc |
| Decisions, open questions, risks | What's settled, what isn't | — |

Keep these sections and this order. People who read many snapshots learn where to look, and that consistency is most of the value.

## Workflow

### 1. Get the Figma input

Accept any of these:

- **Figma link (preferred).** Run `python scripts/parse_figma_url.py "<url>"` to pull out the file key and node id. If no node id is in the link, ask which page or section to cover only if the file is clearly large; otherwise start at the file root.
- **Screenshots or exported frames.** Work from the images directly. Tell the user once that a link would give richer results (layer names, annotations, comments).
- **Both, plus notes.** Treat a PRD, Slack thread or brief the user pastes as a primary source. It usually fills Goal and Problem better than the canvas can.
- **No file, just a description.** If the user describes the project in words, build the snapshot from that. Their statements count as observed; everything else follows the same Confirm / Needs input rules. Offer once that a Figma link would fill the User flow and screens.

### 2. Extract what's in the file

If Figma tools are available, read `references/figma-extraction.md` and follow it. In short: map the structure first (pages, sections, frame names), then screenshot the key frames, then pull text and annotations. Designers often leave the best context in sticky notes, section labels, cover pages and comments, not in the UI itself, so read those first.

### 3. Fill the framework, and label your confidence

Every statement in the snapshot comes from one of three places. Track which:

- **Observed**: it's on the canvas, in an annotation, or in notes the user gave you. State it plainly.
- **Inferred**: you're reasoning from the screens (e.g. "an Approve button implies an approver role"). Include it, but mark it with a *Confirm* tag so the owner can verify before sharing.
- **Missing**: nothing supports it. Write `Needs input:` and a specific question, e.g. "Needs input: what volume of template requests does support handle per month?"

Don't invent metrics, research findings, dates or user quotes to make a section look complete. A snapshot that stakeholders trust with two honest gaps is worth more than a complete-looking one with a fabricated number, because a single wrong number discredits the whole page.

Section guidance (see `references/section-guide.md` for examples of strong and weak versions of each):

- **TL;DR**: one sentence built as *For [who], we're [what] so that [why], by [how].* Write it last.
- **Goal**: an outcome, not a feature list. "Partners submit compliant documents first time" beats "Build upload page".
- **Problem**: the current-state pain, who feels it, and the evidence. Pull from "current state" or "as-is" frames if they exist.
- **Users**: 1–4 roles, each with what they need to get done. Infer roles from permissions, admin screens and approval steps.
- **Type of experience**: classify it, for example net-new feature, redesign, workflow, self-serve tool, admin/config, dashboard; plus platform and the main interaction pattern (wizard, table + detail, form, etc.).
- **User flow**: 4–8 numbered steps named in the user's language, each tied to a screen name, including the main error or edge path if the file shows one.
- **Current state → North star**: three stops — *Today* (the problem state), *This release* (what the designs ship), *North star* (the vision, from exploration or "future" frames). If there's no vision in the file, write one line and tag it *Confirm*.
- **Decisions / open questions / risks**: decisions come from annotations and resolved comments; open questions from unresolved comments, "TBD" labels and your Needs input list.

### 4. Write for stakeholders, not designers

Use plain language: "the upload screen", not "Frame 2187 / Upload_v3_final". Short sentences, active voice, no design jargon without a gloss. Someone who has never seen the project should finish reading knowing what it is, why it matters, and what's being asked of them.

### 5. Produce the output

Default to a single self-contained HTML page built from `assets/snapshot-template.html`. Replace every `{{PLACEHOLDER}}`, delete blocks that don't apply (for example the screens strip if there are no screenshots), and keep the section order. Embed screenshots as data URIs only if they're small; otherwise list screen names with the Figma link. Keep the page to roughly one printed page — trim words before dropping sections.

Use another format when asked: Markdown (same headings, same order), a slide, or a doc. If the environment has a document or artifact publishing tool, use it so the snapshot is shareable as a link.

### 6. Hand it back with a gap checklist

Below the snapshot, list every open item as one numbered checklist the user can answer in a single reply. Confirm items first, then Needs input:

```
Fill the gaps (reply with the numbers, e.g. "1 yes, 2 no admins in v1, 3 about 40 a month"):

Confirm
1. Users: there's an internal reviewer who approves uploads.
2. Users: an admin role publishes templates.

Needs input
3. Problem: how many resubmissions happen per month today?
4. North star: is in-browser form filling the long-term vision?
```

Number items continuously across both groups so short replies like "3 about 40" map cleanly. If there are no open items, say the snapshot is ready to share.

## Filling the gaps

When the user replies to the checklist, or tells you something new about the project at any point, update the snapshot rather than starting over.

1. **Map each answer to its item.** Accept any form: numbers ("1 yes"), the item's wording ("reviewer is right"), or free text ("there's no admin in v1"). If an answer is ambiguous, apply the rest and ask about that one item only.
2. **Apply the answer.**
   - *Confirmed* → remove the Confirm tag; the statement is now observed.
   - *Corrected* → replace the statement with the user's version and remove the tag. Check whether the correction changes other sections (removing a role can remove a flow step or a decision) and update those too.
   - *Answered Needs input* → replace the question with the answer, in plain stakeholder language.
   - *"Don't know" / "skip"* → keep it as an open question in the Decisions, open questions & risks section rather than leaving a Needs input box in the body.
   - *New information the user volunteers* → add it to the right section as observed.
3. **Rewrite the TL;DR** if any answer changed the who, what, why or how.
4. **Republish the same snapshot** (same file or same artifact link) so the user keeps one shareable version, not a new copy each round.
5. **Report back briefly**: what changed, and a new checklist of anything still open, keeping the original numbers for unchanged items so the user isn't confused. When nothing is open, say it's ready to share.

Never resolve an item yourself because the user didn't mention it. Unanswered items stay open.
