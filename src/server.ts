/**
 * Setup express server.
 */

import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import helmet from "helmet";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { corsOptions } from "./config/corsOptions";
import logger from "jet-logger";
import { AuthService,ContactService } from "./services/index";
import "express-async-errors";
import {verifyJWT }from "./middleware/verifyJWT"
import BaseRouter from "@src/routes/api";
import apiContactRouter from "@src/routes/contact/apiContact";
import Paths from "@src/constants/Paths";

import EnvVars from "@src/constants/EnvVars";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";

import { NodeEnvs } from "@src/constants/misc";
import { RouteError } from "@src/other/classes";
const credentials = require("./middleware/credentials");
// **** Variables **** //
const app = express();
// **** Setup **** //
app.use(credentials);
// Basic middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(EnvVars.CookieProps.Secret));

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf()) {
  app.use(morgan("dev"));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
  app.use(helmet());
}

// Add APIs, must be after middleware
app.use(Paths.Base, BaseRouter);

// Add error handler
app.use(
  (
    err: Error,
    _: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
  ) => {
    if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
      logger.err(err, true);
    }
    let status = HttpStatusCodes.BAD_REQUEST;
    if (err instanceof RouteError) {
      status = err.status;
    }
    return res.status(status).json({ error: err.message });
  }
);

// ** Front-End Content ** //

// Set views directory (html)
const viewsDir = path.join(__dirname, "views");
app.set("views", viewsDir);

// Set static directory (js and css).
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));

// Nav to users pg by default
// app.get('/', async (_: Request, res: Response) => {
//   const data=await getAll.getAll(_,res);
//   return res.status(200).json(data);
//   //return res.redirect('/users');
// });
app.post("/auth", async (req: Request, res: Response) => {
  const authData = await AuthService.handleLogin(req, res);
  return authData;
});

app.get("/refresh", async (req: Request, res: Response) => {
  const refreshToken = await AuthService.handleRefreshToken(req, res);
  return refreshToken;
});

app.get("/logout", async (req: Request, res: Response) => {
  const logoutData= await AuthService.handleLogout(req, res);
  return logoutData;
});

app.use(verifyJWT);
app.use("/contact", apiContactRouter);

// Redirect to login if not logged in.
app.get("/users", (_: Request, res: Response) => {
  return res.sendFile("users.html", { root: viewsDir });
});

app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
      res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
      res.json({ "error": "404 Not Found" });
  } else {
      res.type('txt').send("404 Not Found");
  }
});

// **** Export default **** //

export default app;
