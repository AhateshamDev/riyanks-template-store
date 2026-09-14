const API_URL = "https://riyanks-template-store.onrender.com/api";

// ==========================================
// GET ALL TEMPLATES
// ==========================================

export async function getTemplates() {
  const response = await fetch(`${API_URL}/templates`);

  if (!response.ok) {
    throw new Error("Failed to load templates");
  }

  return response.json();
}

// ==========================================
// GET TEMPLATE
// ==========================================

export async function getTemplate(slug) {
  const response = await fetch(`${API_URL}/templates/${slug}`);

  if (!response.ok) {
    throw new Error("Template not found");
  }

  return response.json();
}

// ==========================================
// CREATE PAYMENT ORDER
// ==========================================

export async function createPaymentOrder(productId, email) {
  const response = await fetch(`${API_URL}/payment/create-order`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      productId,
      email,
    }),
  });

  return response.json();
}

// ==========================================
// VERIFY PAYMENT
// ==========================================

export async function verifyPayment(paymentData) {
  const response = await fetch(`${API_URL}/payment/verify`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(paymentData),
  });

  return response.json();
}

// ==========================================
// DOWNLOAD URL
// ==========================================

export function getDownloadUrl(productId, token) {
  return `${API_URL}/download/${productId}/${token}`;
}
