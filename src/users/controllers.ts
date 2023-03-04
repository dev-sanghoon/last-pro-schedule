import { Router } from "express";
import * as user from "./services";

const route = Router();

route.post("/", user.register);

route.get("/:id", user.viewProfile);

route.delete("/:id", user.unregister);

route.post("/login", user.login);

route.post("/logout", user.logout);

route.post("/check", user.findInfo);

export default route;
