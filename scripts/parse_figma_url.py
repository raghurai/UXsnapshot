#!/usr/bin/env python3
"""Parse a Figma URL into file key, node id and file type.

Usage: python parse_figma_url.py "<figma url>"
Prints JSON: {"file_key": ..., "node_id": ..., "file_type": ..., "branch_key": ...}

Node ids appear in URLs as "12-345"; Figma APIs expect "12:345". Both are returned.
"""
import json
import re
import sys
from urllib.parse import urlparse, parse_qs, unquote


def parse(url: str) -> dict:
    parsed = urlparse(url.strip())
    if "figma.com" not in parsed.netloc:
        raise ValueError("Not a figma.com URL")

    parts = [p for p in parsed.path.split("/") if p]
    # /design/<key>/<name>, /file/<key>/..., /board/<key>/..., /proto/<key>/...
    # /design/<key>/branch/<branchKey>/<name>
    if len(parts) < 2:
        raise ValueError("Could not find a file key in the URL")
    file_type, file_key = parts[0], parts[1]
    branch_key = None
    if len(parts) >= 4 and parts[2] == "branch":
        branch_key = parts[3]

    query = parse_qs(parsed.query)
    raw_node = query.get("node-id", [None])[0]
    node_id_url = unquote(raw_node) if raw_node else None
    node_id_api = node_id_url.replace("-", ":") if node_id_url else None
    if node_id_api and not re.fullmatch(r"[\w:;]+", node_id_api):
        node_id_api = None

    return {
        "file_type": file_type,  # design | file | board (FigJam) | proto | slides
        "file_key": branch_key or file_key,
        "main_file_key": file_key,
        "branch_key": branch_key,
        "node_id": node_id_api,
        "node_id_url": node_id_url,
        "is_figjam": file_type == "board",
    }


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)
    try:
        print(json.dumps(parse(sys.argv[1]), indent=2))
    except ValueError as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
