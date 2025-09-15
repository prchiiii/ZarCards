import { loadImage } from '@napi-rs/canvas';

export const CARD_WIDTH = 600;
export const CARD_HEIGHT = 200;

export const DEFAULT_COLORS = {
    title: "#ffffff",
    author: "#aaaaaa",
    progressText: "#cccccc",
    progressBar: "#1db954"
};

export const FONT_FAMILY = "PlusJakartaSans-Regular"; // Assuming this font is available

export async function drawBackground(ctx, options) {
    const radius = 15; // A fixed radius for card corners

    if (options.cardRoundness) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(radius, 0);
        ctx.lineTo(CARD_WIDTH - radius, 0);
        ctx.quadraticCurveTo(CARD_WIDTH, 0, CARD_WIDTH, radius);
        ctx.lineTo(CARD_WIDTH, CARD_HEIGHT - radius);
        ctx.quadraticCurveTo(CARD_WIDTH, CARD_HEIGHT, CARD_WIDTH - radius, CARD_HEIGHT);
        ctx.lineTo(radius, CARD_HEIGHT);
        ctx.quadraticCurveTo(0, CARD_HEIGHT, 0, CARD_HEIGHT - radius);
        ctx.lineTo(0, radius);
        ctx.quadraticCurveTo(0, 0, radius, 0);
        ctx.closePath();
        ctx.clip();
    }

    ctx.fillStyle = "#000000"; // Default background color
    ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

    if (options.background) {
        try {
            const backgroundImage = await loadImage(options.background);
            ctx.drawImage(backgroundImage, 0, 0, CARD_WIDTH, CARD_HEIGHT);

            if (options.imageDarkness > 0) {
                ctx.fillStyle = `rgba(0, 0, 0, ${options.imageDarkness / 100})`;
                ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
            }
        } catch (error) {
            console.error("Error loading background image:", error);
        }
    }

    if (options.cardRoundness) {
        ctx.restore();
    }
}

export async function drawAuthorImage(ctx, options) {
    if (options.authorImage) {
        try {
            const authorImage = await loadImage(options.authorImage);
            const x = 20;
            const y = 20;
            const width = 160;
            const height = 160;
            const cornerRadius = options.authorImageRound !== undefined ? options.authorImageRound : 0;
            const radius = Math.min(width / 2, height / 2, (cornerRadius / 100) * (width / 2));

            if (radius > 0) {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(x + radius, y);
                ctx.lineTo(x + width - radius, y);
                ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
                ctx.lineTo(x + width, y + height - radius);
                ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                ctx.lineTo(x + radius, y + height);
                ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
                ctx.lineTo(x, y + radius);
                ctx.quadraticCurveTo(x, y, x + radius, y);
                ctx.closePath();
                ctx.clip();
            }

            ctx.drawImage(authorImage, x, y, width, height);

            if (radius > 0) {
                ctx.restore();
            }
        } catch (error) {
            console.error("Error loading author image:", error);
        }
    }
}

export function drawTitle(ctx, options) {
    let titleY = 65; // Adjusted Y position for when progress bar is present
    let titleFontSize = 28; // Revert to original size when progress bar is present

    if (options.progress === undefined && options.duration === undefined) {
        titleY = 95; // Adjusted Y position for more centering
        titleFontSize = 36; // Make it bigger
    }

    ctx.font = `bold ${titleFontSize}px ${FONT_FAMILY}`;
    ctx.fillStyle = options.colors.title || DEFAULT_COLORS.title;
    ctx.fillText(options.title, 200, titleY);
}

export function drawAuthor(ctx, options) {
    let authorY = 95; // Adjusted Y position for when progress bar is present
    let authorFontSize = 20; // Revert to original size when progress bar is present

    if (options.progress === undefined && options.duration === undefined) {
        authorY = 135; // Adjusted Y position for more centering
        authorFontSize = 24; // Make it bigger
    }

    ctx.font = `${authorFontSize}px ${FONT_FAMILY}`;
    ctx.fillStyle = options.colors.author || DEFAULT_COLORS.author;
    ctx.fillText(options.author, 200, authorY);
}

export function drawProgressBar(ctx, options) {
    const progressBarY = 136; // Adjusted for new height
    const progressBarWidth = 380;
    const progressBarHeight = 16; // Increased height
    const progressBarX = 200;

    // Background of the progress bar
    ctx.fillStyle = "#333333";
    ctx.fillRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);

    if (options.progress !== undefined && options.duration !== undefined && options.duration > 0) {
        const progressPercentage = options.progress / options.duration;
        const currentProgressWidth = progressBarWidth * progressPercentage;

        ctx.fillStyle = options.colors.progressBar || DEFAULT_COLORS.progressBar;
        ctx.fillRect(progressBarX, progressBarY, currentProgressWidth, progressBarHeight);
    }
}

export function drawProgressText(ctx, options) {
    const progressTextX = 200;
    const progressTextY = 170; // Increased for more space

    ctx.font = `14px ${FONT_FAMILY}`;
    ctx.fillStyle = options.colors.progressText || DEFAULT_COLORS.progressText;

    const formatTime = (seconds) => {
        if (typeof seconds !== 'number' || isNaN(seconds)) return "00:00";
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const currentTime = formatTime(options.progress);
    const totalTime = formatTime(options.duration);

    ctx.fillText(`${currentTime} / ${totalTime}`, progressTextX, progressTextY);
}

