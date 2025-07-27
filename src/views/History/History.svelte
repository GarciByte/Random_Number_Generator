<script lang="ts">
  import { onMount } from "svelte";
  import {
    fullHistory,
    pageItems,
    currentPage,
    totalPages,
    loadHistory,
    clearAllHistory,
  } from "./History";
  import styles from "./History.module.css";

  let isClearing = false;

  onMount(loadHistory);

  async function handleClearHistory() {
    if (isClearing) return;

    isClearing = true;

    // Simular tiempo de procesamiento
    setTimeout(() => {
      clearAllHistory();
      isClearing = false;
    }, 500);
  }
</script>

<div class={styles.container}>
  <div class={styles.header}>
    <h2 class={styles.title}>📜 Historial de Números</h2>
    <p class={styles.subtitle}>
      Revisa todos los números que has generado anteriormente
    </p>
  </div>

  <!-- Sección de información y acciones -->
  <div class={styles.actionSection}>
    <div class={styles.infoCard}>
      <div class={styles.statsGroup}>
        <div class={styles.statItem}>
          <i class="bi-clock-history"></i>
          <div class={styles.statContent}>
            <span class={styles.statValue}>{$fullHistory.length}</span>
            <span class={styles.statLabel}>Total de entradas</span>
          </div>
        </div>

        {#if $totalPages > 1}
          <div class={styles.statItem}>
            <i class="bi-files"></i>
            <div class={styles.statContent}>
              <span class={styles.statValue}>{$totalPages}</span>
              <span class={styles.statLabel}>Páginas</span>
            </div>
          </div>
        {/if}
      </div>

      <div class={styles.actionButtons}>
        <button
          class={`${styles.clearBtn} ${isClearing ? styles.clearing : ""}`}
          on:click={handleClearHistory}
          disabled={$fullHistory.length === 0 || isClearing}
        >
          {#if isClearing}
            <div class={styles.spinner}></div>
            <span>Borrando...</span>
          {:else}
            <i class="bi-trash3"></i>
            <span>Borrar historial</span>
          {/if}
        </button>
      </div>
    </div>
  </div>

  <!-- Sección de tabla -->
  <div class={styles.tableSection}>
    <div class={styles.tableContainer}>
      {#if $fullHistory.length === 0}
        <div class={styles.emptyState}>
          <div class={styles.emptyIcon}>
            <i class="bi-clock-history"></i>
          </div>
          <h3 class={styles.emptyTitle}>No hay historial aún</h3>
          <p class={styles.emptyDescription}>
            Cuando generes números aleatorios, aparecerán aquí para que puedas
            consultarlos más tarde.
          </p>
        </div>
      {:else}
        <div class={styles.tableWrapper}>
          <table class={styles.table}>
            <thead class={styles.tableHead}>
              <tr>
                <th class={styles.dateColumn}>
                  <i class="bi-calendar-event"></i>
                  <span>Fecha y hora</span>
                </th>
                <th class={styles.numbersColumn}>
                  <i class="bi-123"></i>
                  <span>Números generados</span>
                </th>
              </tr>
            </thead>
            <tbody class={styles.tableBody}>
              {#each $pageItems as entry, index (entry.id)}
                <tr
                  class={styles.tableRow}
                  style="animation-delay: {index * 0.05}s"
                >
                  <td class={styles.dateCell}>
                    <div class={styles.dateContent}>
                      <span class={styles.dateText}>
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </span>
                      <span class={styles.timeText}>
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </td>
                  <td class={styles.numbersCell}>
                    <div class={styles.numbersContent}>
                      {#each entry.values as number, i}
                        <span class={styles.numberBadge}>
                          {number}
                        </span>
                        {#if i < entry.values.length - 1}
                          <span class={styles.separator}>•</span>
                        {/if}
                      {/each}
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>
  </div>

  <!-- Sección de paginación -->
  {#if $totalPages > 1}
    <div class={styles.paginationSection}>
      <nav class={styles.pagination} aria-label="Paginación del historial">
        <button
          class={`${styles.paginationBtn} ${styles.prevBtn}`}
          disabled={$currentPage === 1}
          on:click={() => currentPage.update((n) => Math.max(1, n - 1))}
        >
          <i class="bi-chevron-left"></i>
          <span>Anterior</span>
        </button>

        <div class={styles.pageInfo}>
          <span class={styles.pageText}>
            Página <strong>{$currentPage}</strong> de
            <strong>{$totalPages}</strong>
          </span>
        </div>

        <button
          class={`${styles.paginationBtn} ${styles.nextBtn}`}
          disabled={$currentPage === $totalPages}
          on:click={() =>
            currentPage.update((n) => Math.min($totalPages, n + 1))}
        >
          <span>Siguiente</span>
          <i class="bi-chevron-right"></i>
        </button>
      </nav>
    </div>
  {/if}
</div>
