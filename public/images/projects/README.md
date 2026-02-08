# Project Images Directory

## Upload Your Images Here

Place your project images in this directory:
```
/public/images/projects/
```

## Naming Convention

Name your images using the **project slug** from `projects.js`:

```
Birds-AI.jpg
nephele-community-robot.jpg
5g-network-implementation.jpg
domestic-emotion-monitoring-system.jpg
thz-bandpass-filter.jpg
```

**Important:** The filename (without extension) must match the `slug` field in your project data.

## Supported Formats

- `.jpg` or `.jpeg`
- `.png`
- `.webp`

## Recommended Image Specs

- **Width**: 800-1200px
- **Height**: 600-800px
- **Aspect Ratio**: 4:3 or 16:9
- **File Size**: Under 500KB

## Example

If your project slug is `Birds-AI`, name your image:
- `Birds-AI.jpg` ✅
- `birds-ai.jpg` ✅ (case-insensitive)
- `BirdsAI.jpg` ❌ (must match slug exactly)

## How Images Will Be Used

The projects page will automatically look for images at:
```
/images/projects/{slug}.jpg
```

If no image is found, a placeholder icon will be shown.

## Quick Upload

Copy your images here:
```bash
cp ~/Downloads/your-project-image.jpg public/images/projects/Birds-AI.jpg
```
