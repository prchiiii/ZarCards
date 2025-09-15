import { Zar } from '../src/index.js'; // Adjust path for local testing
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory (works with ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
    const card = new Zar();

    const baseOptions = {
        title: "Zarco Music",
        author: "ZarCodeX",
        background: "https://raw.githubusercontent.com/ZarCodeX/ZarCodeX/refs/heads/main/images/bg.png",
        authorImage: "https://raw.githubusercontent.com/ZarCodeX/ZarCodeX/refs/heads/main/images/ZarCodeX%20(original).png", // Required
        colors: {
            title: "#aafffbff",
            author: "#93f2ffff",
            progressText: "#00fff2ff",
            progressBar: "#1db954"
        }
    };

    // Resolve output path inside /example folder
    const out = (name) => path.join(__dirname, name);

    // 1. Basic Card (Required fields only)
    const basicCardBuffer = await card.generate({ ...baseOptions });
    fs.writeFileSync(out("music-card-basic.png"), basicCardBuffer);
    console.log("✅ Basic music card generated!");

    // 2. Card with Author Image (Rounded)
    const authorImageRoundedCardBuffer = await card.generate({
        ...baseOptions,
        authorImageRound: 100 // Circle
    });
    fs.writeFileSync(out("music-card-author-rounded.png"), authorImageRoundedCardBuffer);
    console.log("✅ Author image (rounded) music card generated!");

    // 3. Card with Author Image (Square)
    const authorImageSquareCardBuffer = await card.generate({
        ...baseOptions,
        authorImageRound: 0 // Square
    });
    fs.writeFileSync(out("music-card-author-square.png"), authorImageSquareCardBuffer);
    console.log("✅ Author image (square) music card generated!");

    // 4. Card with Progress Bar
    const progressBarCardBuffer = await card.generate({
        ...baseOptions,
        progress: 120,
        duration: 200
    });
    fs.writeFileSync(out("music-card-progress.png"), progressBarCardBuffer);
    console.log("✅ Progress bar music card generated!");

    // 5. Card with Image Darkness
    const imageDarknessCardBuffer = await card.generate({
        ...baseOptions,
        imageDarkness: 80 // More darkness
    });
    fs.writeFileSync(out("music-card-darkness.png"), imageDarknessCardBuffer);
    console.log("✅ Image darkness music card generated!");

    // 6. Card with all optional features
    const allFeaturesCardBuffer = await card.generate({
        ...baseOptions,
        progress: 150,
        duration: 300,
        authorImageRound: 50, // Half-rounded
        imageDarkness: 40,
        cardRoundness: true
    });
    fs.writeFileSync(out("music-card-all-features.png"), allFeaturesCardBuffer);
    console.log("✅ All features music card generated!");

    // 7. Card with cardRoundness: false (rectangular)
    const rectangularCardBuffer = await card.generate({
        ...baseOptions,
        cardRoundness: false
    });
    fs.writeFileSync(out("music-card-rectangular.png"), rectangularCardBuffer);
    console.log("✅ Rectangular music card generated!");

})();
