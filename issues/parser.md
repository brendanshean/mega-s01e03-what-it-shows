The shared parser treats dates as month-first for day-first tenants. Split this problem out of the course support desk's merged ticket #4471.

## Report count

**379 distinct reports**, spanning 11 tenants, received 2026-04-01 through 2026-10-04. This count is from the 2026-10-04 KB export.

The export has 427 rows but 412 distinct report IDs. After deduplication, `causeOf(report, tenant)` assigns 379 to `parser` and 33 to `hint`; each report is counted once. Intake tags are not authoritative: this parser group contains 356 tagged `parser` and 23 tagged `hint`.

## Evidence and behavior

- `src/lib/kb/causes.ts` defines the shared parser as month-first and classifies day-first tenants outside the booking-v3 form-hint path as `parser`.
- R-41200, harbour.dental, app, tenant locale en-GB: a 7 April reminder went out on 4 July.
- R-41201, harbour.dental, app: 4 July went out on 7 April.
- Expected: preserve the intended date according to the tenant's input format, or use an unambiguous representation.
- Actual, reported in the export: month/day reversal for day-first input.

Five reports (R-41202, R-41209, R-41236, R-41344, R-41620) describe a one-day move. The provided tenant-based classification files them within these 379 parser reports. Preserve those descriptions for follow-up; do not silently drop them or invent a third cause from the wording alone.

## Proposed acceptance checks

- A day-first tenant entering 07/04/2026 retains 7 April rather than 4 July.
- A day value above 12 is handled correctly rather than read as a month.
- Month-first tenant input still works.
- App, email and booking-v2 paths are covered; booking-v3's separate hint mismatch has its own issue.

These checks describe the intended fix. The production parser is not included in the export, so no production fix or reproduction is claimed.

## Reproduce the evidence

Run `npm ci --ignore-scripts` and `npm run build`. Open `/kb/incidents/4471-split/` in the preview. Counts are computed from report IDs, tenant locale and form, rather than subject text or browser locale.

Source: MEGA.dev S01E03 KB export, `reports-4471.json`, tenant directory, `causes.ts`, and `desk-notes.json`.
