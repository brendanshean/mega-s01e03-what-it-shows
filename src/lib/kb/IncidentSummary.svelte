<script lang="ts">
  import rows from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { groupByCause, readAs, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  const reports = uniqueById(rows as Report[]).filter((r) => r.mergedInto === 4471);
  const groups = groupByCause(reports, tenantOf);
  const duplicates = rows.filter((r) => r.mergedInto === 4471).length - reports.length;
  const disagreements = groups.reduce((n, g) => n + g.reports.filter((r) => r.meta.intakeTag !== g.cause).length, 0);
  const labels = {
    parser: 'Shared parser reads day-first dates as month-first',
    hint: 'booking-v3 shows a month-first hint but reads day-first',
    unplaced: 'Needs tenant investigation'
  };
</script>

<p><strong>{reports.length} distinct reports · {groups.length} causes</strong>. The export contains {duplicates} repeated rows, removed by report ID before counting.</p>
<table>
  <thead><tr><th>Problem</th><th>Reports</th><th>Tenants</th><th>First / last report</th></tr></thead>
  <tbody>
    {#each groups as group (group.cause)}
      <tr>
        <td>{labels[group.cause]} (<code>{group.cause}</code>)</td>
        <td>{group.reports.length}</td>
        <td>{group.tenants}</td>
        <td>{group.firstSeen} / {group.lastSeen}</td>
      </tr>
    {/each}
  </tbody>
</table>
<p>{disagreements} intake tags disagree with the tenant-based classification. Browser locale and intake tags are not the count's source of truth.</p>
{#each groups as group (group.cause)}
  {@const moved = readAs(group, notes.oneDayMove)}
  {#if moved}
    <p>{moved} reports describe a one-day move and remain filed under <code>{group.cause}</code> by the supplied tenant-based logic. These reports need follow-up; their wording alone does not establish a separate cause.</p>
  {/if}
{/each}
