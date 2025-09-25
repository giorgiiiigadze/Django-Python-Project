const BASE_URL = "http://127.0.0.1:8000"
const token = localStorage.getItem("accessToken")

document.getElementById("carForm").addEventListener("submit", async (e) => {
    e.preventDefault()

    const form = e.target
    const formData = new FormData(form)

    try {
        const res = await fetch(`${BASE_URL}/cars/api/post_car/`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })

        const data = await res.json()

        const messageDiv = document.getElementById("message")
        if (res.ok) {
            messageDiv.style.color = "green"
            messageDiv.innerText = "Car added successfully!"
            form.reset()

        } else {
            messageDiv.style.color = "red"
            messageDiv.innerText = "Error: " + JSON.stringify(data.errors || data)
        }

    } catch (err) {
        document.getElementById("message").style.color = "red"
        document.getElementById("message").innerText = "Error: " + err
    }
})