// frontend/plugins/preloadStyles.ts
import { type Plugin } from "vite";
const preloadStyles = (): Plugin => {
    return {
        name: "vite-plugin-preload-styles",
        transformIndexHtml(html, ctx) {
            if (!ctx.bundle) return html;

            const preloadTags: string[] = [];

            for (const fileName in ctx.bundle) {
                if (fileName.endsWith(".css")) {
                    preloadTags.push(`<link rel="preload" href="/${fileName}" as="style" />`);
                }
            }

            return {
                html,
                tags: preloadTags.map((tag) => ({
                    tag: "link",
                    attrs: {
                        rel: "preload",
                        as: "style",
                        href: tag.match(/href="([^"]+)"/)?.[1] || "",
                    },
                    injectTo: "head-prepend",
                })),
            };
        },
    };
};

export default preloadStyles;
