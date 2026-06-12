import dotenv from "dotenv";
dotenv.config();
import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morganMiddleware from "./config/morgan.js";
import errorHandler from "./middleware/error.middleware.js";
import router from "./routes/index.js";

const app: Express = express();
app.set("trust proxy", 1);

const allowedOrigins = ["http://localhost:5173", process.env.CLIENT_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morganMiddleware);

app.use("/api", router);

app.use(errorHandler);

export default app;
