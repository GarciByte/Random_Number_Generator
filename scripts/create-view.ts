import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

const viewName = process.argv[2];
if (!viewName) {
  console.error('Debes especificar un nombre de vista.');
  console.error('Ejemplo: npm run create-view Home');
  process.exit(1);
}

const basePath = join('src', 'views', viewName);
if (existsSync(basePath)) {
  console.error(`La vista "${viewName}" ya existe.`);
  process.exit(1);
}

// Crear carpeta de la vista
mkdirSync(basePath, { recursive: true });

// Componente Svelte con CSS Modules
const svelteContent = 
`<script lang="ts">
  import styles from './${viewName}.module.css';
  import { mensaje } from './${viewName}.ts';
</script>

<div class={styles.container}>
  <h1>{mensaje}</h1>
</div>
`;
writeFileSync(join(basePath, `${viewName}.svelte`), svelteContent);

// Lógica TS
const tsContent = `export const mensaje = 'Hola desde la vista ${viewName}';\n`;
writeFileSync(join(basePath, `${viewName}.ts`), tsContent);

// CSS Module
const cssContent = `.container {
  padding: 2rem;
  background-color: #f5f5f5;
  font-size: 1.5rem;
  text-align: center;
}
`;
writeFileSync(join(basePath, `${viewName}.module.css`), cssContent);

// Añadir/importar en routes.ts
const routesPath = join('src', 'routes.ts');
const routeImport = `import ${viewName} from './views/${viewName}/${viewName}.svelte';\n`;
const routeEntry = `  '/${viewName.toLowerCase()}': ${viewName},\n`;

if (!existsSync(routesPath)) {
  const initial = `${routeImport} export const routes = { ${routeEntry}};\n`;
  writeFileSync(routesPath, initial);
} else {
  let content = readFileSync(routesPath, 'utf-8');

  if (!content.includes(routeImport.trim())) {
    content = content.replace(/export const routes/, `${routeImport}\nexport const routes`);
  }

  content = content.replace(/(\}\s*;\s*)$/, `${routeEntry}$1`);
  writeFileSync(routesPath, content);
}

console.log(`Vista "${viewName}" creada en src/views/${viewName} y ruta '/${viewName.toLowerCase()}' registrada.`);
