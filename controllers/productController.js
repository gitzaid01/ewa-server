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

export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      featured,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    // Search by product name
    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter featured products
    if (featured !== undefined) {
      filter.isFeatured = featured === "true";
    }

    const currentPage = Number(page);
    const pageLimit = Number(limit);

    const skip = (currentPage - 1) * pageLimit;

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageLimit);

    const totalProducts = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      totalProducts,
      currentPage,
      totalPages: Math.ceil(totalProducts / pageLimit),
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};