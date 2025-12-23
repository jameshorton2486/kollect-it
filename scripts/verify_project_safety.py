#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Phase 0 Verification Script
Ensures project safety files and structure are present.
"""

from pathlib import Path
import sys
import io

# Fix Windows console encoding for emoji
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

REQUIRED_PATHS = [
    Path("PROJECT_SAFETY.md"),
    Path(".cursor/rules/project-safety.mdc"),
    Path("scripts"),
]

missing = []

for path in REQUIRED_PATHS:
    if not path.exists():
        missing.append(str(path))

if missing:
    print("❌ Project safety verification FAILED")
    for m in missing:
        print(f"Missing: {m}")
    sys.exit(1)

print("✅ Project safety verification PASSED")

