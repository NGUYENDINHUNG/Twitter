import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import { engine } from "express-handlebars";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "express-flash";
import passport from "passport";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import passportSocketIo from "passport.socketio";

// Cấu hình riêng
import config from "./config/secret.js";
import mainRouter from "./routes/main.js";
import userRouter from "./routes/user.js";
import socketHandler from "./reatimes/io.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Kết nối MongoDB
mongoose
  .connect(config.database)
  .then(() => console.log("✅ Connected to the database"))
  .catch((err) => console.error("Database connection failed:", err));

// Session store
const sessionStore = MongoStore.create({
  mongoUrl: config.database,
  autoReconnect: true,
});

// Cấu hình middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public")));
app.use(cookieParser());
app.use(flash());

app.engine(".hbs", engine({ defaultLayout: "layout", extname: ".hbs" }));
app.set("view engine", ".hbs");

// Cấu hình session
app.use(
  session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true,
    store: sessionStore,
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// WebSocket auth qua session
io.use(
  passportSocketIo.authorize({
    cookieParser,
    key: "connect.sid",
    secret: config.secret,
    store: sessionStore,
    success: onAuthorizeSuccess,
    fail: onAuthorizeFail,
  })
);

// Routing
app.use(userRouter);
app.use(mainRouter);

// WebSocket handler
socketHandler(io);

// WebSocket authorize callbacks
function onAuthorizeSuccess(data, accept) {
  console.log("✅ WebSocket authenticated");
  accept();
}

function onAuthorizeFail(data, message, error, accept) {
  console.log(" WebSocket auth failed:", message);
  if (error) accept(new Error(message));
}

// Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});
