const { vitePreprocess } = require("@sveltejs/vite-plugin-svelte");

module.exports = {
  // Consulta https://svelte.dev/docs#compile-time-svelte-preprocess
  // para más información sobre preprocessors
  preprocess: vitePreprocess(),
};
