export const startDevServer = (app: any) => {
    if (process.env.NODE_ENV as string !== "production") {
        const PORT = Number(process.env.PORT) || 3000;
        app.listen(PORT, () =>
            console.log(`App running on http://localhost:${PORT}`),
        );
    }
}