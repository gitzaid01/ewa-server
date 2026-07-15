import Product from "../modals/ProductModel.js";

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      category,
      description,
      image,
      specifications,
      applications,
      isFeatured,
    } = req.body;

    const productExists = await Product.findOne({ slug });

    if (productExists) {
      return res.status(400).json({
        success: false,
        message: "Product already exists",
      });
    }

    const product = await Product.create({
      name,
      slug,
      category,
      description,
      image,
      specifications,
      applications,
      isFeatured,
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};