import { io } from "socket.io-client";

// ✅ Connect to WebSocket server
const socket = io("http://localhost:3000", {
    transports: ["websocket"], 
});

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");
const clearBtn = document.getElementById("clearButton");

// Set initial canvas size
canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.8;

let drawing = false;
let currentColor = "#000000"; // Default color

colorPicker.addEventListener("input", (e) => {
    currentColor = e.target.value;
});

// ✅ Handle drawing events locally and send them to the server
canvas.addEventListener("mousedown", () => drawing = true);
canvas.addEventListener("mouseup", () => {
    drawing = false;
    ctx.beginPath();
});
canvas.addEventListener("mousemove", (event) => {
    if (!drawing) return;

    const x = event.clientX - canvas.offsetLeft;
    const y = event.clientY - canvas.offsetTop;

    // Draw locally
    drawOnCanvas(x, y, currentColor);

    // Send drawing data to server
    socket.emit("drawing", { x, y, color: currentColor });
});

// ✅ Function to draw on the canvas
function drawOnCanvas(x, y, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// ✅ Listen for drawing updates from other clients
socket.on("drawing", (data) => {
    drawOnCanvas(data.x, data.y, data.color);
});

// ✅ Handle clear board event
clearBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit("clearBoard"); // Notify the server to clear the board for all clients
});

// ✅ Listen for board clear events from the server
socket.on("clearBoard", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

