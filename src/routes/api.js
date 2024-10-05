import express from "express";
import userController from "../controllers/userController";
import bannerController from "../controllers/bannerController";
import authController from "../controllers/authController"
import groupController from "../controllers/groupController"
import multer from "multer";

// config form data
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

const initApiRoutes = (app) => {
    // user
    router.post("/create-user", upload.single("image"), userController.createFunc);
    router.get("/get-All-User", userController.readFunc);
    router.put("/update-user", upload.single("image"), userController.updateFunc)
    router.delete("/delete-user", userController.deleteFunc)

    //banner
    router.post("/create-banner", upload.single("image"), bannerController.createFunc);
    router.get("/get-All-Banner", bannerController.readFunc);
    router.put("/update-banner", upload.single("image"), bannerController.updateFunc);
    router.delete("/delete-banner", bannerController.deleteFunc);

    //auth user
    router.post("/login", authController.handleLogin);
    router.post("/register", authController.handleRegister);

    // group routes
    router.get("/group/read", groupController.readFunc);


    return app.use("/api/v1", router)
}

export default initApiRoutes