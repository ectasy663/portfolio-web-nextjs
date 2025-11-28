# Portfolio Website - Next.js

A modern, responsive portfolio website built with Next.js 14, TypeScript, Tailwind CSS, and GSAP animations.

## Features

- ⚡ **Next.js 14** with App Router for optimal performance
- 🎨 **Tailwind CSS** for responsive, utility-first styling
- 🌙 **Dark/Light Mode** with system preference detection
- ✨ **GSAP Animations** with scroll-triggered effects
- 📱 **Fully Responsive** design for all devices
- 🎬 **Video Backgrounds** in hero section
- 📄 **Downloadable Resume** functionality
- 📧 **Contact Form** with mailto integration

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up assets:**

   Copy video files to the public folder:

   - Copy `Video 1 AI and Web.mp4` to `public/videos/hero-video.mp4`
   - Copy `Portfolio Metaverse.mp4` to `public/videos/metaverse.mp4`

   Copy resume file:

   - Copy your resume PDF to `public/resume/naman-res-18-7.pdf`

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## Project Structure

```
portfolio-nextjs/
├── public/
│   ├── resume/
│   │   └── naman-res-18-7.pdf
│   └── videos/
│       ├── hero-video.mp4
│       └── metaverse.mp4
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── About.tsx
│   │   ├── Achievements.tsx
│   │   ├── Contact.tsx
│   │   ├── Experience.tsx
│   │   ├── Hero.tsx
│   │   ├── Navigation.tsx
│   │   ├── Projects.tsx
│   │   ├── ResumeButton.tsx
│   │   ├── Skills.tsx
│   │   ├── ThemeToggleButton.tsx
│   │   └── index.ts
│   ├── contexts/
│   │   └── ThemeContext.tsx
│   ├── hooks/
│   │   └── useAnimation.ts
│   └── utils/
│       └── scroll.ts
├── next.config.mjs
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **GSAP** - Professional-grade animations
- **Framer Motion** - React animation library
- **Lucide React** - Beautiful icons
- **React Icons** - Popular icon packs

## Customization

### Theme Colors

Edit `tailwind.config.js` to customize the color scheme:

```js
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom primary colors
      }
    }
  }
}
```

### Content

Update the component files in `src/components/` to modify:

- Personal information
- Skills and experience
- Projects showcase
- Achievements
- Contact details

## Performance Optimizations

- Lazy loading of components with React Suspense
- Optimized images and videos
- SSR-safe animations with client-side rendering
- Efficient GSAP ScrollTrigger implementation

## License

MIT License - Feel free to use this template for your own portfolio!

---

Built with ❤️ by Naman Singh Panwar
