<script lang="ts">
  import { settingsStore } from "../../stores/settingsStore";
  import { generationType, lastResult, generate } from "./Home";
  import styles from "./Home.module.css";

  let settings = $settingsStore;
  let isGenerating = false;
  let showResult = false;

  // Generar números
  async function onGenerate() {
    if (isGenerating) return;

    isGenerating = true;
    showResult = false;

    // Simular tiempo de generación para la animación
    setTimeout(() => {
      generate(settings);
      isGenerating = false;
      showResult = true;
    }, 800);
  }
</script>

<div class={styles.container}>
  <div class={styles.header}>
    <h2 class={styles.title}>🎲 Generador de números aleatorios</h2>
    <p class={styles.subtitle}>
      Genera números aleatorios de forma rápida y sencilla
    </p>
  </div>

  <!-- Selector de tipo -->
  <div class={styles.typeSelector}>
    <div class={styles.btnGroup} role="group">
      <button
        type="button"
        class={`${styles.typeBtn} ${$generationType === "single" ? styles.active : ""}`}
        on:click={() => generationType.set("single")}
      >
        <i class="bi-dash-circle"></i>
        <span>Único número</span>
      </button>
      <button
        type="button"
        class={`${styles.typeBtn} ${$generationType === "multiple" ? styles.active : ""}`}
        on:click={() => generationType.set("multiple")}
      >
        <i class="bi-grid-1x2"></i>
        <span>Varios números</span>
      </button>
    </div>
  </div>

  <!-- Botón principal -->
  <div class={styles.generateSection}>
    <button
      class={`${styles.btnGenerate} ${isGenerating ? styles.generating : ""}`}
      on:click={onGenerate}
      disabled={isGenerating}
    >
      {#if isGenerating}
        <div class={styles.spinner}></div>
        <span>Generando...</span>
      {:else}
        <i class="bi-arrow-repeat"></i>
        <span>Generar</span>
      {/if}
    </button>
  </div>

  <!-- Resultado -->
  <div class={styles.resultSection}>
    {#if $lastResult && showResult}
      <div class={styles.resultContainer}>
        <div class={styles.resultLabel}>
          Resultado{$lastResult.length > 1 ? "s" : ""}:
        </div>

        {#if $generationType === "single" || $lastResult.length === 1}
          <!-- Mostrar número único -->
          <div class={styles.resultBox}>
            <div class={styles.resultValue}>
              {$lastResult[0]}
            </div>
          </div>
        {:else}
          <!-- Mostrar múltiples números -->
          <div class={styles.multipleResults}>
            {#each $lastResult as number, index}
              <div class={styles.resultBoxMultiple}>
                <div class={styles.resultValue}>
                  {number}
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<!-- Contenedor de Toast para errores -->
<div class="toast-container position-fixed top-0 end-0 p-3">
  <div
    id="errorToast"
    class="toast align-items-center text-bg-danger border-0"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    <div class="d-flex">
      <div class="toast-body"></div>
      <button
        type="button"
        class="btn-close btn-close-white me-2 m-auto"
        data-bs-dismiss="toast"
        aria-label="Cerrar"
      ></button>
    </div>
  </div>
</div>
