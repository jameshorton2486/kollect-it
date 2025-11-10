#!/usr/bin/env python3
"""Fix all markdown linting errors in the workspace"""

import re
import os
from pathlib import Path

def fix_markdown_files():
    root = Path(".")
    
    # List of fixes to apply
    fixes = []
    
    # 1. Fix MD040 - Add language specifiers to code blocks
    for md_file in root.glob("**/*.md"):
        content = md_file.read_text(encoding='utf-8')
        original = content
        
        # Fix empty code blocks
        content = re.sub(r'^```\n(Phase|src/|###)', r'```text\n\1', content, flags=re.MULTILINE)
        content = re.sub(r'^```\n([A-Za-z])', r'```text\n\1', content, flags=re.MULTILINE)
        
        # Fix code blocks in specific files
        if "PHASE-1-COMPLETION-SUMMARY.md" in str(md_file):
            content = re.sub(r'```\nPhase 1:', '```text\nPhase 1:', content)
            content = re.sub(r'```\nPhase 2:', '```text\nPhase 2:', content)
            content = re.sub(r'```\nPhase 3:', '```text\nPhase 3:', content)
        
        if "PHASE-3-ADVANCED-FEATURES-GUIDE.md" in str(md_file):
            content = re.sub(r'```\nPhase 3:', '```text\nPhase 3:', content)
            content = re.sub(r'```\nsrc/', '```text\nsrc/', content)
        
        # 2. Fix MD022 - Add blank lines before headings
        content = re.sub(r'([^\n])\n(##+ )', r'\1\n\n\2', content)
        
        # 3. Fix MD032 - Add blank lines around lists
        content = re.sub(r'([^\n])\n(- )', r'\1\n\n\2', content)
        content = re.sub(r'(- [^\n]*)\n([^\n-])', r'\1\n\n\2', content)
        
        # 4. Fix MD036 - Convert **File: xxx** to proper headings
        content = re.sub(r'\n\*\*File: ([^*]+)\*\*', r'\n\n### File: \1', content)
        
        # 5. Fix MD029 - Ordered list numbering
        # For numbered lists, fix prefix
        lines = content.split('\n')
        in_list = False
        expected_num = 1
        for i, line in enumerate(lines):
            if re.match(r'^\d+\. ', line):
                if not in_list:
                    in_list = True
                    expected_num = 1
                match = re.match(r'^(\d+)\. (.+)$', line)
                if match:
                    lines[i] = f'{expected_num}. {match.group(2)}'
                    expected_num += 1
            elif line.strip() and not re.match(r'^\d+\. ', line) and not line.startswith(' '):
                in_list = False
        
        content = '\n'.join(lines)
        
        if content != original:
            md_file.write_text(content, encoding='utf-8')
            print(f"✓ Fixed: {md_file}")
        else:
            print(f"~ Skipped: {md_file}")

if __name__ == "__main__":
    fix_markdown_files()
    print("\n✅ All markdown files processed!")
