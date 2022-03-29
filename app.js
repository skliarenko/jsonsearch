const URL = "wines.json";
let search_term = "";

const WINES_LIMIT = 6;
let STARTING_IDX = 0;

const app = document.querySelector("#app ul");
const loading = document.querySelector(".loading");
const searchErr = document.querySelector(".search-err");

const observer = new IntersectionObserver(
  ([entry]) => {
    if (!entry.isIntersecting) return;
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      loading.style.display = "flex";
      getWines();
    }
  },
  { threshold: 1 }
);

const observerEl = (element) => {
  observer.observe(element);
  loading.style.display = "none";
};

const loadData = async () => {
  try {
    const results = await fetch(URL);
    data = await results.json();
  } catch (error) {
    console.error(error);
  }
};

const getWines = async () => {
  loading.style.display = "flex";

  await loadData();

  const dataFilltered = data.filter(({ winery }) =>
    winery.toLowerCase().includes(search_term.toLowerCase())
  );

  let arrTemp = [].concat(dataFilltered);

  const wines = arrTemp
    .map(
      ({
        color,
        winery,
        wine,
        image,
        location,
        rating: { average, reviews },
      }) => {
        return `
        <li class="card">
          <h2>${winery}</h2>
          <p><span>wine:</span> ${wine}</p>
          <p><span>color:</span> ${color}</p>
          <p><span>location:</span> ${location}</p>
          <div class="rating">
            <span>average: ${average} </span>
            <span>reviews: ${reviews} </span>
          </div>
          <img src="${image}" alt="${winery}">
        </li>
      `;
      }
    )
    .slice(STARTING_IDX, STARTING_IDX + WINES_LIMIT);

  app.innerHTML += wines.join("");

  const renderWines = document.querySelectorAll(".card");

  STARTING_IDX = renderWines.length;
  const lastRenderWine = renderWines[renderWines.length - 1];

  if (arrTemp.length !== renderWines.length) {
    observerEl(lastRenderWine);
  }

  if (arrTemp.length == 0) {
    searchErr.style.display = "block";
  } else {
    searchErr.style.display = "none";
  }

  loading.style.display = "none";
};

getWines();

const inputSearch = document.querySelector(".search-custom");

inputSearch.addEventListener("input", (e) => {
  app.innerHTML = "";
  search_term = e.target.value;

  if (search_term !== "" || search_term == "") {
    STARTING_IDX = 0;
  }

  getWines();
});
