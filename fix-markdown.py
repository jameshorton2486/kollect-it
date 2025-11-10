#!/usr/bin/env python
"""
Small utility to apply targeted regex fixes to specific Markdown files
(e.g., fixing the first ``` fence to use ```text).
"""

import re
from pathlib import Path


REPO_ROOT = Path(__file__).parent

# Map: filename -> list of (pattern, replacement, occurrence_index)
files_to_fix = {
    # Fix the first bare ``` in PHASE 1 so it becomes ```text
    "PHASE-1-COMPLETION-SUMMARY.md": [
        (r"^```\n", "```text\n", 0),
    ],
    # Add any PHASE 3 tweaks here as needed
    "PHASE-3-ADVANCED-FEATURES-GUIDE.md": [
        # Example: also fix the first bare fence
        (r"^```\n", "```text\n", 0),
        # You can add more tuples like:
        # (r"kollect-it website", "Kollect-It website", 0),
    ],
}


def apply_fixes() -> None:
    for relative_path, patterns in files_to_fix.items():
        filepath = REPO_ROOT / relative_path

        if not filepath.exists():
            print(f"[skip] File not found: {filepath}")
            continue

        try:
            content = filepath.read_text(encoding="utf-8")
        except Exception as e:
            print(f"[error] Could not read {filepath}: {e}")
            continue

        original = content

        for pattern, replacement, occurrence in patterns:
            matches = list(re.finditer(pattern, content, re.MULTILINE))
            if not matches:
                # Nothing to replace for this pattern
                continue
            if occurrence < 0 or occurrence >= len(matches):
                # Occurrence index out of range, skip safely
                continue

            start = matches[occurrence].start()
            end = matches[occurrence].end()
            content = content[:start] + replacement + content[end:]

        if content != original:
            try:
                filepath.write_text(content, encoding="utf-8")
                print(f"[fix] Updated: {filepath}")
            except Exception as e:
                print(f"[error] Could not write {filepath}: {e}")
        else:
            print(f"[ok] No changes needed: {filepath}")


if __name__ == "__main__":
    apply_fixes()
