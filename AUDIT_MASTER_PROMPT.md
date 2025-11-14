# KOLLECT-IT MARKETPLACE - UNIFIED AUDIT & AUTO-FIX SYSTEM

## Master Prompt for Claude AI Agents

---

## 🎯 MISSION STATEMENT

You are an expert codebase auditor and automated remediation system. Your mission is to:

1. **Perform comprehensive analysis** of the entire Kollect-It Marketplace codebase
2. **Identify issues** across security, performance, code quality, and configuration
3. **Automatically fix** all safe, non-breaking issues
4. **Generate detailed reports** for issues requiring manual review
5. **Create production-ready scripts** for Windows environments

---

## 📋 EXECUTION PROTOCOL

### PHASE 0: INITIALIZATION & SAFETY

#### Create Safety Branch

```bash
git checkout -b automated-fixes-$(date +%Y%m%d-%H%M%S)
```

#### Document Baseline State

- Current git commit: `git rev-parse HEAD`
- Current branch: `git branch --show-current`
- Package.json state
- File count: `find src -type f | wc -l`
- Lines of code: `find src -name "*.ts" -o -name "*.tsx" | xargs wc -l`

#### Environment Verification

- ✅ Node.js version: `node --version`
- ✅ npm version: `npm --version`
- ✅ Git status: `git status --short`
- ✅ No uncommitted changes (or commit them first)

---

### PHASE 1: CONFIGURATION & ENVIRONMENT AUDIT

#### 1.1 Environment Variables

**Analysis Tasks:**

- Compare `.env.local`, `.env.example`, `.env.development`, `.env.production`
- Cross-reference with actual usage: Search for `process.env.` in all files
- Identify missing variables (used but not documented)
- Identify unused variables (documented but never used)
- Check for hardcoded secrets in tracked files
- Verify sensitive variables are in `.gitignore`

**Auto-Fix Actions:**

```bash
# Create .env.example if missing
# Remove unused env var declarations
# Add missing variables with placeholder values
```

**Report Generation:**

- `ENV_AUDIT.md` - All environment variables with usage locations
- `ENV_SECRETS.md` - Any hardcoded secrets found (CRITICAL)
- `ENV_MISSING.md` - Variables used in code but not documented

---

#### 1.2 Git & Version Control

**Analysis Tasks:**

- Review `.gitignore` completeness
- Find tracked files that should be ignored (`.env*`, `node_modules/`, `dist/`, `.next/`, `*.log`)
- Identify large files (>1MB) in git history
- Check for sensitive files accidentally committed
- Detect duplicate or conflicting gitignore rules

**Auto-Fix Actions:**

```bash
# Update .gitignore with comprehensive rules
# Remove duplicate/conflicting rules
# Add missing common ignore patterns
# Create .gitattributes for line ending normalization
```

**Report Generation:**

- `GIT_AUDIT.md` - Current gitignore analysis
- `GIT_LARGE_FILES.md` - Files >1MB that should be removed
- `GIT_SENSITIVE.md` - Accidentally committed sensitive files (CRITICAL)

---

#### 1.3 Dependencies & Packages

**Analysis Tasks:**

```bash
# Check for unused dependencies
npm ls --depth=0 2>&1 | grep "extraneous"

# Security audit
npm audit --json

# Check for outdated packages
npm outdated --json
```

**Auto-Fix Actions:**

```bash
# Remove extraneous packages
npm prune

# Eliminate duplicate dependencies
npm dedupe

# Auto-fix security vulnerabilities (non-breaking)
npm audit fix
```

**Report Generation:**

- `DEPENDENCIES_UNUSED.md` - Safe-to-remove packages
- `DEPENDENCIES_OUTDATED.md` - Packages with available updates
- `DEPENDENCIES_VULNERABLE.md` - Security vulnerabilities (CRITICAL)
- `DEPENDENCIES_MISSING.md` - Imported but not declared

---

### PHASE 2: CODE QUALITY & STRUCTURE AUDIT

#### 2.1 Unused Code Detection

**Analysis Tasks:**

- Find unused imports across all `.ts`, `.tsx`, `.js`, `.jsx` files
- Identify unused functions, variables, types, interfaces
- Detect unreachable code (code after return statements)
- Locate large commented-out code blocks (>10 lines)
- Find exported functions/components never imported elsewhere
- Identify unused React hooks

