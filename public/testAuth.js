/**
 * Script to set up test authentication token
 * You can run this directly in your browser's developer console
 */
(async function () {
  try {
    // Make an actual login request to get a real token
    const response = await fetch("http://localhost:8000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "nitesh04@gmail.com",
        password: "11111111",
      }),
    });

    const data = await response.json();
    console.log("Login response:", data);

    if (data && data.data && data.data.token) {
      localStorage.setItem("token", data.data.token);
      if (data.data.user) {
        localStorage.setItem("user", JSON.stringify(data.data.user));
      }
      console.log("✅ Authenticated successfully with a real token!");
      console.log("You can now refresh the page to access protected routes.");
      return;
    } else {
      console.error("Token not found in response:", data);
    }
  } catch (error) {
    console.error("Failed to get real token:", error);
  }

  // Fallback to mock token if real token fails
  console.warn("⚠️ Could not get a real token. Using mock token instead.");
  console.warn(
    "⚠️ Note: API calls requiring authentication will fail with this token."
  );

  localStorage.setItem("token", "test-token-for-development");
  localStorage.setItem(
    "user",
    JSON.stringify({
      id: "1",
      name: "Test User",
      email: "test@example.com",
      role: "admin",
    })
  );

  console.log("✅ Test authentication set up with mock data.");
})();
