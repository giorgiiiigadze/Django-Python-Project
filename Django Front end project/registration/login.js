const messageDiv = document.getElementById("messages")

function showMessage(message, color = "#2c6e2e", duration = 2000) {
    messageDiv.style.display = 'flex'
    messageDiv.style.opacity = '1'
    messageDiv.style.backgroundColor = color
    messageDiv.innerHTML = message

    setTimeout(() => {
        messageDiv.style.opacity = '0'
        setTimeout(() => {
            messageDiv.style.display = 'none'
        }, 500)
    }, duration)
}


document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault()

  const data = {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/users/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()
    // const msgEl = document.getElementById("loginMessage")f

    if (response.ok) {
      // msgEl.style.color = "green"
      // msgEl.textContent = "Login successful!"

      localStorage.setItem("accessToken", result.access)
      localStorage.setItem("refreshToken", result.refresh)

      window.location.href = "/cars/index.html"
    } 
    else {
        showMessage("Use or password incorrect!.", 'red')
    }
  } catch (error) {
    const msgEl = document.getElementById("loginMessage")
    messageDiv.style.color = "red"
    messageDiv.textContent = "Server error: " + error
  }
})

