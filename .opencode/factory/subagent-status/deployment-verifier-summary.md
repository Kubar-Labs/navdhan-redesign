# Deployment Verifier Summary

**URL:** http://localhost:3001
**Date:** 2026-06-22
**Verdict:** PASS WITH OBSERVATIONS

## What was checked

1. Multi-Step Apply Wizard (`/en/apply` and `/hi/apply`)
2. Legal pages (`/en/legal/terms-of-service` and all `/hi/legal/*` pages)
3. Team page (`/en/team` and `/hi/team`)

## Results

| Check                                                                                | Status                                        |
| ------------------------------------------------------------------------------------ | --------------------------------------------- |
| `/en/apply` Step 1 loads and proceeds to Step 2                                      | PASS                                          |
| `/en/apply` Step 2 exposes `fullName` and `email` inputs                             | PASS                                          |
| `/en/apply` Step 2 exposes `mobile` and `loanAmount` inputs                          | **FAIL** (uses `phone` and `requestedAmount`) |
| `/hi/apply` Step 1 and Step 2 fully localized                                        | PASS                                          |
| `/en/legal/terms-of-service` serves custom content, no 404                           | PASS                                          |
| All 7 `/hi/legal/*` pages contain real Hindi content                                 | PASS                                          |
| `/en/team` shows Alok with name/title/bio and Divyesh Reddy as "Borrower Onboarding" | PASS                                          |
| `/hi/team` Mission banner and Core Values cards translated                           | PASS                                          |
| `/hi/team` individual team member cards fully translated                             | **FAIL** (names/titles/bios remain English)   |

## Blocking issue

- Apply wizard Step 2 input names do not match the acceptance criteria (`mobile` → `phone`, `loanAmount` → `requestedAmount`).

## Artifacts

- Full report: `.opencode/factory/visual-verification-report.md`
- Screenshots: `.opencode/factory/*.png`
- DOM snapshots: `.opencode/factory/*.txt`
