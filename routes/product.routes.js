import express from "express";
import { addProduct, getProducts, updateProduct, getProductById } from "../controllers/productController.js";

const router = express.Router();

router.post("/add", addProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);

export default router;