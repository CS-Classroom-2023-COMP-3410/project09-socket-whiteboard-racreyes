export default {
    server: {
        proxy: {
            "/socket.io": {
                target: "http://localhost:3000", // ✅ Backend WebSocket server
                ws: true, // ✅ Enable WebSocket proxying
                changeOrigin: true
            }
        }
    }
};
