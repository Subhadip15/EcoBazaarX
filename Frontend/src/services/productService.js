const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";
const PRODUCT_API_URL = `${API_BASE_URL}/products`;

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseResponse(response, fallbackMessage) {
  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const message = data?.message || data?.error || fallbackMessage;
    throw new Error(message);
  }

  return data;
}

export async function getProducts() {
  let response;
  try {
    response = await fetch(PRODUCT_API_URL, {
      headers: {
        ...getAuthHeaders()
      }
    });
  } catch {
    throw new Error(
      `Cannot reach backend API at ${API_BASE_URL}. Ensure backend is running.`
    );
  }

  const data = await parseResponse(response, "Failed to load products");
  return Array.isArray(data) ? data : [];
}

export async function getProductById(productId) {
  let response;
  try {
    response = await fetch(`${PRODUCT_API_URL}/${productId}`, {
      headers: {
        ...getAuthHeaders()
      }
    });
  } catch {
    throw new Error(
      `Cannot reach backend API at ${API_BASE_URL}. Ensure backend is running.`
    );
  }

  return parseResponse(response, "Failed to load product");
}

export async function createProduct(productData) {
  let response;
  try {
    response = await fetch(PRODUCT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders()
      },
      body: JSON.stringify(productData)
    });
  } catch {
    throw new Error(
      `Cannot reach backend API at ${API_BASE_URL}. Ensure backend is running.`
    );
  }

  return parseResponse(response, "Failed to create product");
}

export async function updateProduct(productId, productData) {
  let response;
  try {
    response = await fetch(`${PRODUCT_API_URL}/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders()
      },
      body: JSON.stringify(productData)
    });
  } catch {
    throw new Error(
      `Cannot reach backend API at ${API_BASE_URL}. Ensure backend is running.`
    );
  }

  return parseResponse(response, "Failed to update product");
}

export async function deleteProduct(productId) {
  let response;
  try {
    response = await fetch(`${PRODUCT_API_URL}/${productId}`, {
      method: "DELETE",
      headers: {
        ...getAuthHeaders()
      }
    });
  } catch {
    throw new Error(
      `Cannot reach backend API at ${API_BASE_URL}. Ensure backend is running.`
    );
  }

  await parseResponse(response, "Failed to delete product");
}
