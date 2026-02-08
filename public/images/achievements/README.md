# How to Add Your Achievement Photos

## Quick Start

1. **Save your achievement photos** to this folder:
   ```
   /home/plasma/Charan/Portfolio/V2/portfolio/test/test1/portfolio/public/images/achievements/
   ```

2. **Name your files** exactly as shown below:
   - `inventors-challenge-23.jpg` - Inventors Challenge 2023 Winner photo/certificate
   - `sih-23.jpg` - Smart India Hackathon 2023 Finalist photo
   - `sih-22.jpg` - Smart India Hackathon 2022 Finalist photo
   - `nbuc-24.jpg` - NBUC 2024 First Place photo

3. **Activate the images** in the component:
   - Open: `/home/plasma/Charan/Portfolio/V2/portfolio/test/test1/portfolio/src/components/Achievements.jsx`
   - Find the commented section around line 120:
     ```jsx
     {/* Uncomment when you add images */}
     {/* <img
       src={achievement.image}
       alt={achievement.title}
       className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
     /> */}
     ```
   - **Uncomment** those lines (remove `{/*` and `*/}`)
   - **Comment out or remove** the icon placeholder section below it

## Image Recommendations

- **Format**: JPG, PNG, or WebP
- **Size**: 800x600px or similar aspect ratio (4:3 or 16:9)
- **Quality**: High resolution but optimized for web (under 500KB each)
- **Content**: Certificates, award photos, team photos, or event moments

## Adding More Achievements

To add additional achievements, edit the `achievements` array in `Achievements.jsx`:

```javascript
{
  id: 5,
  title: "Your Achievement Title",
  date: "2024",
  description: "Brief description of what you achieved and why it matters.",
  image: "/images/achievements/your-image.jpg",
  category: "Competition", // or "Innovation", "Hackathon", etc.
  icon: Award, // Choose: Award, Trophy, Users, Lightbulb
  color: "from-purple-500/20 to-pink-500/20",
  borderColor: "border-purple-500/30",
}
```

## Current Status

✅ Achievements section is live at `http://localhost:3000/#achievements`
✅ Directory created for images
⏳ Waiting for you to add your achievement photos
⏳ Uncomment image code once photos are added
