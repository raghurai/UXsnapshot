# Section guide: strong vs weak

Running example: a document management feature where partners download a required document template, fill it in, and upload it back.

## TL;DR
- Weak: "A new document management feature with download and upload."
- Strong: "For supplier partners, we're adding a document center where they download the right template and upload it back, so compliance documents arrive complete the first time instead of over email."

Why: the strong version names who, what, why and how in one breath. Write it last, after the other sections are settled.

## Goal
- Weak: "Build a download and upload page."
- Strong: "Partners submit the correct, complete documents without emailing support."

Why: a goal is an outcome someone can check later. A feature list is a solution.

## Problem
- Weak: "The current process is bad."
- Strong: "Today partners request templates by email, often fill in outdated versions, and send files back through the same thread. Reviewers chase missing fields manually. *Needs input: how many resubmissions happen per month?*"

Why: name the current behavior, who it hurts, and the evidence, or flag the missing evidence.

## Users
- Weak: "Users."
- Strong:
  - **Partner contact**: finds the right template, completes it, uploads it, sees whether it was accepted.
  - **Internal reviewer** *(Confirm)*: checks submissions and approves or rejects with a reason.
  - **Admin** *(Confirm)*: publishes and versions templates.

Why: roles plus the job each needs to do. Tag inferred roles.

## Type of experience
- Weak: "Web app."
- Strong: "Net-new feature inside the partner portal (web, desktop-first). Pattern: table of required documents with a per-row download → upload → status loop."

## User flow
- Weak: "User downloads and uploads."
- Strong:
  1. Partner opens **Documents** and sees which ones are required and their status.
  2. Downloads the template for a required document.
  3. Fills it in offline.
  4. Uploads it from the same row; the file is checked for type and size.
  5. Sees status change to *In review*.
  6. Gets approved, or gets a rejection reason and re-uploads (edge path).

Why: steps in the user's words, tied to screens, with the main edge path.

## Current state → North star
- **Today**: templates by email, no version control, status unknown to partners.
- **This release**: self-serve download and upload with status tracking.
- **North star** *(Confirm)*: documents completed in-browser with smart pre-fill, so nothing is downloaded at all.

## Decisions, open questions, risks
- Decision: one upload per required document; no bulk upload in v1 (from annotation).
- Open question: do expired documents notify partners automatically?
- Risk: template versioning; partners may upload an outdated version they saved earlier.
