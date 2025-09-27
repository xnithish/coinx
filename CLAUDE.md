# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
```bash
# Start development server with Turbopack
npm run dev
# or
pnpm dev

# Build for production with Turbopack
npm run build
# or
pnpm build

# Start production server
npm start

# Run ESLint
npm run lint
```

## Project Architecture

### Technology Stack
- **Framework**: Next.js 15.5.4 with App Router
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS v4 with new @theme inline configuration
- **UI Components**: shadcn/ui with New York style
- **Icons**: Lucide React
- **Animation**: tw-animate-css

### Key Dependencies
- `class-variance-authority`: For component variants
- `clsx` + `tailwind-merge`: Combined in lib/utils.ts as `cn()` utility
- React 19.1.0 and React DOM 19.1.0

### Project Structure
```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with Geist font
│   ├── page.tsx           # Home page (basic placeholder)
│   └── globals.css        # Tailwind CSS with @theme inline config
├── lib/
│   └── utils.ts           # cn() utility for className merging
├── components.json         # shadcn/ui configuration
├── components/            # UI components (empty, ready for shadcn/ui)
├── public/                # Static assets
└── node_modules/          # Dependencies
```

### Styling System
- Uses Tailwind CSS v4 with new @theme inline configuration
- Dark mode support via .dark class variants
- Comprehensive design token system with oklch colors
- CSS variables mapped to Tailwind theme
- Includes chart color palette and sidebar variables

### Component System
- shadcn/ui configured with New York style
- Lucide icons for iconography
- Component aliases: @/components, @/lib/utils, @/hooks
- Ready for adding shadcn/ui components via CLI

### TypeScript Configuration
- Strict mode enabled
- Path aliases configured: @/* maps to project root
- Module resolution set to bundler
- Next.js plugin for proper type generation

### Development Notes
- Project uses Turbopack for faster development and builds
- Geist font is configured in layout.tsx
- The app structure is minimal and ready for cryptocurrency features
- ESLint is configured with Next.js recommended rules
- No test framework currently configured