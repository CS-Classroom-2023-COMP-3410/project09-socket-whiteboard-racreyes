const { Server } = require("socket.io");

// Create a WebSocket server on port 3000 with CORS enabled
const io = new Server(3000, {
    cors: {
        origin: "http://localhost:5173", // ✅ Allow Vite frontend
        methods: ["GET", "POST"], // ✅ Only allow necessary methods
        allowedHeaders: ["*"], // ✅ Allow all headers
    }
});

// Store board state (optional)
let boardState = [];

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Send the current board state to the new user
    socket.emit("loadBoard", boardState);

    // Listen for drawing events from clients
    socket.on("drawing", (data) => {
        boardState.push(data); // Save drawing state
        socket.broadcast.emit("drawing", data); // Send to all except sender
    });

    // Listen for board clear event
    socket.on("clearBoard", () => {
        boardState = []; // Reset board
        io.emit("clearBoard"); // Notify all clients
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
        console.log(`User disconnected`);
    });
});

console.log("WebSocket server running on ws://localhost:3000");
