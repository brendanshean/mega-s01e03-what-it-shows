# kb — the support knowledge base

**kb** = knowledge base. What the support desk knows about how our products break, written
down where the code can keep it honest.

One desk takes reports for every product we run: `sched-prod` (calendar invites for about
300k people) and the rest. When something
goes wrong, the reports reach the desk first. This kb is how the desk triages them, what each
incident turned out to be, and why we decided what we decided.

## What's here

```
src/routes/kb/      the pages (.svx: Markdown with components)
  triage/           how the desk handles incoming reports
  incidents/        one page per big ticket
  decisions/        numbered decision records
src/lib/kb/         components and the logic they run
src/lib/layouts/    the frame every page shares
src/lib/data/       exports from the ticket system
issues/            issue bodies for the two causes found in #4471
rendered/          generated HTML, JavaScript and CSS for the desk
```

The signed investigation is at `src/routes/kb/incidents/4471-split/+page.svx`.
Its generated page is `rendered/kb/incidents/4471-split/index.html`.
The findings are tracked in [parser issue #1](https://github.com/brendanshean/mega-s01e03-what-it-shows/issues/1)
and [form-hint issue #2](https://github.com/brendanshean/mega-s01e03-what-it-shows/issues/2).
The course's 5 October engineering update resolves the parser as fixed and the
form-hint issue as won't fix because booking-v3 was retired. The signed page
records those separate outcomes alongside the historical export counts.
Its `IncidentSummary` component removes overlapping report IDs, then uses the
export's `causes.ts` and tenant directory to count each cause. Intake tags do not
determine the counts. The original incident and accepted decision remain as
evidence of what the desk recorded.

## Run and render

Use Node.js 24. Run `npm ci --ignore-scripts`, then `npm run build` to generate the
complete static KB in `rendered/`. Run `npm run preview` and visit
`http://127.0.0.1:4173/kb/incidents/4471-split/` to see the signed page as the desk
will see it. `npm run dev` provides a live local preview while editing.

The SvelteKit configuration wires `.svx` pages through mdsvex, imports `#lib` from
`src/lib`, and applies the provided `runbook` layout. Tables, timelines, the KB
index and the signature stamp are evaluated from source during the build.

## Conventions

- Words in the page, logic in `src/lib` (imported as `#lib/…`). A number that can be computed belongs in a component.
- Every page starts with frontmatter: `title`, `owner`, `status`, `reviewed`.
- A decision is never edited after it is accepted. A new record replaces it.
- A page you add is signed: its frontmatter carries your `signature` and it ends with `<RenderStamp {signature} />`, so the desk knows who wrote it.

## Owners

Support desk. Decision records: whoever signed them.

---

Exported 2026-10-04 from the `support` repo, `apps/kb/` → `src/`.