**Auto-Fix Actions:**

```bash
# Remove unused imports (ESLint can do this)
npx eslint . --fix

# Remove commented-out code blocks
# (Manual review recommended for safety)
```

**Report Generation:**

- `UNUSED_CODE.md` - All unused code with file paths and line numbers
- `UNUSED_EXPORTS.md` - Exported items never imported
- `DEAD_CODE.md` - Unreachable code segments

---

#### 2.2 Duplicate Code Detection

**Analysis Tasks:**

- Find duplicate function implementations (>15 lines, >80% similarity)
- Identify repeated API call patterns
- Detect duplicate database query logic
- Find copy-pasted React components or hooks
- Locate repeated utility functions across different files
- Check for duplicate type/interface definitions

**Auto-Fix Actions:**

- Document all duplicates with severity ranking
- Suggest centralized locations for shared code
- For simple utils, create centralized version in `/lib/utils/`

**Report Generation:**

- `DUPLICATE_CODE.md` - All duplicates with file locations
- `REFACTOR_OPPORTUNITIES.md` - High-value refactoring suggestions

---

#### 2.3 File Organization

**Analysis Tasks:**

- Map entire directory structure
- Find files in incorrect directories
- Identify orphaned files (not imported anywhere, not entry points)
- Locate empty or nearly-empty files (<5 lines)
- Check naming convention consistency
- Find test files without corresponding source files

**Auto-Fix Actions:**

```bash
# Delete empty files
find src -type f -empty -delete

# Remove orphaned files (with confirmation list)
# (Manual review recommended)
```

**Report Generation:**

- `FILE_ORGANIZATION.md` - Current vs. recommended structure
- `ORPHANED_FILES.md` - Files safe to delete
- `MISPLACED_FILES.md` - Files in wrong directories

---

### PHASE 3: DATABASE & PRISMA AUDIT

#### 3.1 Schema Analysis

**Analysis Tasks:**

- Review `prisma/schema.prisma` completely
- Find unused models (defined but never queried)
- Identify unused fields in models
- Check for missing indexes on frequently queried fields
- Verify relationship definitions
- Find missing cascade rules (onDelete, onUpdate)
- Check for inconsistent field naming
- Verify enum definitions are used

**Auto-Fix Actions:**

- Add missing indexes based on common query patterns
- Add missing cascade rules with safe defaults
- Standardize field naming conventions
- Add helpful comments to complex relationships

**Report Generation:**

- `PRISMA_SCHEMA_AUDIT.md` - Complete schema analysis
- `PRISMA_INDEXES.md` - Missing indexes with performance impact
- `PRISMA_UNUSED.md` - Unused models and fields
- `PRISMA_MIGRATIONS.md` - Migration cleanup recommendations

---

#### 3.2 Query Optimization

**Analysis Tasks:**

- Scan all Prisma queries in the codebase
- Find N+1 query problems (missing `include` statements)
- Identify over-fetching (no `select` statement)
- Locate queries without pagination
- Find raw SQL queries that could use Prisma
- Check for missing error handling
- Identify transactions that could be optimized

**Auto-Fix Actions:**

- Add pagination to findMany queries (default: take 50)
- Add error handling to unprotected queries
- Document optimization opportunities

**Report Generation:**

- `PRISMA_N_PLUS_1.md` - N+1 query problems with solutions
- `PRISMA_OPTIMIZATION.md` - Query optimization opportunities
- `PRISMA_RAW_SQL.md` - Raw SQL queries to convert

---

### PHASE 4: SECURITY & BEST PRACTICES AUDIT

#### 4.1 Security Vulnerabilities

**Analysis Tasks:**

- Scan for exposed API keys, secrets, tokens in code
- Check for hardcoded credentials
- Review all API routes for authentication checks
- Verify authorization logic (user permissions)
- Check file upload handlers for security issues
- Review CORS configuration in `next.config.js`
- Check for SQL injection vulnerabilities
- Verify rate limiting on API endpoints
- Check for XSS vulnerabilities in user input
- Review cookie security settings

**Auto-Fix Actions:**

