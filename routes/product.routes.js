import express from "express";
import { addProduct, getProducts, updateProduct } from "../controllers/productController.js";

const router = express.Router();

router.post("/add", addProduct);
router.get("/", getProducts);
router.put("/:id", updateProduct);

export default router;