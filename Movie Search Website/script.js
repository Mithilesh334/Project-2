const API_KEY = "api_key=1cf50e6248dc270629e802686245c2c8";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const searchURL = BASE_URL + "/search/movie?" + API_KEY;

const recommendationsHeader = document.getElementById("recommendations-header");
const main = document.getElementById("main");
const recommendations = document.getElementById("recommendations");
const form = document.getElementById("form");
const search = document.getElementById("search");

getMovies(API_URL);

function getMovies(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      showMovies(data.results);
    });
}

function getRecommendations(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.results.length > 0) {
        const movieId = data.results[0].id;
        const recommendationsURL = `${BASE_URL}/movie/${movieId}/recommendations?${API_KEY}&language=en-US&page=1`;

        fetch(recommendationsURL)
          .then((res) => res.json())
          .then((data) => {
            showRecommendations(data.results);
          });
      } else {
        recommendations.innerHTML = `<p class="no-results">No recommendations found.</p>`;
      }
    });
}

function showMovies(data) {
  main.innerHTML = "";
  data.forEach((movie) => {
    const { title, poster_path, vote_average, overview } = movie;
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie", "fade-in");

    movieEl.innerHTML = `
      <img src="${poster_path ? IMG_URL + poster_path : './no-image.jpg'}" alt="${title}">
      <div class="movie-info">
        <h3>${title}</h3>
        <span class="${getColor(vote_average)}">${Math.round(vote_average * 10) / 10}</span>
      </div>
      <div class="overview">
        <h3>Overview</h3>
        <p>${overview || "No overview available."}</p>
      </div>
    `;

    main.appendChild(movieEl);
  });
}

function showRecommendations(data) {
  recommendations.innerHTML = "";
  if (data.length === 0) {
    recommendations.innerHTML = `<p class="no-results">No similar movies found.</p>`;
    return;
  }

  data.forEach((movie) => {
    const { title, poster_path, vote_average, overview } = movie;
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie", "fade-in");

    movieEl.innerHTML = `
      <img src="${poster_path ? IMG_URL + poster_path : './no-image.jpg'}" alt="${title}">
      <div class="movie-info">
        <h3>${title}</h3>
        <span class="${getColor(vote_average)}">${Math.round(vote_average * 10) / 10}</span>
      </div>
      <div class="overview">
        <h3>Overview</h3>
        <p>${overview || "No overview available."}</p>
      </div>
    `;

    recommendations.appendChild(movieEl);
  });
}

function getColor(vote) {
  if (vote >= 8) return "green";
  else if (vote >= 5) return "orange";
  else return "red";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value.trim();

  if (searchTerm) {
    getMovies(searchURL + "&query=" + encodeURIComponent(searchTerm));
    getRecommendations(searchURL + "&query=" + encodeURIComponent(searchTerm));
    recommendationsHeader.hidden = false;
  } else {
    getMovies(API_URL);
    recommendationsHeader.hidden = true;
  }
});
