const API_URL = "http://localhost:8080/user";

// ------------------- SIGNUP
export const signup = async (userData) => {
  const response = await fetch(`${API_URL}/addUser`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Signup failed");
  }

  const data = await response.json();
  const { token, user } = data;

  if (!token || !user) throw new Error("Signup failed");

  // Store JWT token and user info in localStorage
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  return { token, user };
};

// ------------------- LOGIN
export const login = async (credentials) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Invalid email or password");
  }

  const data = await response.json();
  const { token, user } = data;

  if (!token || !user) throw new Error("Login failed");

  // Store JWT token and user info in localStorage
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  return { token, user };
};

// ------------------- LOGOUT
export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

// ------------------- GET STORED USER
export const getStoredUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// ------------------- AUTH CHECK
export const isAuthenticated = () => {
  return Boolean(localStorage.getItem("token"));
};
