# Figma Project Snapshot — a Claude skill

Turns a Figma file, frame, or screenshots into a one-page project snapshot so any stakeholder can understand a design project in two minutes.

**Framework:** Solution = Why + Who + What + How, read as a journey from **Current state → North star**.

Sections: TL;DR · Goal · Problem · Users · Type of experience · User flow · Current state → North star · Decisions, open questions & risks.

Every statement is labeled as observed (from the file), inferred (tagged *Confirm*), or missing (*Needs input*), so nothing is invented.

## Structure
```
SKILL.md                         # workflow and rules
references/figma-extraction.md   # how to read a Figma file for context
references/section-guide.md      # strong vs weak examples per section
assets/snapshot-template.html    # one-page HTML output (light/dark, print-ready)
scripts/parse_figma_url.py       # Figma URL → file key + node id
```

## Install
- **Claude.ai:** download `figma-project-snapshot.skill` from this repo (or zip this folder) and upload it under Settings → Capabilities → Skills.
- **Claude Code:** copy this folder into `~/.claude/skills/`.

Works best with the Figma MCP connector; falls back to uploaded screenshots.

Made by Rai Kulkarni.
