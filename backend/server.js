require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const https = require("https");

const app = express();

const PORT = process.env.PORT || 5000;

// ==========================================
// FILES
// ==========================================

const PRODUCTS_FILE = path.join(__dirname, "data", "products.json");

const ORDERS_FILE = path.join(__dirname, "data", "orders.json");

// ==========================================
// RAZORPAY
// ==========================================

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());

// Preview videos/images
app.use(
  "/uploads/previews",
  express.static(path.join(__dirname, "uploads/previews")),
);

// ==========================================
// HELPERS
// ==========================================

function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    return [];
  }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function getProducts() {
  return readJSON(PRODUCTS_FILE);
}

function getOrders() {
  return readJSON(ORDERS_FILE);
}

// ==========================================
// HEALTH
// ==========================================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is working",
  });
});

// ==========================================
// GET ALL TEMPLATES
// ==========================================

app.get("/api/templates", (req, res) => {
  try {
    const products = getProducts();

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to load templates",
    });
  }
});

// ==========================================
// GET ONE TEMPLATE
// ==========================================

app.get("/api/templates/:slug", (req, res) => {
  try {
    const products = getProducts();

    const product = products.find((item) => item.slug === req.params.slug);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to load template",
    });
  }
});

// ==========================================
// CREATE RAZORPAY ORDER
// ==========================================

app.post("/api/payment/create-order", async (req, res) => {
  try {
    const { productId, email } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const products = getProducts();

    const product = products.find((item) => item.id === productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ₹299 = 29900 paise
    const amount = Math.round(Number(product.price) * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: product.currency || "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        productId: product.id,
        email,
      },
    });

    // Save order locally
    const orders = getOrders();

    orders.push({
      productId: product.id,

      email,

      amount: product.price,

      razorpayOrderId: razorpayOrder.id,

      razorpayPaymentId: null,

      status: "created",

      createdAt: new Date().toISOString(),
    });

    writeJSON(ORDERS_FILE, orders);

    res.json({
      success: true,

      order: {
        id: razorpayOrder.id,

        amount: razorpayOrder.amount,

        currency: razorpayOrder.currency,
      },

      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create payment order",
    });
  }
});

// ==========================================
// VERIFY PAYMENT
// ==========================================

app.post("/api/payment/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Incomplete payment information",
      });
    }

    const orders = getOrders();

    const order = orders.find(
      (item) => item.razorpayOrderId === razorpay_order_id,
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Generate signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // Compare signatures
    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Update order
    order.razorpayPaymentId = razorpay_payment_id;

    order.status = "payment_verified";

    // Temporary download token.
    // We'll improve this later.
    order.downloadToken = crypto.randomBytes(32).toString("hex");

    order.downloadCount = 0;

    order.maxDownloads = 3;

    writeJSON(ORDERS_FILE, orders);

    res.json({
      success: true,

      productId: order.productId,

      downloadToken: order.downloadToken,

      message: "Payment verified",
    });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
});

// ==========================================
// SECURE DOWNLOAD
// ==========================================

app.get("/api/download/:productId/:token", (req, res) => {
  try {
    const { productId, token } = req.params;

    const orders = readOrders();

    const order = orders.find(
      (o) =>
        o.productId === productId &&
        o.downloadToken === token &&
        o.paymentStatus === "payment_verified",
    );

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "Invalid or unauthorized download link",
      });
    }

    const product = products.find((p) => p.id === productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (order.downloadCount >= order.maxDownloads) {
      return res.status(403).json({
        success: false,
        message: "Download limit reached",
      });
    }

    // Private backend-only mapping for downloadable files
    const downloadUrls = {
      tpl_001:
        "https://github.com/AhateshamDev/riyanks-template-store/releases/download/v1.0.0/Bairan.PF-20260915T145035Z-1-001.zip",
    };

    const fileUrl = downloadUrls[productId];

    if (!fileUrl) {
      return res.status(404).json({
        success: false,
        message: "Template file not configured",
      });
    }

    order.downloadCount += 1;
    writeOrders(orders);

    https
      .get(fileUrl, (githubResponse) => {
        if (
          githubResponse.statusCode >= 300 &&
          githubResponse.statusCode < 400
        ) {
          const redirectUrl = githubResponse.headers.location;

          if (!redirectUrl) {
            return res.status(502).json({
              success: false,
              message: "Unable to access template file",
            });
          }

          https.get(redirectUrl, (finalResponse) => {
            if (finalResponse.statusCode !== 200) {
              return res.status(502).json({
                success: false,
                message: "Unable to download template file",
              });
            }

            res.setHeader(
              "Content-Disposition",
              `attachment; filename="${product.title}.zip"`,
            );
            res.setHeader("Content-Type", "application/zip");

            finalResponse.pipe(res);
          });

          return;
        }

        if (githubResponse.statusCode !== 200) {
          return res.status(502).json({
            success: false,
            message: "Unable to download template file",
          });
        }

        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${product.title}.zip"`,
        );
        res.setHeader("Content-Type", "application/zip");

        githubResponse.pipe(res);
      })
      .on("error", (error) => {
        console.error("Download error:", error);

        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: "Template download failed",
          });
        } else {
          res.end();
        }
      });
  } catch (error) {
    console.error("Download route error:", error);

    res.status(500).json({
      success: false,
      message: "Download failed",
    });
  }
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
