import express, { Express, Request, Response } from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import { createUser, login } from "./handlers/user";
import dotenv from 'dotenv';
import router from "./router";
import { protect } from "./modules/auth";

dotenv.config();

const app: Express = express();
const port = 3000;

// Middleware to parse JSON in the request body
app.use(bodyParser.json());
app.use(cors());

app.post("/signup", createUser);
app.post("/login", login);

app.use("/api", protect, router);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
