# RadiumConvert

A professional, modern, and fast document converter built with a Radium-inspired futuristic utility aesthetic. RadiumConvert runs entirely in your browser, converting PDFs, documents, images, and text files locally without uploading your sensitive data to any server.

## Features

- **Strictly Client-Side**: All file processing happens locally using browser APIs and Wasm/JS libraries. No backend, complete privacy.
- **Radium Aesthetic**: High-contrast dark theme with utility-focused typography, black borders, and glowing orange accents.
- **Robust File Handling**: The main file picker dynamically reads MIME types and extensions directly from the supported formats configuration, allowing you to correctly select PDF, DOCX, XLSX, TXT, and various image formats.
- **Smart Conversion Engine**: The UI intelligently disables unsupported output formats based on the specific input file type.
- **Tools Directory**: A filterable search interface allowing you to easily browse available conversion routes.
- **Local History**: A lightweight history tracker powered by `localStorage` (doesn't save file contents).
- **Responsive**: Fully optimized for mobile screens.

## Supported File Processing

Powered by a suite of robust open-source libraries (`pdf-lib`, `pdfjs-dist`, `mammoth`, `jspdf`):

- **PDF**:
  - Image to PDF
  - PDF to Image
- **Documents**:
  - DOCX to Text
  - DOCX to HTML
- **Text**:
  - Text to PDF
- **Images**:
  - JPG/PNG/WEBP to JPG/PNG/WEBP

## Installation & Local Setup

1. **Clone the repository**:
   \`\`\`bash
   git clone <repo-url>
   cd doc-convert
   \`\`\`

2. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

3. **Run the development server**:
   \`\`\`bash
   npm run build
   npm run preview
   \`\`\`

## Testing

\`\`\`bash
npx vitest run
\`\`\`

## Deployment Constraints

Because RadiumConvert operates completely on the client side without needing a backend environment (like Node, Docker, or external queue workers), it is highly compatible with **free static hosting providers**.

### Deploying to Render (Static Site)

1. Go to [Render Dashboard](https://dashboard.render.com/) and click "New Static Site".
2. Connect your GitHub repository.
3. Configure the following settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Click "Create Static Site".

### Deploying to GitHub Pages

Run `npm run build` and push the `dist` folder to your `gh-pages` branch. (Remember to configure the `base` in `vite.config.ts` if needed).
