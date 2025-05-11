document.addEventListener("DOMContentLoaded", () => {
    const welcomePage = document.getElementById("welcomePage");
    const mainInterface = document.getElementById("mainInterface");
    const cardContainer = document.getElementById("cardContainer");
    const searchInput = document.getElementById("searchInput");
    const regionFilter = document.getElementById("regionFilter");
    const populationFilter = document.getElementById("populationFilter");

    // Variable global para almacenar todos los países
    let allCountries = [];

    // Mostrar la página principal cuando se hace clic en el botón
    document.getElementById("enterButton").addEventListener("click", () => {
        welcomePage.style.display = "none";
        mainInterface.style.display = "block";
        fetchCountries();  // Llamada a la API para obtener los países
    });

    // Filtrar los países cuando se escribe en la barra de búsqueda
    searchInput.addEventListener("input", () => {
        const filteredCountries = filterCountries(allCountries);  // Filtramos los datos locales
        displayCards(filteredCountries);  // Mostramos las tarjetas filtradas
    });

    // Filtrar los países por región
    regionFilter.addEventListener("change", () => {
        const filteredCountries = filterCountries(allCountries);  // Filtramos los datos locales
        displayCards(filteredCountries);  // Mostramos las tarjetas filtradas
    });

    // Filtrar los países por población
    populationFilter.addEventListener("change", () => {
        const filteredCountries = filterCountries(allCountries);  // Filtramos los datos locales
        displayCards(filteredCountries);  // Mostramos las tarjetas filtradas
    });

    // Función para obtener los países de la API
    async function fetchCountries() {
        if (allCountries.length === 0) {  // Si no hay países almacenados, hacemos la llamada a la API
            try {
                const response = await fetch("https://restcountries.com/v3.1/all?lang=es");
                allCountries = await response.json();  // Guardamos los países en la variable global
                
                // Ordenar los países alfabéticamente
                allCountries.sort((a, b) => {
                    const nameA = a.translations.spa.common.toLowerCase();
                    const nameB = b.translations.spa.common.toLowerCase();
                    return nameA.localeCompare(nameB);
                });

                displayCards(allCountries);  // Mostrar los países iniciales
            } catch (error) {
                console.error("Error al obtener los datos de la API:", error);
            }
        } else {
            // Si ya tenemos los países almacenados, solo los filtramos
            const filteredCountries = filterCountries(allCountries);
            displayCards(filteredCountries);
        }
    }

    // Función para filtrar los países por región, población y búsqueda
    function filterCountries(countries) {
        const region = regionFilter.value;
        const population = populationFilter.value;
        const searchTerm = searchInput.value.toLowerCase();

        return countries.filter(country => {
            let matchesRegion = true;
            let matchesPopulation = true;
            let matchesSearch = true;

            // Filtrar por región si está seleccionado
            if (region) {
                matchesRegion = country.region === region;
            }

            // Filtrar por población
            if (population === "small") {
                matchesPopulation = country.population < 1000000;
            } else if (population === "medium") {
                matchesPopulation = country.population >= 1000000 && country.population <= 10000000;
            } else if (population === "large") {
                matchesPopulation = country.population > 10000000;
            }

            // Filtrar por búsqueda
            if (searchTerm) {
                matchesSearch = country.translations.spa.common.toLowerCase().includes(searchTerm);
            }

            return matchesRegion && matchesPopulation && matchesSearch;
        });
    }

    // Función para mostrar las tarjetas de los países
    function displayCards(countries) {
        cardContainer.innerHTML = "";  
        countries.forEach(country => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">
                        <img src="${country.flags.svg}" alt="Bandera de ${country.translations.spa.common}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 5px;">
                        <h2>${country.translations.spa.common}</h2>
                        <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "No disponible"}</p>
                        <p><strong>Población:</strong> ${country.population.toLocaleString()}</p>
                        <p><strong>Idioma(s):</strong> ${country.languages ? Object.values(country.languages).join(", ") : "No disponible"}</p>
                    </div>
                    <div class="card-back">
                        <h2>Otros datos interesantes</h2>
                        <p><strong>Extensión Territorial:</strong> ${country.area ? country.area.toLocaleString() + " km²" : "No disponible"}</p>
                        <p><strong>Región:</strong> ${country.region}</p>
                        <p><strong>Fronteras:</strong> ${country.borders ? country.borders.join(", ") : "Sin fronteras"}</p>
                        <a href="https://www.google.com/maps?q=${country.latlng[0]},${country.latlng[1]}" target="_blank">Ver en Google Maps</a>
                    </div>
                </div>
            `;
            cardContainer.appendChild(card);
        });
    }
});
