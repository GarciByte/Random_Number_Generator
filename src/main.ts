import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { loadSettings } from './views/Settings/Settings';

await loadSettings();

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
