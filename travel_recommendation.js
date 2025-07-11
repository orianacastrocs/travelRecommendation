document.addEventListener('DOMContentLoaded', () => {
    let travelData = null;

    // 1. Cargar datos del JSON
    fetch('./travel_recommendation_api.json')
        .then(response => {
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            return response.json();
        })
        .then(data => {
            travelData = data;
        })
        .catch(error => console.error("Error al cargar JSON:", error));

    const searchButton = document.getElementById('btnSearch');
    const input = document.getElementById('conditionInput');
    const main = document.getElementById('main');

    // 2. Buscar cuando se hace clic
    searchButton.addEventListener('click', () => {
        const keyword = input.value.trim().toLowerCase();
        main.innerHTML = ''; // Limpiar resultados anteriores

        if (!keyword) return;

        let results = [];

        // 3. Filtrar según palabra clave
        if (keyword.includes('beach') || keyword.includes('playa')) {
            results = travelData.beaches;
        } else if (keyword.includes('templo') || keyword.includes('temple')) {
            results = travelData.temples;
        } else {
            // Buscar por país o ciudad
            travelData.countries.forEach(country => {
                if (country.name.toLowerCase().includes(keyword)) {
                    results = results.concat(country.cities);
                } else {
                    const cities = country.cities.filter(city =>
                        city.name.toLowerCase().includes(keyword)
                    );
                    results = results.concat(cities);
                }
            });
        }

        // 4. Mostrar recomendaciones (mínimo 2 si hay)
        if (results.length === 0) {
            main.innerHTML = `<p>No results found for: <strong>${keyword}</strong></p>`;
        } else {
            const limitedResults = results.slice(0, 2); // solo 2 si hay más
            displayRecommendations(limitedResults);
        }
    });

    // 5. Mostrar resultados en pantalla
    function displayRecommendations(recommendations) {
        recommendations.forEach(place => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${place.name}</h3>
                <img src="${place.imageUrl}" alt="${place.name}" width="300">
                <p>${place.description}</p>
                <button class="visit-btn">Visit</button>
            `;
            main.appendChild(card);
        });
    }
});

const clearButton = document.getElementById('btnClear');

clearButton.addEventListener('click', () => {
    input.value = '';        // Limpiar input
    main.innerHTML = '';     // Borrar resultados
});
