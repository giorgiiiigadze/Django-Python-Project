    const BASE_URL = "http://127.0.0.1:8000"
    const token = localStorage.getItem("accessToken")

    async function getUserProfile() {
      if (!token) {
        document.getElementById("profile-container").innerHTML = 
          "<p>You are not logged in. Please log in first.</p>"
        return
      }

      try {
        const response = await fetch(`${BASE_URL}/users/profile/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Error " + response.status)
        }

        const user = await response.json()
        renderProfile(user)
      } catch (err) {
        document.getElementById("profile-container").innerText =
          "Failed to load profile."
        console.error(err)
      }
    }

    function renderProfile(user) {
      const container = document.getElementById("profile-container");

      container.innerHTML = `
        <h1><strong>Username:</strong> ${user.username}</h1>

        <h2>First Name: ${user.first_name}, Last Name: ${user.last_name}</h2>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Phone:</strong> ${user.phone_number || "N/A"}</p>

        <h3>Posted Cars</h3>
        <div class="cars-list">
          ${user.posted_cars?.length
            ? user.posted_cars.map(car => `
                <a href="car_details.html?id=${car.id}" class="car-card" style="color: #fff; text-decoration: underline;">${car.brand} ${car.model}</a>`
              ).join("")
            : "<p>No posted cars.</p>"
          }
        </div>

        <h3>Liked Cars</h3>
        <div class="cars-list">
          ${user.liked_cars?.length
            ? user.liked_cars.map(car => `
                <a href="car_details.html?id=${car.id}" class="car-card" style="color: #fff; text-decoration: underline;">${car.brand} ${car.model}</a>`
              ).join("")
            : "<p>No liked cars.</p>"
          }
        </div>

      <h3>Rented Cars</h3>
      <div class="cars-list">
        ${user.rented_cars?.length
          ? user.rented_cars.map(rental => `
              <a href="car_details.html?id=${rental.car.id}" class="car-card" style="color: #fff; text-decoration: underline;">
                ${rental.car.brand} ${rental.car.model} <br>
                <small>Days: ${rental.days}, Total: $${rental.total_price}</small>
              </a>`
            ).join("")
          : "<p>No rented cars.</p>"
        }
      </div>

      `;
    }


    document.addEventListener("DOMContentLoaded", getUserProfile)
