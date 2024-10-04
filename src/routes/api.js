import express from "express";
import userController from "../controllers/userController";
import bannerController from "../controllers/bannerController";
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

    return app.use("/api/v1", router)
}

export default initApiRoutes