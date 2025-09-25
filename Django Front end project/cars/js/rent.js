const form = document.getElementById('rentForm')
const messageDiv = document.getElementById('message')

// Get carId from URL so user doesn't have to select it
const params = new URLSearchParams(window.location.search)
const carId = params.get("id")
const BASE_URL = "http://127.0.0.1:8000"


document.getElementById('car').value = carId

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const days = document.getElementById('days').value || 1
    const token = localStorage.getItem('accessToken')

    if (!token) {
        messageDiv.style.backgroundColor = 'red'
        messageDiv.style.color = '#fff'
        messageDiv.style.opacity = '1'
        messageDiv.textContent = "You must be logged in to rent a car!"
        return
    }

    try {
        const carId = new URLSearchParams(window.location.search).get("id")

        const response = await fetch(`${BASE_URL}/cars/api/rent_car/${carId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ days: days })
        })



        const data = await response.json()
        
        if (response.ok) {
            messageDiv.style.backgroundColor = '#4CAF50'
            messageDiv.style.color = '#fff'
            messageDiv.style.opacity = '1'
            messageDiv.textContent = `Success! ${data.rental.car} rented for ${data.rental.days} days. Total: $${data.rental.total_price}`
        } else {
            messageDiv.style.backgroundColor = 'red'
            messageDiv.style.color = '#fff'
            messageDiv.style.opacity = '1'
            messageDiv.textContent = data.error || 'Something went wrong!'
        }

        setTimeout(() => {
            messageDiv.style.opacity = '0'
        }, 5000)

    } catch (err) {
        messageDiv.style.backgroundColor = 'red'
        messageDiv.style.color = '#fff'
        messageDiv.style.opacity = '1'
        messageDiv.textContent = 'Network error!'
        console.error(err)
    }
})

// Fetch Navbar
fetch("navbar.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("navbar").innerHTML = data
    })
