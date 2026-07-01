export const startDevServer = (app: any) => {
    if ((process.env.NODE_ENV as string) !== 'production') {
        const PORT = Number(process.env.PORT) || 3000;
        app.listen(PORT, () => {
            console.log(`[${process.env.NODE_ENV as string || 'development'}] Server running on http://localhost:${PORT}`);
        });
    }
};
