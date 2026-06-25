# Frontend Team Page Cleanup & Roles Alignment

You must clean up the team page roster and align member role labels to match the user's explicit design annotations.

## Changes Required

### 1. Update `/home/yash/opencode-workspace/navdhan-redesign-2026/src/lib/data/team.json`

Modify the `"members"` and `"advisors"` lists in `team.json` exactly:

#### Under `"members"`:
- **Remove Ayan:** Delete the entire team member block with `"id": "ayan-gangopadhyay"`.
- **Remove Parth:** Delete the entire team member block with `"id": "parth-ahuja"`.
- **Remove Alok:** Delete the entire team member block with `"id": "alok"`.
- **Agniva Ray (`id: agniva-ray`):** Change his `"roleKey"` from `"Co-Founder & COO"` to `"Operations"`.
- **Manchit Sanan (`id: manchit-sanan`):** Change his `"roleKey"` from `"Product & Program Lead"` to `"Founding Engineer"`.
- **Debpriyo Ghosal (`id: debpriyo-ghosal`):** Change his `"roleKey"` from `"Engineer/Developer"` to `"Founding Engineer"`.

#### Under `"advisors"`:
- **Remove Sandeep:** Delete the entire advisor block with `"id": "sandeep-juneja"`.

---

## Technical Instructions
- **Validation:** Ensure the edited `team.json` is valid, parseable JSON with balanced brackets.
- **Verification:** Run `npm test -- tests/i18n` to verify all 29 tests pass with 100% green status.
