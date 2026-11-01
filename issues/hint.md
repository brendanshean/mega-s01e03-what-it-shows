booking-v3 displays `MM/DD/YYYY` to day-first tenants but interprets the entry in the tenant's day-first order. Split this form-hint problem out of the course support desk's merged ticket #4471.

## Report count

**33 distinct reports**, spanning 3 tenants (alder.physio, copper.studio and pale.harbour), received 2026-04-17 through 2026-09-22. This count is from the 2026-10-04 KB export.

Deduplicate the 427 export rows by report ID before classifying. Of 412 distinct reports, `causeOf(report, tenant)` assigns 33 to `hint` and 379 to `parser`. The hint group contains 15 reports tagged `parser` and 18 tagged `hint`; intake tags cannot supply the correct counts.

## Evidence and behavior

- `DATE_HINT` in `src/lib/kb/causes.ts` sets booking-v3's hint to `MM/DD/YYYY`; `causeOf` identifies form-channel reports from day-first tenants on that form as `hint`.
- R-41230, copper.studio, form: the client came on 1 June instead of 6 January. Intake tagged it `parser`, but tenant/form classification places it here.
- R-41241, alder.physio, form: people booked for 6 August appeared on 8 June.
- Expected: the printed hint and the actual date interpretation agree for the tenant.
- Actual, reported in the export: following the month-first hint supplies a date that the form reads day-first.

This is separate from the shared parser defect. A parser fix alone does not establish that this hint and input interpretation agree.

## Proposed acceptance checks

- For a day-first booking-v3 tenant, the displayed hint matches the format the form reads.
- A person following that hint preserves the intended day and month for an ambiguous date.
- Day values above 12, month-first tenants, and booking-v2 remain correct.
- Subject similarity does not merge this group back into the parser issue.

These checks describe the intended fix. The production booking form is not included in the export, so no production fix or reproduction is claimed.

## Reproduce the evidence

Run `npm ci --ignore-scripts` and `npm run build`. Open `/kb/incidents/4471-split/` in the preview. Counts and examples derive from the report export and tenant directory using the supplied classification.

Source: MEGA.dev S01E03 KB export, `reports-4471.json`, tenant directory and `causes.ts`.
