import { Router } from "express";
import {getUrl, shortenUrl} from "../controllers/urls.controllers.js";
import validateUrl from "../middlewares/validateUrl.middleware.js";
import validateUser from "../middlewares/validateUser.middleware.js";

const urlsRouter = Router();

urlsRouter.post("/urls/shorten", validateUrl, validateUser, shortenUrl);
urlsRouter.get("/urls/:id", getUrl);

export default urlsRouter;