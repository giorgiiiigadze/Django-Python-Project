document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    phone_number: document.getElementById("phone_number").value,
    first_name: document.getElementById("first_name").value,
    last_name: document.getElementById("last_name").value,
    password: document.getElementById("password").value,
    confirm_password: document.getElementById("confirm_password").value,
  };

  try {
    const response = await fetch("http://127.0.0.1:8000/users/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    const msgEl = document.getElementById("message");

    if (response.ok) {
      msgEl.style.color = "green";
      msgEl.textContent = result.message || "Registered successfully!";
      document.getElementById("registerForm").reset();
      
      window.location.href = "/registration/login.html"

    } else {
      msgEl.style.color = "red";
      msgEl.textContent = JSON.stringify(result);
    }
  } catch (error) {
    document.getElementById("message").style.color = "red";
    document.getElementById("message").textContent = "Server error: " + error;
  }
});
 