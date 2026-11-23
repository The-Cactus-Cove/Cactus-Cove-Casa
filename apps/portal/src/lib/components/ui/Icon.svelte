<script lang="ts" module>
  /** Stroke icons from the mockup, drawn on a 24×24 grid. */
  const ICONS = {
    garage: ['M3 21V9l9-5 9 5v12', 'M7 21v-9h10v9M7 15h10M7 18h10'],
    lock: ['M8 11V7a4 4 0 0 1 8 0v4', 'M12 15v2', 'M7 11h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z'],
    thermometer: ['M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z', 'M12 9v7'],
    tv: ['M5 4h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', 'M8 20h8M12 16v4'],
    book: ['M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z', 'M4 21V5M9 8h6'],
    check: ['M5 12l5 5 9-10'],
    alert: ['M12 7v6M12 17v.5'],
    'chevron-up': ['M6 15l6-6 6 6'],
    'chevron-down': ['M6 9l6 6 6-6'],
    'chevron-left': ['M15 6l-6 6 6 6'],
    'chevron-right': ['M9 6l6 6-6 6'],
    sunset: ['M4 40h40', 'M24 12v4M10 18l3 3M38 18l-3 3M6 30h4M38 30h4', 'M14 30a10 10 0 0 1 20 0']
  } as const;
  export type IconName = keyof typeof ICONS;
</script>

<script lang="ts">
  interface Props {
    name: IconName;
    size?: number;
    stroke?: number;
    label?: string;
  }
  let { name, size = 24, stroke = 2, label }: Props = $props();
  const viewBox = $derived(name === 'sunset' ? '0 0 48 48' : '0 0 24 24');
</script>

<svg
  width={size}
  height={size}
  {viewBox}
  fill="none"
  stroke="currentColor"
  stroke-width={stroke}
  stroke-linecap="round"
  stroke-linejoin="round"
  role={label ? 'img' : undefined}
  aria-label={label}
  aria-hidden={label ? undefined : 'true'}
>
  {#each ICONS[name] as d}<path {d} />{/each}
</svg>
