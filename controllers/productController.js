import Product from "../modals/ProductModel.js";
import slugify from "slugify";

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      image,
      specifications,
      applications,
      isFeatured,
    } = req.body;

    // Generate slug
    let slug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    });

    // Ensure slug is unique
    let count = 1;
    let tempSlug = slug;

    while (await Product.findOne({ slug: tempSlug })) {
      tempSlug = `${slug}-${count}`;
      count++;
    }

    slug = tempSlug;

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


export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // If the name changes, regenerate the slug
    if (req.body.name && req.body.name !== product.name) {
      let slug = slugify(req.body.name, {
        lower: true,
        strict: true,
        trim: true,
      });

      let count = 1;
      let tempSlug = slug;

      while (
        await Product.findOne({
          slug: tempSlug,
          _id: { $ne: product._id },
        })
      ) {
        tempSlug = `${slug}-${count}`;
        count++;
      }

      req.body.slug = tempSlug;
    }

    Object.assign(product, req.body);

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};