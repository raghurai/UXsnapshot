---
name: figma-project-snapshot
description: Turn a Figma file, frame, or page (link or screenshots) into a one-page project snapshot that lets any stakeholder understand a design project in two minutes — the why, who, what and how, the problem, users, user flow, and the path from current state to north star. Use this whenever someone shares a Figma link or design screenshots and wants a project summary, overview, brief, one-pager, status update, stakeholder update, handoff summary, kickoff recap, or "help people understand this project" — even if they don't say the word "snapshot".
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

### 6. Hand it back

Below the snapshot, give the user a short list of every *Confirm* and *Needs input* item so they can resolve them in one pass before sharing. Offer to update the snapshot once they answer.
