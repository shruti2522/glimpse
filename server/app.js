const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db.config");
const cookieParser = require("cookie-parser");

/**
 * -------------- GENERAL SETUP ----------------
 */

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require("dotenv").config();

// Connection to DB
connectDB();

// Create the Express application object
const app = express();

// Create an HTTP server and integrate it with Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      "https://tourmaline-axolotl-1d1eae.netlify.app",
      "http://localhost:3000",
    ], 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Compress the HTTP response sent back to a client
app.use(compression());

// Use Helmet to protect against well known vulnerabilities
app.use(helmet({
    contentSecurityPolicy: false,
}));

// use Morgan dep 
app.use(morgan(process.env.NODE_ENV === "production" ? "common" : "dev"));

const allowedOrigins = [
    'https://tourmaline-axolotl-1d1eae.netlify.app',
    'http://localhost:3000' 
];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Parsers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

/**
 * -------------- ROUTES ----------------
 */
require("./routes/auth.route")(app);
require("./routes/post.route")(app);
require("./routes/user.route")(app);

/**
 * -------------- SOCKET.IO ----------------
 */

// Listen for Socket.IO connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle receiving messages
  socket.on("send_message", (message) => {
    console.log("Message received:", message);

    // Broadcast message to all connected clients
    io.emit("receive_message", message);
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

/**
 * -------------- SERVER ----------------
 */

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Specify the PORT which will the server running on
const PORT = process.env.PORT || 3001;

// Disabling Powered by tag
app.disable("x-powered-by");

// Start the server with HTTP and Socket.IO
httpServer.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}.`
  );
});
