import MongoStore from "connect-mongo";
import cors, { type CorsOptions } from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import session from "express-session";
import http from "http";
import Redis from "ioredis";
import { AuthType } from "webrm-shared";
import { connect } from "~/database";
import { api } from "~/endpoints";
import { link } from "~/features/link";
import { Terminal, User } from "~/models";
import { socket } from "~/socket";
import { chainMiddlewares, destroySession, json } from "~/utils/express";
import "dotenv/config";


const port = process.env["APP_PORT"]?.trim();
if (typeof port == "undefined" || port.length == 0) {
  throw new Error("Missing environment variable APP_PORT");
}

const mongoUrl = process.env["APP_MONGODB_URL"]?.trim();
if (typeof mongoUrl == "undefined" || mongoUrl.length == 0) {
  throw new Error("Missing environment variable MONGODB_URL");
}

const redisUrl = process.env["APP_REDIS_URL"]?.trim();
if (typeof redisUrl == "undefined" || redisUrl.length == 0) {
  throw new Error("Missing environment variable REDIS_URL");
}

const sessionSecret = process.env["APP_SESSION_SECRET"]?.trim();
if (typeof sessionSecret == "undefined" || sessionSecret.length == 0) {
  throw new Error("Missing environment variable APP_SESSION_SECRET");
}

const corsAllowedOrigins = process.env["APP_ALLOW_ORIGIN"]?.split(",")
  .map((origin: string) => origin.trim())
  .filter(Boolean) ?? [];

const corsOptions: CorsOptions = {
  credentials: true,
  origin: (requestOrigin, callback) => {
    const allowed = corsAllowedOrigins.some((allowedOrigin) => requestOrigin?.startsWith(allowedOrigin));

    callback(null, allowed);
  },
};

// Connect to the database
try {
  await connect(mongoUrl);
  console.log("MongoDB connected successfully");
}
catch (error) {
  console.error("MongoDB connection error:", error);
  process.exit(1);
}

// Initialize the app
const app = express();
const server = http.createServer(app);
const redis = new Redis(redisUrl);
const sessionMiddleware = session({
  secret: sessionSecret,
  saveUninitialized: false,
  resave: false,
  cookie: { secure: false },
  store: new MongoStore({
    mongoUrl: mongoUrl,
    mongoOptions: {
      authSource: "admin",
    },
    collectionName: "sessions",
  }),
});

async function validateUserMiddleware(req: Request, res: Response, next: NextFunction) {
  req.user = null;
  req.terminal = null;

  if (typeof req.session.auth == "undefined") {
    return next();
  }


  try {
    switch (req.session.auth.type) {
    case AuthType.Admin:
    case AuthType.Waiter:
      req.user = await User.findById(req.session.auth.id);
      if (req.user === null) {
        await destroySession(req);

        return json(res, 401, { error: "Invalid session" });
      }

      break;

    case AuthType.AreaTerminal:
    case AuthType.TableTerminal:
      req.terminal = await Terminal.findById(req.session.auth.id);
      if (req.terminal === null) {
        await destroySession(req);

        return json(res, 401, { error: "Invalid session" });
      }

      // TODO: Check if the area is still enabled
      // TODO: Check if the table still exists

      break;

    default:
      return json(res, 401, { error: "Invalid session" });
    }
  }
  catch (error) {
    return next(error);
  }

  return next();
}

const authMiddleware = chainMiddlewares(sessionMiddleware, validateUserMiddleware);


// Initialize link
link.initialize({
  redis,
});

// Initialize Socket.io
socket.initialize(server, {
  redis,
  cors: corsOptions,
  middleware: authMiddleware,
});

// Middleware
app.use(cors(corsOptions));
app.use(authMiddleware);
app.use(express.json());

// Routes
app.use("/api", api.toRouter());

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
