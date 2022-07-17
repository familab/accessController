import dotenv from "dotenv";
import { listener } from "./listener.js";
import { sheetsHandler } from "./sheets.js";

import path from "path";

// // Initialize Config
dotenv.config();

const port = process.env.SERVER_PORT;

// Default handler

let app = new listener(port);
app.init();