import JSZip from 'jszip';

// Import files as raw strings using Vite's ?raw suffix
import AppRaw from '../App.tsx?raw';
import mainRaw from '../main.tsx?raw';
import indexCssRaw from '../index.css?raw';
import typesRaw from '../types.ts?raw';
import viteEnvRaw from '../vite-env.d.ts?raw';

// Components
import ButtonRaw from '../components/Button.tsx?raw';
import InputRaw from '../components/Input.tsx?raw';
import AuthFormRaw from '../components/AuthForm.tsx?raw';
import CampaignCardRaw from '../components/CampaignCard.tsx?raw';
import PostListRaw from '../components/PostList.tsx?raw';
import FooterRaw from '../components/Footer.tsx?raw';

// Services
import geminiServiceRaw from './geminiService.ts?raw';
import storageServiceRaw from './storageService.ts?raw';
import socialServiceRaw from './socialService.ts?raw';

export const downloadProjectSource = async () => {
  const zip = new JSZip();

  // 1. Root Files
  zip.file("README.md", `# Auto Poster Hub
مشروع إدارة حملات التواصل الاجتماعي الآلي.
`);
  
  zip.file("package.json", JSON.stringify({
    "name": "auto-poster-hub",
    "private": true,
    "version": "1.0.0",
    "type": "module",
    "dependencies": {
      "react": "^19.2.3",
      "react-dom": "^19.2.3",
      "@google/genai": "^1.33.0",
      "jszip": "^3.10.1"
    },
    "devDependencies": {
      "@types/react": "^19.2.3",
      "@types/react-dom": "^19.2.3",
      "@vitejs/plugin-react": "^4.2.1",
      "typescript": "^5.2.2",
      "vite": "^5.1.4",
      "autoprefixer": "^10.4.18",
      "postcss": "^8.4.35",
      "tailwindcss": "^3.4.1"
    }
  }, null, 2));

  zip.file("tsconfig.json", JSON.stringify({
    "compilerOptions": {
      "target": "ES2020",
      "useDefineForClassFields": true,
      "lib": ["ES2020", "DOM", "DOM.Iterable"],
      "module": "ESNext",
      "skipLibCheck": true,
      "moduleResolution": "bundler",
      "allowImportingTsExtensions": true,
      "resolveJsonModule": true,
      "isolatedModules": true,
      "noEmit": true,
      "jsx": "react-jsx",
      "strict": true,
      "unusedLocals": false,
      "noUnusedParameters": false,
      "noFallthroughCasesInSwitch": true
    },
    "include": ["src"],
    "references": [{ "path": "./tsconfig.node.json" }]
  }, null, 2));
  
  zip.file("tsconfig.node.json", `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}`);

  zip.file("vite.config.ts", `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
})`);

  zip.file("tailwind.config.js", `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [],
}`);

  zip.file("postcss.config.js", `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`);

  zip.file("index.html", `<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Auto Poster Hub</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`);

  // 2. Src Files
  const src = zip.folder("src");
  src?.file("App.tsx", AppRaw);
  src?.file("main.tsx", mainRaw);
  src?.file("index.css", indexCssRaw);
  src?.file("types.ts", typesRaw);
  src?.file("vite-env.d.ts", viteEnvRaw);

  const components = src?.folder("components");
  components?.file("Button.tsx", ButtonRaw);
  components?.file("Input.tsx", InputRaw);
  components?.file("AuthForm.tsx", AuthFormRaw);
  components?.file("CampaignCard.tsx", CampaignCardRaw);
  components?.file("PostList.tsx", PostListRaw);
  components?.file("Footer.tsx", FooterRaw);

  const services = src?.folder("services");
  services?.file("geminiService.ts", geminiServiceRaw);
  services?.file("storageService.ts", storageServiceRaw);
  services?.file("socialService.ts", socialServiceRaw);
  
  // Provide a simplified downloadService in the zip to avoid circular dependency
  services?.file("downloadService.ts", `import JSZip from 'jszip';
export const downloadProjectSource = async () => {
    alert("This feature is disabled in the downloaded version.");
};`);

  // Generate ZIP
  const blob = await zip.generateAsync({ type: "blob" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "auto-poster-hub-source.zip";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};