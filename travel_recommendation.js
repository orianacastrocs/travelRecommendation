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
    const main = document.querySelector('main');
    const clearButton = document.getElementById('btnClear');
    const originalMainContent = main.innerHTML;

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
                <p style="text-align:left;">${place.description}</p>
            `;
            main.appendChild(card);
        });
    }
    
    clearButton.addEventListener('click', () => {
    input.value = '';
    main.innerHTML = originalMainContent;
    });
});

//Nueva función para "Some of the places you can explore..."

fetch('./travel_recommendation_api.json')
  .then(response => response.json())
  .then(data => {
    const allCities = [];

    // extraer solo las ciudades del json cargado
    data.countries.forEach(country => {
      country.cities.forEach(city => {
        allCities.push(city);
      });
    });

    // ahora podés mostrar ciudades como antes:
    let currentIndex = 0;

    function displayCity(city) {
      const container = document.getElementById("ciudad-container");
      container.className = "places";
      container.innerHTML = `
        <h3>${city.name}</h3>
        <img src="${city.imageUrl}" alt="${city.name}" width="300">
        <p style="text-align:left;">${city.description}</p>
      `;
    }

    function showNextCity() {
      displayCity(allCities[currentIndex]);
      currentIndex = (currentIndex + 1) % allCities.length;
    }

    showNextCity(); // mostrar la primera
    setInterval(showNextCity, 7000); // cada 7 segundos
  })
  .catch(error => {
    console.error('Error al cargar el JSON:', error);
  });