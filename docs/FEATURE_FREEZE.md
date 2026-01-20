# Feature Freeze - Pre-Launch

**Date:** January 19, 2026  
**Status:** 🟡 **ACTIVE**

---

## Purpose

This document defines what changes are allowed, blocked, or require special review during the pre-launch feature freeze period.

---

## 🟢 ALLOWED (No Review Required)

### Documentation
- ✅ Documentation updates and clarifications
- ✅ README improvements
- ✅ Code comments and inline documentation
- ✅ Architecture decision records (ADRs)

### Bug Fixes (Critical Only)
- ✅ Security vulnerabilities
- ✅ Data loss prevention
- ✅ Production-breaking bugs
- ✅ Build failures

### Configuration
- ✅ Environment variable updates (via Vercel)
- ✅ CI/CD workflow improvements
- ✅ Dependency security updates

---

## 🟡 REQUIRES PR + REVIEW

### Code Changes
- ⚠️ Any new features
- ⚠️ Refactoring (unless critical bug fix)
- ⚠️ Performance optimizations (unless blocking)
- ⚠️ Design system changes
- ⚠️ API route modifications

### Dependencies
- ⚠️ New package additions
- ⚠️ Major version upgrades
- ⚠️ Breaking dependency changes

### Database
- ⚠️ Schema migrations
- ⚠️ Data migrations
- ⚠️ Prisma schema changes

---

## 🔴 BLOCKED (Do Not Merge)

### Features
- ❌ New user-facing features
- ❌ New admin features (unless security-related)
- ❌ UI/UX redesigns
- ❌ New integrations

### Infrastructure
- ❌ Deployment platform changes
- ❌ Database provider changes
- ❌ CDN configuration changes

### Testing
- ❌ New test frameworks
- ❌ Test infrastructure changes

---

## Review Process

### For Allowed Changes
1. Create PR with clear description
2. Ensure CI passes
3. Get one approval
4. Merge

### For Review-Required Changes
1. Create PR with detailed explanation
2. Link to issue or justification
3. Get two approvals
4. Ensure all tests pass
5. Manual QA if UI/UX affected
6. Merge

### For Blocked Changes
- Document in backlog
- Schedule for post-launch
- Do not create PR

---

## Emergency Override

In case of critical production issues:
1. Create hotfix branch: `hotfix/description`
2. Fix the issue
3. Create PR with "EMERGENCY" prefix
4. Get approval from maintainer
5. Merge immediately
6. Document in post-mortem

---

## Freeze Duration

**Start:** January 19, 2026  
**End:** TBD (after successful launch and stabilization)

---

## Exceptions

Exceptions to this freeze require:
- Written approval from project maintainer
- Clear justification
- Risk assessment
- Rollback plan

---

*This freeze ensures stability and predictability during the critical pre-launch period.*
