<script lang="ts">
  /**
   * Root layout component for KiteMate application
   * 
   * Why this exists:
   * - Provides consistent layout structure across all pages
   * - Imports global styles (Tailwind CSS)
   * - Can include common UI elements (header, footer, navigation)
   */
  
  import '../app.css';
  
  // Svelte 5 snippet props
  let { children } = $props();
</script>

{@render children()}

