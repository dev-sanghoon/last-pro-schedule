import { Router } from "express";
import * as user from "./services";
import auth from "../auth";

const route = Router();

route.get("/", auth, user.viewAllUsers);

route.post("/", user.register);

route.post("/login", user.login);

route.post("/logout", auth, user.logout);

route.post("/check", user.findInfo);

route.get("/verification/:email", user.verifyEmail);

route.get("/:email", auth, user.viewProfile);

route.delete("/:email", auth, user.unregister);

export default route;
