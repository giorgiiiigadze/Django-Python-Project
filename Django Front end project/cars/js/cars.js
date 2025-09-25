const accessToken = localStorage.getItem("accessToken")

const BASE_URL = "http://127.0.0.1:8000"

const heading = document.getElementById("animated-heading")
const words = heading.innerText.split(" ")
const paragraph = document.querySelector(".text p")
const button = document.querySelector(".text a")
const my_liked_cars = document.querySelector(".my_liked_cars")
const my_liked_cars_container = document.querySelector(".my_liked_cars_container")
const text = document.querySelector(".text")
const messageDiv = document.getElementById('messages')
const rent_container = document.getElementById("rent_container")
const filtration = document.querySelector(".filtration")
const liked_text = document.getElementById("liked_text")
const text_filtration_button = document.getElementById("text_filtration_button")
document.querySelector(".text .try-now-button").href = "/registration/login.html"

const backToTopBtn = document.getElementById("backToTop");

window.onscroll = function () {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
};

backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


function animateHeading() {
    const words = heading.innerText.split(" ")
    heading.innerHTML = ""
    words.forEach((word, index) => {
        const span = document.createElement("span")
        span.innerText = word
        span.style.display = "inline-block"
        span.style.marginRight = "0.25em"
        span.style.animationDelay = `${index * 0.2}s`
        heading.appendChild(span)
    })

    setTimeout(() => {
        paragraph.style.animationPlayState = "running"
    }, words.length * 200 + 300)

    setTimeout(() => {
        button.style.animationPlayState = "running"
    }, words.length * 200 + 800)
}

animateHeading()


if (accessToken) {
    my_liked_cars.style.display = "flex"
    text.innerHTML = `
        <h1 id="animated-heading">Welcome👋</h1>
        <p>Feel free to explore new cars for your need!🚗</p>
        <a href="#cars" class="explore_more">Explore more</a>
    `
    filtration.style.display = 'flex'
    filtration.style.opacity = "1";
    // if (my_liked_cars_container.length){
    //     liked_text.innerHTML = "No liked cars"
    // } es argamomivida

} else {
    my_liked_cars.style.display = "none"
    my_liked_cars_container.style.display = "none"

    text.style.display = "flex"

}



text_filtration_button.addEventListener("click", function() {
    if (filtration.style.display === "flex" && filtration.style.opacity === "1") {
        filtration.style.opacity = "0"
        setTimeout(() => {
            filtration.style.display = "none"
        }, 300)
    } else {
        filtration.style.display = "flex"
        setTimeout(() => {
            filtration.style.opacity = "1"
        }, 10)
    }
})


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


// ///////////////////////////////////////////////////////////////////////////////////////
// Liked cars list
fetch(`${BASE_URL}/cars/api/liked_cars/`, {
    headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
    }
    })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        return response.json();
    })    
    .then(data =>{
        console.log("Liked cars response:", data)
        const cars = data.results ? data.results : data

        cars.forEach(liked_car => {
            

            let photoUrl = liked_car.photo1.startsWith("http")
                ? liked_car.photo1
                : `${BASE_URL}${liked_car.photo1}`


            const liked_car_container = document.createElement("div")
            liked_car_container.className = 'liked_car_container'
            liked_car_container.style.backgroundImage = `url("${photoUrl}")`
            // liked_car_container.innerHTML = `${liked_car.id}`
            
            const likeBtn = document.createElement("button")
            likeBtn.className = "liked_cars_button"
            likeBtn.innerHTML = '❤️ Unlike'
            likeBtn.onclick = () => {
                const token = localStorage.getItem("accessToken")
                if (!token) return showMessage("You must be logged in to like cars!", 'red')

                fetch(`${BASE_URL}/cars/api/cars/`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ car_id: liked_car.id })
                })
                .then(res => res.json())
                .then(data => {
                    likeBtn.innerText = data.message === "Car liked" ? "💔 Unlike" : "❤️ Like"
                    showMessage(`${liked_car.brand}, ${liked_car.model} ${data.message === "Car liked" ? "Liked!" : "Unliked!"}`, data.message === "Car liked" ? "#2c6e2e" : "red");
                })
                .catch(err => console.error("Error liking car:", err))
            }
            liked_car_container.appendChild(likeBtn)

            const link_liked_car = document.createElement("a")
            link_liked_car.href = `car_details.html?id=${liked_car.id}`
            link_liked_car.innerText = "Check More"
            link_liked_car.className = "liked_cars_button"

            liked_car_container.appendChild(link_liked_car)
            // liked_car_container.innerText = `${liked_car.brand} ${liked_car.model}`;
            my_liked_cars.appendChild(liked_car_container)
        });



    })
    .catch(error => {
        console.error("Error fetching cars:", error)
        document.getElementById("my_liked_cars").innerHTML =
            "<p style='text-align:center; color:red'>Failed to load cars.</p>"
    })


