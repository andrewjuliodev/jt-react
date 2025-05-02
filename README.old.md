# JT Studio React Animation Project

## Project Overview

This project implements a custom animation sequence for the "JT Studio" brand, featuring:

1. Initial text appearance with neumorphic styling
2. Letter-by-letter animation sequence
3. Color transitions and transformations
4. Smooth transition to the navbar with glassmorphic header

## Setup Instructions

1. Clone the repository or create a new React project with TypeScript:

```bash
npx create-react-app jt-react --template typescript
cd jt-react
```

2. Run the PowerShell scripts to create all files:

```powershell
# Navigate to your project root
cd C:\Users\Dzhu\Documents\GitHub\jt-react

# Run each batch script
.\batch1-create-files.ps1
.\batch2-create-files.ps1
.\batch3-create-files.ps1
.\batch4-create-files.ps1

# Run the setup script to install dependencies
.\setup.ps1
```

3. The Cal Sans font is loaded automatically via Google Fonts, so no additional font files are needed.

4. Start the development server:

```bash
npm start
```

## Animation Sequence Details

The animation follows these steps:

1. **Initial State (0-300ms)**: Screen is completely white and empty
2. **Name Appears (300-800ms)**: "Julio Tompsett" appears gradually with neumorphic styling
3. **Letters Disappear (1000-1300ms)**: Each letter after "J" in "Julio" and all letters except "T" in "Tompsett" move leftward in succession
4. **Color Change (1400-1450ms)**: The "J" and "T" change color to #39e6d0
5. **"Studio" Appears (1500-1800ms)**: The word "Studio" appears letter by letter, sliding to the right
6. **Fade Out and Navbar Appears (2000-3000ms)**: The animation fades out while the navbar with the glassmorphic header appears

## Dependencies

- React 18 with TypeScript
- styled-components for styling
- framer-motion for advanced animations

## Navbar Menu Sections

- Services
- Pricing
- Concept Portfolio
- About
- Contact