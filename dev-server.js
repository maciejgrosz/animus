import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs/promises'; // Use Node.js's fs module
import { fileURLToPath } from 'url';

async function startServer() {
    const app = express();
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    // Create Vite server in middleware mode
    const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'custom',
    });

    // Use Vite's middleware
    app.use(vite.middlewares);

    // Serve index.html for the root path
    app.use(/.*/, async (req, res, next) => {
        try {
            const url = req.originalUrl;

            // Read index.html using Node.js's fs module
            const templatePath = path.resolve(__dirname, 'index.html');
            let template = await fs.readFile(templatePath, 'utf-8');

            // Transform the HTML using Vite
            template = await vite.transformIndexHtml(url, template);

            res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } catch (e) {
            vite.ssrFixStacktrace(e);
            next(e);
        }
    });

    app.listen(3000, () => {
        console.log('🚀 Dev server running at http://localhost:3000');
    });
}

startServer();
