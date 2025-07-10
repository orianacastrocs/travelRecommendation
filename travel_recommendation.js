document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("btnSearch");
    const clearBtn = document.getElementById("btnClear");
    const input = document.getElementById("conditionInput");
  
    // Crear contenedor de resultados dinámicamente
    const resultsContainer = document.createElement("div");
    resultsContainer.id = "results";
    document.body.appendChild(resultsContainer);
  
    let travelData = [];
  
    // Cargar datos del archivo JSON
    fetch("travel_recommendation_api.json")
      .then(response => response.json())
      .then(data => {
        travelData = data;
        console.log("Datos cargados:", data);
      })
      .catch(error => {
        console.error("Error al cargar los datos JSON:", error);
      });
  
    // Función para mostrar resultados
    function showResults(keyword) {
      resultsContainer.innerHTML = ""; // Limpiar resultados anteriores
      let resultsFound = false;
  
      travelData.forEach(country => {
        country.cities.forEach(city => {
          const cityName = city.name.toLowerCase();
          const countryName = country.name.toLowerCase();
          const searchTerm = keyword.toLowerCase();
  
          if (cityName.includes(searchTerm) || countryName.includes(searchTerm)) {
            resultsFound = true;
            const card = document.createElement("div");
            card.className = "card";
            card.style.border = "1px solid #ccc";
            card.style.padding = "15px";
            card.style.margin = "10px";
            card.style.backgroundColor = "#f9f9f9";
  
            card.innerHTML = `
              <h3>${city.name}</h3>
              <img src="${city.imageUrl}" alt="${city.name}" style="width: 200px; height: auto;">
              <p>${city.description}</p>
            `;
            resultsContainer.appendChild(card);
          }
        });
      });
  
      if (!resultsFound) {
        resultsContainer.innerHTML = "<p>No se encontraron resultados.</p>";
      }
    }
  
    // Buscar cuando se hace clic en el botón
    searchBtn.addEventListener("click", () => {
      const keyword = input.value.trim();
      if (keyword !== "") {
        showResults(keyword);
      }
    });
  
    // Limpiar resultados
    clearBtn.addEventListener("click", () => {
      input.value = "";
      resultsContainer.innerHTML = "";
    });
  });
  