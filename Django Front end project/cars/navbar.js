document.addEventListener("DOMContentLoaded", () => {
  fetch("/cars/navbar.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("navbar").innerHTML = data
      initNavbar()
    })
})

// const messageDiv = document.getElementById("messages")

// function showMessage(message, color = "#2c6e2e", duration = 2000) {
//     messageDiv.style.display = 'flex'
//     messageDiv.style.opacity = '1'
//     messageDiv.style.backgroundColor = color
//     messageDiv.innerHTML = message

//     setTimeout(() => {
//         messageDiv.style.opacity = '0'
//         setTimeout(() => {
//             messageDiv.style.display = 'none'
//         }, 500)
//     }, duration)
// }

function initNavbar() {
  const loginSignupContainer = document.querySelector(".login_signup_links")
  if (!loginSignupContainer) return

  const accessToken = localStorage.getItem("accessToken")

  const restrictedLinks = [
    document.getElementById("product-link"),

    document.querySelector(".nav-links a[href='#']"),
    document.querySelector(".nav-links a[href='/cars/profile.html']")
  ]

  if (accessToken) {
    const loginLink = loginSignupContainer.querySelector('.login')
    const signupLink = loginSignupContainer.querySelector('.sign_up')
    const getStartedLink = loginSignupContainer.querySelector(".get-started")

    if (loginLink) loginLink.style.display = "none"
    if (signupLink) signupLink.style.display = "none"
    if (getStartedLink) getStartedLink.style.display = "none"

    const logoutBtn = document.createElement("a")
    logoutBtn.style.border = '1px solid #fff'
    logoutBtn.style.padding = "12px 16px"
    logoutBtn.style.borderRadius = "8px"
    logoutBtn.textContent = "Logout"
    logoutBtn.href = "#"
    logoutBtn.classList.add("nav-link")

    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      localStorage.removeItem("accessToken")
      location.reload()
    })

    loginSignupContainer.appendChild(logoutBtn)
  } else {
    restrictedLinks.forEach(link => {
      if (link) {
        link.addEventListener("click", (e) => {
          e.preventDefault()

          showMessage("You must be logged in to access this page.", 'red')
          // alert("You must be logged in to access this page.")
        })
      }
    })
  }
}
