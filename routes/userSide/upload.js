import express from "express";
import { tryCatchHandler } from "../../middlewares/tryCatchHandler.js";
import * as uploadImagevedioController from "../../controller/userSide/uploadfile.js";
import response from "../../middlewares/response.js";
import upload from "../../helpers/uploadFile.js";

const router = express.Router();

router.get(
  "/list-product-placeholders",
  tryCatchHandler(uploadImagevedioController.getProductsplaceHolder),
  response
);

router.post(
  "/upload-product-file",upload.single("file"),
  tryCatchHandler(uploadImagevedioController.uploadFile),
  response
);

router.get(
  "/list-uploaded-file",
  tryCatchHandler(uploadImagevedioController.getuploadedImage),
  response
);

router.delete(
  "/delete-uploaded-file",
  tryCatchHandler(uploadImagevedioController.deleteFile),
  response
);

export default router;
