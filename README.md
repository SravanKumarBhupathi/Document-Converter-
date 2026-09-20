# DocConvert

A modern, fast, and secure document converter that runs entirely in your browser. Convert PDFs, images, documents, and text files without the hassle, with a clean and minimal interface.

## Features

- **Fully Client-Side**: All conversions happen locally in your browser. No files are uploaded to any server, ensuring complete privacy.
- **Modern UI**: Designed with a sleek Orange, White, and Black theme using Tailwind CSS.
- **Drag & Drop**: Easily add multiple files at once.
- **Responsive**: Works flawlessly on desktop and mobile screens.
- **Open Source Technologies**: Built using React, Vite, Tailwind CSS, `pdf-lib`, `pdfjs-dist`, and `mammoth`.

## Supported Conversions

- **PDF**:
  - Image to PDF (JPG, PNG, WEBP)
  - PDF to Image (JPG, PNG, WEBP)
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
   (Or start the dev server via your package manager's standard commands).

## Testing

To run the unit tests:

\`\`\`bash
npx vitest run
\`\`\`

## Production & Deployment

Since this application runs entirely client-side without a backend, it is straightforward to deploy to any static hosting provider.

### Building for Production

To create an optimized production build:

\`\`\`bash
npm run build
\`\`\`
This will output the compiled assets into the `dist` directory.

### Deploying to GitHub Pages

1. Ensure the `base` option in `vite.config.ts` is set to your repository name if not deploying to a custom domain (e.g., `base: '/my-repo/'`).
2. Run the build step.
3. Push the contents of the `dist` folder to your `gh-pages` branch.

### Deploying to Render (Static Site)

1. Go to [Render Dashboard](https://dashboard.render.com/) and click "New Static Site".
2. Connect your GitHub repository.
3. Configure the following settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Click "Create Static Site". Your converter will be live in minutes.

---

*Files are processed only for conversion and are not permanently stored.*
