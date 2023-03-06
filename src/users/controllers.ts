import { Router } from "express";
import * as user from "./services";

const route = Router();

route.get("/", user.viewAllUsers);

route.post("/", user.register);

route.post("/login", user.login);

route.post("/logout", user.logout);

route.post("/check", user.findInfo);

route.get("/:email", user.viewProfile);

route.delete("/:email", user.unregister);

export default route;
