import express from "express";
import userController from "../controllers/userController";
import bannerController from "../controllers/bannerController";
import authController from "../controllers/authController";
import groupController from "../controllers/groupController";
import multer from "multer";

import { checkUserJWT } from "../middleware/JWTAction";

// config form data
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

const initApiRoutes = (app) => {
  // check permission and authorization
  router.all("*", checkUserJWT);

  // user routes
  router.post("/create-user", upload.single("image"), userController.createFunc);
  router.get("/get-All-User", userController.readFunc);
  router.put("/update-user", upload.single("image"), userController.updateFunc);
  router.delete("/delete-user", userController.deleteFunc);

  //banner routes
  router.post("/create-banner", upload.single("image"), bannerController.createFunc);
  router.get("/get-All-Banner", bannerController.readFunc);
  router.put("/update-banner", upload.single("image"), bannerController.updateFunc);
  router.delete("/delete-banner", bannerController.deleteFunc);

  //auth routes
  router.post("/login", authController.handleLogin);
  router.post("/register", authController.handleRegister);
  router.post("/logout", authController.handleLogout)
  router.post("/auth/refresh_token", authController.handleRefreshToken)

  // group routes
  router.get("/group/read", groupController.readFunc);

  return app.use("/api/v1", router);
};

export default initApiRoutes;
