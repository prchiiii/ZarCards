import { createCanvas, loadImage } from '@napi-rs/canvas';
import * as defaultTheme from './themes/default.js';

export class Zar {
    constructor() {
        this.theme = defaultTheme;
    }

    async generate(options) {
        // Validate required options
        if (!options.title) {
            throw new Error("Missing required option: title");
        }
        if (!options.author) {
            throw new Error("Missing required option: author");
        }
        if (!options.background) {
            throw new Error("Missing required option: background");
        }
        if (!options.colors) {
            throw new Error("Missing required option: colors");
        }
        if (!options.authorImage) {
            throw new Error("Missing required option: authorImage");
        }

        const mergedOptions = {
            ...options,
            colors: {
                title: options.colors?.title || "#ffffff",
                author: options.colors?.author || "#aaaaaa",
                progressText: options.colors?.progressText || "#cccccc",
                progressBar: options.colors?.progressBar || "#1db954"
            },
            imageDarkness: options.imageDarkness !== undefined ? options.imageDarkness : 0,
            cardRoundness: options.cardRoundness !== undefined ? options.cardRoundness : true // Default to true
        };

        const canvas = createCanvas(this.theme.CARD_WIDTH, this.theme.CARD_HEIGHT);
        const ctx = canvas.getContext('2d');

        await this.theme.drawBackground(ctx, mergedOptions);
        this.theme.drawTitle(ctx, mergedOptions);
        this.theme.drawAuthor(ctx, mergedOptions);

        if (mergedOptions.authorImage) {
            await this.theme.drawAuthorImage(ctx, mergedOptions);
        }

        if (mergedOptions.progress !== undefined && mergedOptions.duration !== undefined) {
            this.theme.drawProgressBar(ctx, mergedOptions);
            this.theme.drawProgressText(ctx, mergedOptions);
        }

        return canvas.encode('png');
    }
}
