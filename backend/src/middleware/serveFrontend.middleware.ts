// backend/src/middleware/serveFrontend.middleware.ts
import { NextFunction, Response, RequestHandler, Request } from "express";
import fs from "fs";
import path from "path";
import { HttpStatus } from "../constants/http-status.enum";

export const serveFrontend = (DIST_PATH: string): RequestHandler => {
    const htmlPath = path.join(DIST_PATH, "index.html");

    let indexHtmlContent: string | null = null;

    try {
        if (fs.existsSync(htmlPath)) {
            indexHtmlContent = fs.readFileSync(htmlPath, "utf8");
        } else {
            console.error(`[Frontend Error]: index.html not found at ${htmlPath}`);
        }
    } catch (err) {
        console.error("[Frontend Error]: Failed to read index.html into memory:", err);
    }

    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (indexHtmlContent !== null) {
                res.setHeader("Content-Type", "text/html; charset=UTF-8");
                return res.send(indexHtmlContent);
            }

            return res.status(HttpStatus.NOT_FOUND).type("html").send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Page Not Found</title>

    <script src="https://cdn.tailwindcss.com"></script>
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
    />
</head>

<body class="min-h-screen bg-white text-black antialiased">
    <main class="flex min-h-screen items-center justify-center px-5 py-10">
        <section class="w-full max-w-lg text-center">

            <div
                class="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full border-2 border-black"
            >
                <i class="fa-solid fa-circle-exclamation text-2xl"></i>
            </div>

            <p class="mb-3 text-sm font-medium uppercase tracking-widest text-black/50">
                Error 404
            </p>

            <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">
                Page Not Found
            </h1>

            <p class="mx-auto mt-4 max-w-md text-sm leading-6 text-black/60 sm:text-base">
                The page you are looking for doesn't exist or may have been moved.
                Please check the URL and try again.
            </p>

            <a
                href="/"
                class="mt-8 inline-flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
                <i class="fa-solid fa-house text-xs"></i>
                Go Home
            </a>

        </section>
    </main>
</body>
</html>
`);
        } catch (err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: "Error loading frontend",
            });
        }
    };
};
