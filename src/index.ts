import express, { Express, Request, Response } from "express";
import * as bodyParser from "body-parser";

const app: Express = express();
const port = 3000;

// Middleware to parse JSON in the request body
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
