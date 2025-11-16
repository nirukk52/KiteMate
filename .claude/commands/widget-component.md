Generate a new widget component type for KiteMate with backend API and frontend Svelte component.

**Usage:** `/widget-component <type> <description>`

**Example:** `/widget-component sector-pie "Pie chart showing portfolio sector allocation"`

## Creates

### Backend (Encore)
```
backend/widgets/types/<type>-widget.ts
- Widget configuration schema
- Data transformation logic
- Validation rules
```

### Frontend (SvelteKit)
```
frontend/src/lib/components/widgets/<Type>Widget.svelte
- Svelte 5 component with runes
- Chart/table rendering
- Tailwind styling
```

## Generated Code

### Backend Type Definition
```typescript
// backend/widgets/types/sector-pie-widget.ts
import { z } from 'zod';

export const SectorPieConfigSchema = z.object({
  type: z.literal('sector-pie'),
  showLegend: z.boolean().default(true),
  colors: z.array(z.string()).optional()
});

export type SectorPieConfig = z.infer<typeof SectorPieConfigSchema>;

export interface SectorPieData {
  sectors: Array<{ name: string; value: number; percentage: number }>;
  totalValue: number;
}

export function transformToSectorPie(portfolio: Portfolio): SectorPieData {
  // Group holdings by sector
  const sectorMap = new Map<string, number>();

  for (const holding of portfolio.holdings) {
    const currentValue = holding.quantity * holding.currentPrice;
    sectorMap.set(
      holding.sector,
      (sectorMap.get(holding.sector) || 0) + currentValue
    );
  }

  const totalValue = Array.from(sectorMap.values()).reduce((a, b) => a + b, 0);

  return {
    sectors: Array.from(sectorMap.entries()).map(([name, value]) => ({
      name,
      value,
      percentage: (value / totalValue) * 100
    })),
    totalValue
  };
}
```

### Frontend Component
```svelte
<!-- SectorPieWidget.svelte -->
<script lang="ts">
  import { LayerCake, Svg } from 'layercake';
  import Pie from '$lib/charts/Pie.svelte';
  import type { SectorPieData, SectorPieConfig } from '$lib/types';

  let { data, config }: { data: SectorPieData; config: SectorPieConfig } = $props();

  // Transform for chart library
  let chartData = $derived(
    data.sectors.map(s => ({ label: s.name, value: s.value }))
  );
</script>

<div class="widget-container">
  <h3 class="text-lg font-semibold mb-4">Sector Allocation</h3>

  <div class="h-64">
    <LayerCake data={chartData}>
      <Svg>
        <Pie {config} />
      </Svg>
    </LayerCake>
  </div>

  {#if config.showLegend}
    <ul class="mt-4 space-y-2">
      {#each data.sectors as sector}
        <li class="flex justify-between">
          <span>{sector.name}</span>
          <span class="font-mono">{sector.percentage.toFixed(1)}%</span>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .widget-container {
    @apply rounded-lg border border-gray-200 p-4 bg-white;
  }
</style>
```

## Supported Widget Types

- `line-chart` - Time-series data (P&L over time)
- `pie-chart` - Proportional data (sector allocation)
- `bar-chart` - Comparison data (top movers)
- `data-table` - Tabular data (holdings list)
- `metric-card` - Single values (total P&L, portfolio value)

## Agents Used

1. **encore-backend-developer** - Creates type definitions and API
2. **svelte-frontend-developer** - Creates Svelte component
3. **encore-svelte-integration** - Wires backend and frontend

## Post-Creation Steps

1. Register widget type in `backend/widgets/registry.ts`
2. Add to widget selector in `frontend/src/lib/components/WidgetPicker.svelte`
3. Test with sample data
4. Add to Storybook (if using)
