import { Router } from "express";
import { signUp, signIn } from "../controllers/users.controllers.js";
import validateSignUp from "../middlewares./validateSignUp.middleware.js";

const usersRouter = Router();

usersRouter.post("/signup", validateSignUp, signUp);
usersRouter.post("/signin", signIn);

export default usersRouter;