// //////////////////////////////////////////////////////////////////////////////////////////////////////////////


function renderCarsList(cars) {
    const container = document.getElementById("cars-list");
    container.innerHTML = "";

    if (!cars.length) {
        container.innerHTML = "<p style='text-align:center'>No cars found.</p>"
        return;
    }

    cars.forEach(car => {
        let photoUrl = car.photo1.startsWith("http") ? car.photo1 : `${BASE_URL}${car.photo1}`

        const card = document.createElement("div")
        card.className = "car-card"
        card.style.backgroundRepeat = "no-repeat"

        const infoDiv = document.createElement("div")
        infoDiv.className = "car_info"

        const img = document.createElement("img")
        img.src = photoUrl;
        infoDiv.appendChild(img);

        const detailsDiv = document.createElement("div")
        detailsDiv.className = "car_info_details"

        const brand = document.createElement("h4")
        brand.innerText = car.brand.length < 25 ? `Brand: ${car.brand}` : `Brand: ${car.brand.substring(0, 20)}...`
        detailsDiv.appendChild(brand);

        const model = document.createElement("p")
        model.innerText = `Model: ${car.model}`
        detailsDiv.appendChild(model);

        const available = document.createElement("p");
        available.innerText = `Is Available: ${car.is_available}`
        detailsDiv.appendChild(available);

        const like_rent_buttons = document.createElement('div')
        like_rent_buttons.className = "like_rent_buttons"

        const likeBtn = document.createElement("button")
        likeBtn.className = "like_button"
        likeBtn.innerText = car.is_liked ? "💔 Unlike" : "❤️ Like"
        likeBtn.onclick = () => {
            const token = localStorage.getItem("accessToken")
            if (!token) return showMessage("You must be logged in to like cars!", 'red')

            fetch(`${BASE_URL}/cars/api/cars/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ car_id: car.id })
            })
            .then(res => res.json())
            .then(data => {
                likeBtn.innerText = data.message === "Car liked" ? "💔 Unlike" : "❤️ Like"
                showMessage(`${car.brand}, ${car.model} ${data.message === "Car liked" ? "Liked!" : "Unliked!"}`, data.message === "Car liked" ? "#2c6e2e" : "red");
            })
            .catch(err => console.error("Error liking car:", err))
        }
        like_rent_buttons.appendChild(likeBtn)

        // Rent button
        const rentBtn = document.createElement("a")
        rentBtn.className = "rent_button"
        if (car.is_available) {
            rentBtn.href = `/cars/rent.html?id=${car.id}`
            rentBtn.innerText = "Rent"
        } else {
            rentBtn.href = "#"
            rentBtn.innerText = "Not available"
            rentBtn.onclick = (e) => {
                e.preventDefault()
                // if(car.rented_by == car.user){
                //     showMessage("The car has already been rented by you!")             
                // } es argamomivida
                showMessage(`Sorry, ${car.brand} ${car.model} is not available right now.`, "red")
            }
        }
        like_rent_buttons.appendChild(rentBtn)

        detailsDiv.appendChild(like_rent_buttons)
        infoDiv.appendChild(detailsDiv)

        const link = document.createElement("a")
        link.href = `car_details.html?id=${car.id}`
        link.innerText = "Check More"
        link.className = "car_button"

        card.appendChild(infoDiv)
        card.appendChild(link)
        container.appendChild(card)
    });
}

function renderCars() {
    fetch(`${BASE_URL}/cars/api/cars/`)
        .then(response => response.json())
        .then(data => renderCarsList(data))
        .catch(error => {
            console.error("Error fetching cars:", error);
            document.getElementById("cars-list").innerHTML =
                "<p style='text-align:center; color:red'>Failed to load cars.</p>"
        });
}

const brandInput = document.getElementById("brandFilter")
const modelInput = document.getElementById("modelFilter")
const availabilityInput = document.getElementById("availabilityFilter")
const filterForm = document.getElementById("filterForm")

filterForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const params = new URLSearchParams();
    if (brandInput.value.trim()) params.append("brand", brandInput.value.trim())
    if (modelInput.value.trim()) params.append("model", modelInput.value.trim())
    if (availabilityInput.value) params.append("is_available", availabilityInput.value)

    fetch(`${BASE_URL}/cars/api/cars/?${params.toString()}`)
        .then(res => res.json())
        .then(data => renderCarsList(data))
        .catch(err => console.error("Error fetching filtered cars:", err))
});

document.getElementById("resetFilter").addEventListener("click", () => {
    brandInput.value = ""
    modelInput.value = ""
    availabilityInput.value = ""
    renderCars()
})

renderCars()

// Fetching footer
fetch("footer.html")
    .then(res => res.text())
    .then(data => {
    document.getElementById("footer").innerHTML = data
})