- Add authentication checks to unprotected API routes
- Add input validation where missing
- Implement rate limiting middleware
- Add security headers to Next.js config

**Report Generation:**

- `SECURITY_CRITICAL.md` - Critical vulnerabilities (IMMEDIATE ACTION)
- `SECURITY_HIGH.md` - High-priority security issues
- `SECURITY_MEDIUM.md` - Medium-priority improvements
- `SECURITY_API_ROUTES.md` - API route security analysis

---

#### 4.2 Error Handling

**Analysis Tasks:**

- Find try-catch blocks without error logging
- Identify unhandled promise rejections
- Check for missing error boundaries in React
- Review API routes for consistent error response format
- Find database operations without error handling
- Check for uncaught async/await errors

**Auto-Fix Actions:**

- Add error logging to empty catch blocks
- Add .catch() handlers to dangling promises
- Standardize error response format across API routes

**Report Generation:**

- `ERROR_HANDLING.md` - Missing error handling with locations
- `ERROR_BOUNDARIES.md` - Recommended error boundary locations

---

### PHASE 5: PERFORMANCE & OPTIMIZATION AUDIT

#### 5.1 Bundle Size Optimization

**Analysis Tasks:**

- Analyze `package.json` for large dependencies
- Identify libraries with lighter alternatives
- Find unused exports from imported libraries
- Check for dynamic imports that should be code-split
- Review image optimization usage (next/image)
- Find large JSON or data files in source code
- Check for inefficient imports

**Auto-Fix Actions:**

```javascript
// Convert full library imports to specific imports
// Before: import _ from 'lodash'
// After: import { map } from 'lodash'
```

**Report Generation:**

- `BUNDLE_ANALYSIS.md` - Bundle size breakdown
- `BUNDLE_OPTIMIZATION.md` - Specific optimization recommendations
- `HEAVY_DEPENDENCIES.md` - Large packages with alternatives

---

#### 5.2 React Performance

**Analysis Tasks:**

- Find missing `key` props in list renders
- Identify components that should be memoized
- Check for inline function definitions in JSX
- Review useEffect dependencies
- Find expensive calculations that should use useMemo
- Identify callback functions that should use useCallback
- Check for state updates causing unnecessary re-renders

**Auto-Fix Actions:**

```javascript
// Add missing key props to list renders
// Add React.memo to pure components
// Move inline functions outside render
```

**Report Generation:**

- `REACT_PERFORMANCE.md` - React-specific performance issues
- `REACT_RERENDERS.md` - Components causing excessive re-renders
- `REACT_HOOKS.md` - Hook optimization opportunities

---

### PHASE 6: TYPESCRIPT & TYPE SAFETY AUDIT

#### 6.1 Type Issues

**Analysis Tasks:**

- Find all `any` types that should be properly typed
- Identify type assertions (`as`) that might hide bugs
- Check for missing return types on functions
- Review interfaces vs. types usage
- Find implicit `any` from missing type annotations
- Check for unused type definitions
- Verify strict mode compliance
- Find non-null assertions (!) that could be dangerous

**Auto-Fix Actions:**

```typescript
// Add explicit return types to functions
// Replace 'any' with 'unknown' where appropriate
// Enable strict mode flags in tsconfig.json
// Remove unused type definitions
```

**Report Generation:**

- `TYPESCRIPT_ANY.md` - All `any` types with suggested replacements
- `TYPESCRIPT_STRICT.md` - Strict mode compliance issues
- `TYPESCRIPT_SAFETY.md` - Type safety improvements

---

### PHASE 7: DOCUMENTATION & MAINTENANCE AUDIT

#### 7.1 Code Documentation

**Analysis Tasks:**

- Find complex functions without JSDoc comments (>20 lines)
- Identify API routes without documentation
- Check for outdated TODO/FIXME comments (>6 months old)
- Review README.md accuracy
- Find public utility functions without usage examples
- Check for missing inline comments in complex logic

**Auto-Fix Actions:**

```javascript
/**
 * Add JSDoc templates to undocumented functions
 * @param {string} param - Description
 * @returns {Promise<void>}
 */
```

**Report Generation:**

- `DOCUMENTATION.md` - Missing documentation with priorities
- `TODO_AUDIT.md` - All TODO/FIXME comments with age analysis
- `README_UPDATES.md` - Required README updates

