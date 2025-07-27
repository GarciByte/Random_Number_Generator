<script lang="ts">
  import {
    status,
    latest,
    currentVersion,
    initVersion,
    checkUpdates,
    downloadAndInstall,
  } from "./Updates";
  import styles from "./Updates.module.css";
  import { onMount } from "svelte";

  let isDownloading = false;

  onMount(initVersion);

  async function handleDownloadAndInstall() {
    if (isDownloading) return;

    isDownloading = true;

    try {
      await downloadAndInstall();
    } finally {
      isDownloading = false;
    }
  }
</script>

<div class={styles.container}>
  <div class={styles.header}>
    <h2 class={styles.title}>🔄 Actualizaciones</h2>
    <p class={styles.subtitle}>
      Mantén tu aplicación siempre actualizada con las últimas funciones
    </p>
  </div>

  <div class={styles.content}>
    {#if $status === "idle"}
      <div class={styles.statusCard}>
        <div class={styles.versionInfo}>
          <div class={styles.versionBadge}>
            <i class="bi-info-circle"></i>
            <div class={styles.versionContent}>
              <span class={styles.versionLabel}>Versión actual</span>
              <span class={styles.versionNumber}>{$currentVersion}</span>
            </div>
          </div>
        </div>

        <div class={styles.actionSection}>
          <p class={styles.actionText}>
            Comprueba si hay nuevas actualizaciones disponibles para mejorar tu
            experiencia.
          </p>
          <button class={styles.primaryBtn} on:click={checkUpdates}>
            <i class="bi-search"></i>
            <span>Buscar actualizaciones</span>
          </button>
        </div>
      </div>
    {:else if $status === "checking"}
      <div class={styles.statusCard}>
        <div class={styles.loadingState}>
          <div class={styles.spinner}></div>
          <div class={styles.loadingContent}>
            <h3 class={styles.loadingTitle}>Buscando actualizaciones</h3>
            <p class={styles.loadingText}>
              Verificando si hay nuevas versiones disponibles...
            </p>
          </div>
        </div>
      </div>
    {:else if $status === "error"}
      <div class={styles.statusCard}>
        <div class={`${styles.alert} ${styles.alertError}`}>
          <i class="bi-exclamation-triangle"></i>
          <div class={styles.alertContent}>
            <h3 class={styles.alertTitle}>Error de conexión</h3>
            <p class={styles.alertText}>
              No se pudo verificar las actualizaciones. Revisa tu conexión a
              internet e inténtalo de nuevo.
            </p>
          </div>
        </div>

        <div class={styles.actionSection}>
          <button class={styles.secondaryBtn} on:click={checkUpdates}>
            <i class="bi-arrow-clockwise"></i>
            <span>Reintentar</span>
          </button>
        </div>
      </div>
    {:else if $status === "upToDate"}
      <div class={styles.statusCard}>
        <div class={`${styles.alert} ${styles.alertSuccess}`}>
          <i class="bi-check-circle"></i>
          <div class={styles.alertContent}>
            <h3 class={styles.alertTitle}>¡Todo actualizado!</h3>
            <p class={styles.alertText}>
              Estás utilizando la versión más reciente <strong
                >({$currentVersion})</strong
              >. No hay actualizaciones disponibles en este momento.
            </p>
          </div>
        </div>

        <div class={styles.actionSection}>
          <button class={styles.secondaryBtn} on:click={checkUpdates}>
            <i class="bi-arrow-clockwise"></i>
            <span>Volver a comprobar</span>
          </button>
        </div>
      </div>
    {:else if $status === "available"}
      <div class={styles.statusCard}>
        <div class={`${styles.alert} ${styles.alertInfo}`}>
          <i class="bi-download"></i>
          <div class={styles.alertContent}>
            <h3 class={styles.alertTitle}>Nueva versión disponible</h3>
            <p class={styles.alertText}>
              La versión <strong>{$latest?.version}</strong> está lista para descargar.
            </p>
          </div>
        </div>

        {#if $latest?.notes}
          <div class={styles.releaseNotes}>
            <h4 class={styles.notesTitle}>
              <i class="bi-file-text"></i>
              <span>Notas de la versión</span>
            </h4>
            <div class={styles.notesContent}>
              {$latest.notes}
            </div>
          </div>
        {/if}

        <div class={styles.actionSection}>
          <div class={styles.buttonGroup}>
            <button
              class={`${styles.primaryBtn} ${isDownloading ? styles.downloading : ""}`}
              on:click={handleDownloadAndInstall}
              disabled={isDownloading}
            >
              {#if isDownloading}
                <div class={styles.spinner}></div>
                <span>Descargando...</span>
              {:else}
                <i class="bi-download"></i>
                <span>Descargar e instalar</span>
              {/if}
            </button>

            <button
              class={styles.secondaryBtn}
              on:click={checkUpdates}
              disabled={isDownloading}
            >
              <i class="bi-arrow-clockwise"></i>
              <span>Volver a comprobar</span>
            </button>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
