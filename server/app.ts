import "react-router";
import { createRequestHandler } from "@react-router/express";
import express from "express";
import mongoose from 'mongoose';

import connectMongo from "./database/db"
import api_router from "./routes/index";

declare module "react-router" {
  interface AppLoadContext {
    VALUE_FROM_EXPRESS: string;
    db: mongoose.Connection;
  }
}

const db = await connectMongo();

export const app = express();

app.use(api_router);

app.use(
  createRequestHandler({
    // @ts-expect-error - virtual module provided by React Router at build time
    build: () => import("virtual:react-router/server-build"),
    getLoadContext() {
      if (!db) throw new Error("Database not initialized");
      return {
        VALUE_FROM_EXPRESS: "some_value",
        db
      };
    },
  })
);