---

## 🔧 AUTO-FIX COMMIT STRATEGY

For each category of fixes, create a separate commit:

```bash
# Environment fixes
git add .env.example .gitignore
git commit -m "chore(env): add missing env vars to example, update gitignore"

# Dependency cleanup
git add package.json package-lock.json
git commit -m "chore(deps): prune unused deps and dedupe"

# Code formatting
git add .
git commit -m "style: format code with Prettier"

# ESLint fixes
git add .
git commit -m "style: apply ESLint auto-fixes"

# Type improvements
git add .
git commit -m "refactor(types): improve type safety, remove 'any' types"

# Documentation
git add .
git commit -m "docs: add JSDoc comments to functions"

# Performance
git add .
git commit -m "perf: optimize React components, add key props"

# Security
git add .
git commit -m "security: add authentication checks to API routes"
```

---

## 📊 FINAL DELIVERABLES

### 1. AUDIT_SUMMARY.md

Executive summary with:

- Total files analyzed
- Total issues found
- Issues auto-fixed
- Issues requiring manual review
- Statistics by severity

### 2. ACTION_PLAN.md

Prioritized action plan with:

- Phase 1: Critical (do now)
- Phase 2: High (this week)
- Phase 3: Medium (this sprint)
- Phase 4: Low (when possible)

### 3. Detailed Reports by Category

- CRITICAL/ - Security vulnerabilities, breaking bugs
- HIGH/ - Performance issues, major code quality
- MEDIUM/ - Code organization, minor optimizations
- LOW/ - Documentation, cosmetic improvements

### 4. Automated Scripts

- `automated-fixes.ps1` - PowerShell script for Windows
- `automated-fixes.sh` - Bash script for Git Bash/Linux

---

## 🎯 SUCCESS CRITERIA

This audit is successful when:

1. ✅ Every file has been analyzed
2. ✅ All critical security issues are documented
3. ✅ All safe fixes have been applied and committed
4. ✅ All reports are generated with specific, actionable information
5. ✅ Scripts are ready to run for future audits
6. ✅ A clear action plan exists for remaining issues
7. ✅ The codebase is in a cleaner, more maintainable state

---

## 🚀 EXECUTION INSTRUCTIONS

### For Claude in VS Code:

1. Open your project in VS Code
2. Open Claude Chat
3. Paste this entire prompt
4. Let Claude work autonomously
5. Review the generated reports

### For Claude Desktop:

1. Open Claude Desktop
2. Paste this entire prompt
3. Provide access to your codebase via file uploads or repository access
4. Review the generated reports

### For Automated Execution:

Use the provided PowerShell script:

```powershell
.\RUN_AUDIT.ps1
```

---

## 📝 CRITICAL REQUIREMENTS

### Specificity Requirements

- ✅ Always include exact file paths
- ✅ Always include line numbers
- ✅ Always include actual code snippets for context
- ✅ Always provide specific fix instructions

### Safety Requirements

- ✅ Never delete files without listing them first
- ✅ Never modify schema files without explicit approval
- ✅ Never auto-fix breaking changes
- ✅ Always commit changes in logical, reviewable chunks
- ✅ Always work in a separate branch

### Automation Requirements

- ✅ Generate PowerShell scripts that can run unattended
- ✅ Include error handling in all scripts
- ✅ Provide rollback instructions for every change
- ✅ Log all actions taken

### Comprehensiveness Requirements

- ✅ Analyze every file in the repository
- ✅ Don't skip directories
- ✅ Cross-reference findings
- ✅ Provide complete statistics

---

## 🔄 ITERATION & IMPROVEMENT

After completing the audit:

1. Review all generated reports
2. Fix critical issues
3. Test thoroughly
4. Run audit again to verify fixes
5. Track improvements over time

---

## 📞 SUPPORT

For issues with this audit system:

1. Review the generated log files
2. Check individual reports for guidance
3. Consult the Kollect-It development documentation

---

**BEGIN EXECUTION NOW**

Start with Phase 0: Initialization & Safety.  
Proceed systematically through all phases.  
Provide status updates after completing each phase.

---

**Version:** 1.0.0  
**Last Updated:** 2025-01-14  
**Maintained by:** Kollect-It Development Team
