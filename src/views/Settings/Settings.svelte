<script lang="ts">
  import {
    settings,
    saveSettings,
    amountMax,
    filteredSize,
    invalidRangeTooBig,
  } from "./Settings";
  import styles from "./Settings.module.css";
  import { derived } from "svelte/store";
  import { Toast } from "bootstrap";

  let isSaving = false;

  // Validaciones
  const invalidRange = derived(settings, ($s) => $s.min > $s.max);
  const invalidRepeat = derived(
    [settings, filteredSize],
    ([$s, $size]) => !$s.allowRepeats && $s.amount > $size
  );

  // Guarda la configuración y muestra el toast
  async function onSave() {
    if (isSaving) return;

    isSaving = true;

    // Simular tiempo de guardado
    setTimeout(async () => {
      await saveSettings();
      const toastEl = document.getElementById("successToast");
      if (toastEl) {
        new Toast(toastEl, { delay: 3000 }).show();
      }
      isSaving = false;
    }, 500);
  }

  // Validar que min, max y amount no estén vacíos
  const invalidEmpty = derived(
    settings,
    ($s) => isNaN($s.min) || isNaN($s.max) || isNaN($s.amount)
  );
</script>

<div class={styles.container}>
  <div class={styles.header}>
    <h2 class={styles.title}>⚙️ Ajustes del Generador</h2>
    <p class={styles.subtitle}>
      Configura los parámetros para generar números aleatorios
    </p>
  </div>

  <form class={styles.form} on:submit|preventDefault={onSave}>
    <!-- Sección de Rango -->
    <div class={styles.section}>
      <h3 class={styles.sectionTitle}>📊 Rango de Números</h3>
      <div class={styles.rangeGroup}>
        <div class={styles.inputGroup}>
          <label for="minValue" class={styles.label}>Valor Mínimo</label>
          <input
            id="minValue"
            class={styles.input}
            type="number"
            bind:value={$settings.min}
            placeholder="Ej: 1"
            required
          />
        </div>
        <div class={styles.separator}>
          <i class="bi-arrow-right"></i>
        </div>
        <div class={styles.inputGroup}>
          <label for="maxValue" class={styles.label}>Valor Máximo</label>
          <input
            id="maxValue"
            class={styles.input}
            type="number"
            bind:value={$settings.max}
            placeholder="Ej: 100"
            required
          />
        </div>
      </div>
    </div>

    <!-- Sección de Tipo -->
    <div class={styles.section}>
      <h3 class={styles.sectionTitle}>🎯 Tipo de Números</h3>
      <div class={styles.radioGroup}>
        <label
          class={`${styles.radioOption} ${$settings.mode === "any" ? styles.active : ""}`}
        >
          <input
            type="radio"
            value="any"
            bind:group={$settings.mode}
            class={styles.radioInput}
            required
          />
          <div class={styles.radioCustom}>
            <i class="bi-asterisk"></i>
            <span>Cualquiera</span>
          </div>
        </label>

        <label
          class={`${styles.radioOption} ${$settings.mode === "even" ? styles.active : ""}`}
        >
          <input
            type="radio"
            value="even"
            bind:group={$settings.mode}
            class={styles.radioInput}
            required
          />
          <div class={styles.radioCustom}>
            <i class="bi-grid-3x2"></i>
            <span>Pares</span>
          </div>
        </label>

        <label
          class={`${styles.radioOption} ${$settings.mode === "odd" ? styles.active : ""}`}
        >
          <input
            type="radio"
            value="odd"
            bind:group={$settings.mode}
            class={styles.radioInput}
            required
          />
          <div class={styles.radioCustom}>
            <i class="bi-grid-1x2"></i>
            <span>Impares</span>
          </div>
        </label>
      </div>
    </div>

    <!-- Sección de Cantidad -->
    <div class={styles.section}>
      <h3 class={styles.sectionTitle}>🔢 Cantidad (modo de varios números)</h3>
      <div class={styles.quantityGroup}>
        <div class={styles.inputGroup}>
          <label for="amount" class={styles.label}
            >Cantidad de números a generar</label
          >
          <input
            id="amount"
            type="number"
            min="2"
            class={styles.input}
            bind:value={$settings.amount}
            max={$amountMax < 2 ? 2 : $amountMax}
            placeholder="Ej: 5"
            required
          />
        </div>
        <small class={styles.label}
          >Máximo permitido: {($amountMax < 2
            ? 2
            : $amountMax
          ).toLocaleString()}</small
        >
        <small class={styles.helpText}
          >Número de valores que se generarán simultáneamente</small
        >
      </div>
    </div>

    <!-- Sección de Repetición -->
    <div class={styles.section}>
      <h3 class={styles.sectionTitle}>🔁 Opciones Avanzadas</h3>
      <div class={styles.advancedGroup}>
        <label
          class={`${styles.radioOption} ${$settings.allowRepeats ? styles.active : ""}`}
        >
          <input
            type="checkbox"
            class={styles.radioInput}
            bind:checked={$settings.allowRepeats}
            disabled={$invalidRepeat}
          />
          <div class={styles.radioCustom}>
            <i class="bi-arrow-repeat"></i>
            <div class={styles.optionText}>
              <span>Permitir números repetidos</span>
              <small>Los números generados pueden repetirse</small>
            </div>
          </div>
        </label>
      </div>
    </div>

    <!-- Botón Guardar -->
    <div class={styles.saveSection}>
      <button
        type="submit"
        class={`${styles.saveBtn} ${isSaving ? styles.saving : ""}`}
        disabled={$invalidRange ||
          $invalidRangeTooBig ||
          $invalidRepeat ||
          $invalidEmpty ||
          isSaving}
      >
        {#if isSaving}
          <div class={styles.spinner}></div>
          <span>Guardando...</span>
        {:else}
          <i class="bi-save"></i>
          <span>Guardar Configuración</span>
        {/if}
      </button>
    </div>
  </form>
</div>

<!-- Mensajes de error -->
{#if $invalidRange}
  <div class={`${styles.floatingAlert} ${styles.alertDanger}`}>
    <i class="bi-exclamation-triangle"></i>
    <span
      >El mínimo ({$settings.min}) no puede ser mayor que el máximo ({$settings.max}).</span
    >
  </div>
{:else if $invalidRangeTooBig}
  <div class={`${styles.floatingAlert} ${styles.alertDanger}`}>
    <i class="bi-exclamation-triangle"></i>
    <span> El rango supera el límite de 1.000.000 valores. </span>
  </div>
{:else if $invalidRepeat}
  <div class={`${styles.floatingAlert} ${styles.alertWarning}`}>
    <i class="bi-exclamation-circle"></i>
    <span
      >No puedes generar {$settings.amount} valores únicos con solo {$filteredSize.toLocaleString()}
      valores posibles.</span
    >
  </div>
{/if}

<!-- Toast -->
<div class="toast-container position-fixed top-0 end-0 p-3">
  <div
    id="successToast"
    class="toast align-items-center text-bg-success border-0"
    role="alert"
    aria-live="polite"
    aria-atomic="true"
  >
    <div class="d-flex">
      <div class="toast-body">¡Configuración guardada correctamente!</div>
      <button
        type="button"
        class="btn-close btn-close-white me-2 m-auto"
        data-bs-dismiss="toast"
        aria-label="Cerrar"
      ></button>
    </div>
  </div>
</div>
