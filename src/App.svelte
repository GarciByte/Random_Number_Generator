<script lang="ts">
  import Router from 'svelte-spa-router';
  import Nav from './components/Nav/Nav.svelte';
  import { routes } from './routes';
  import "bootstrap/dist/css/bootstrap.min.css";
  import "bootstrap-icons/font/bootstrap-icons.css";
</script>

<Nav />

<main class="container py-4">
  <Router {routes} />
</main>
