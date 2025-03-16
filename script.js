document.getElementById("recommend-btn").addEventListener("click", function () {
    const movieName = document.getElementById("movie-name").value.trim();
    const recommendationsDiv = document.getElementById("recommendations");

    
    recommendationsDiv.innerHTML = "";

    if (movieName === "") {
        recommendationsDiv.innerHTML = "<p>Please enter a movie name.</p>";
        return;
    }

    fetch(`http://127.0.0.1:5000/recommend?movie_name=${encodeURIComponent(movieName)}`)
        .then(response => response.json())
        .then(data => {
            recommendationsDiv.innerHTML = "<h3>🎥 Recommended Movies:</h3>";
            
            if (data.error) {
                recommendationsDiv.innerHTML += `<p>${data.error}</p>`;
            } else {
                const movieList = document.createElement("ul");
                data.forEach(movie => {
                    const listItem = document.createElement("li");
                    listItem.textContent = movie;
                    movieList.appendChild(listItem);
                });
                recommendationsDiv.appendChild(movieList);
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            recommendationsDiv.innerHTML = "<p>Failed to fetch data. Try again later.</p>";
        });
});
