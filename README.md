# WMR - Gemini Watermark & Logo Remover

A free, browser-based tool to remove Gemini watermarks and logos from AI-generated images.

## 🍌 Features

- **Gemini Watermark Remover** - Remove invisible SynthID and visible watermarks
- **Gemini Logo Remover** - Precisely remove corner logos and badges
- **100% Browser-Based** - All processing happens locally, your images never leave your device
- **Free Forever** - No subscriptions, no credits, no hidden fees

## 🔒 Privacy First

All image processing uses the browser's Canvas API. No images are ever uploaded to any server.

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI
- **i18n:** next-intl (English & Chinese)
- **Processing:** Browser Canvas API

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
├── app/(main)/[locale]/     # Locale-aware pages
├── components/
│   ├── feature/             # Core feature components
│   │   ├── watermark-editor.tsx
│   │   ├── mask-canvas.tsx
│   │   └── compare-slider.tsx
│   └── home/                # Homepage components
├── hooks/
│   └── useWatermarkRemover.ts  # Canvas inpainting algorithm
└── messages/                # i18n translations
```

## 🌐 Deployment

Optimized for Cloudflare Pages with Edge Runtime.

## 📄 License

MIT
