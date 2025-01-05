let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";
  let searchInput = document.querySelector('input[type="search"');

  searchInput.addEventListener("keyup", (e) => {
    searchPokemons(e.target.value);
  });

  function getAll() {
    return pokemonList;
  }

  //Adds pokemon to repo
  function add(item) {
    if (typeof item != "object") {
      return console.warn("Only objects may be added to list");
    }
    if (!Object.keys(item).includes("name")) {
      return console.warn("Pokemon must have a name");
    }
    pokemonList.push(item);
  }

  //Creates buttons on the page for each pokemon in repo
  function addListItem(pokemon) {
    let pokemonList = document.querySelector(".pokemon-list > div");
    let pokemonButton = document.createElement("button");

    pokemonButton.innerText =
      pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    pokemonButton.classList.add("btn");
    pokemonButton.classList.add("list-group-item");
    pokemonButton.classList.add("pokemon-button");
    pokemonButton.setAttribute("data-bs-toggle", "modal");
    pokemonButton.setAttribute("data-bs-target", "#pokemonModal");
    pokemonButton.setAttribute("role", "listitem");
    pokemonList.appendChild(pokemonButton);

    pokemonButton.addEventListener("click", () => {
      showDetails(pokemon);
    });
  }

  //Brings up modal
  function showDetails(pokemon) {
    renderModalContent(pokemon);
  }

  function find(name) {
    return pokemonList.filter((pokemon) => pokemon.name === name);
  }

  //Fetches list of pokemons from API
  function loadList() {
    showLoadingMessage();
    return fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        hideLoadingMessage();
        let index = 1;
        json.results.forEach(function (item) {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          add(pokemon);
          index++;
        });
      })
      .catch(function (error) {
        hideLoadingMessage();
        console.error(error);
      });
  }

  //Fetches pokemon's details from API
  function loadDetails(item) {
    let url = item.detailsUrl;
    showLoadingMessage();

    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        hideLoadingMessage();
        item.imageUrl = details.sprites.other["official-artwork"].front_default;
        item.height = details.height;
        item.types = details.types;
        item.weight = details.weight;
        item.abilities = details.abilities;
        item.speciesUrl = details.species.url;
      })
      .catch(function (error) {
        hideLoadingMessage();
        console.error(error);
      });
  }

  //Fetches pokemon's species details from API
  function loadSpecies(item) {
    let url = item.speciesUrl;

    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (species) {
        item.evoUrl = species.evolution_chain.url;
        item.flavorText = getEnFlavorText(species.flavor_text_entries);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  //Fetches pokemon's english language flavor text from API
  function getEnFlavorText(data) {
    let text = null;
    let i = 0;
    while (text === null) {
      if (data[i].language.name === "en") {
        text = data[i].flavor_text;
      }
      i++;
    }
    return text;
  }

  //Fetches pokemon's evolutions from API
  function loadEvolutions(item) {
    let url = item.evoUrl;

    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        item.evolutions = getEvolutions([data.chain]);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  function getEvolutions(array, evos = []) {
    evos.push(array[0].species.name);
    if (array[0].evolves_to.length > 0) getEvolutions(array[0].evolves_to, evos);
    return evos;
  }

  //Displays loading msg while API is fetching data
  function showLoadingMessage() {
    let pokemonList = document.querySelector(".pokemon-list");
    let message = document.createElement("p");
    message.classList.add("loading-message");
    message.innerText = "Retrieving Pokemon data...";
    pokemonList.appendChild(message);
  }

  function hideLoadingMessage() {
    let message = document.querySelector(".loading-message");
    message.remove();
  }

  //Brings up details modal about clicked pokemon
  function renderModalContent(pokemon) {
    //let header = document.querySelector(".modal-header");
    let prevSpan = document.querySelector(".prevButton");
    let nextSpan = document.querySelector(".nextButton");

    if (pokemonList[pokemonList.indexOf(pokemon) + 1]) {
      let nextButton = document.createElement("button");
      nextButton.textContent = "\u276F";
      nextButton.classList.add("pokemon-next");
      nextButton.addEventListener("click", () => {
        switchModal(pokemon, 1);
      });
      nextSpan.appendChild(nextButton);
    }

    if (pokemonList[pokemonList.indexOf(pokemon) - 1]) {
      let prevButton = document.createElement("button");
      prevButton.textContent = "\u276E";
      prevButton.classList.add("pokemon-prev");
      prevButton.addEventListener("click", () => {
        switchModal(pokemon, 0);
      });
      prevSpan.appendChild(prevButton);
    }

    let pokemonDetails = document.querySelector(".modal-body");
    let modal = document.querySelector(".modal");
    modal.addEventListener("hidden.bs.modal", clearModal);

    //Renders info in modal based on API data
    loadDetails(pokemon).then(function () {
      //Renders pokemon image
      let image = document.querySelector(".pokemon-image");
      image.src = pokemon.imageUrl;

      //Renders pokemon name
      let name = document.querySelector(".modal-title");
      name.innerText =
        "#" +
        (pokemonList.indexOf(pokemon) + 1).toString() +
        " " +
        pokemon.name.charAt(0).toUpperCase() +
        pokemon.name.slice(1);

      //Creates container for type indicators
      let typeContainer = document.createElement("div");
      typeContainer.classList.add("row");
      typeContainer.classList.add("justify-content-center");
      typeContainer.classList.add("type-container");
      pokemonDetails.appendChild(typeContainer);

      //Renders pokemon type indicators
      pokemon.types.forEach((element) => {
        let typeIndicator = document.createElement("div");
        typeIndicator.classList.add("type-span");
        typeIndicator.classList.add(`${element.type.name}`);
        typeIndicator.innerText = element.type.name.toUpperCase();
        typeContainer.appendChild(typeIndicator);
      });

      //Renders pokemon details info area
      let detailsProfile = document.createElement("div");
      detailsProfile.classList.add("details-profile");
      pokemonDetails.appendChild(detailsProfile);

      let description = document.createElement("p");
      description.classList.add("mb-2");
      description.classList.add("description");
      detailsProfile.appendChild(description);

      let heightDiv = document.createElement("div");
      let height = document.createElement("span");
      let heightText = document.createElement("span");
      height.classList.add("fw-bold");
      height.innerText = `Height: `;
      heightText.innerText = pokemon.height;
      heightDiv.appendChild(height);
      heightDiv.appendChild(heightText);
      detailsProfile.appendChild(heightDiv);

      let weightDiv = document.createElement("div");
      let weight = document.createElement("span");
      let weightText = document.createElement("span");
      weight.classList.add("fw-bold");
      weight.innerText = `Weight: `;
      weightText.innerText = pokemon.weight;
      weightDiv.appendChild(weight);
      weightDiv.appendChild(weightText);
      detailsProfile.appendChild(weightDiv);

      let abilitiesDiv = document.createElement("div");
      let abilitiesList = "";
      let abilities = document.createElement("span");
      abilities.classList.add("fw-bold");
      abilities.innerText = `Abilities: `;
      let abilitiesText = document.createElement("span");
      let abilitiesTextContent = "";

      pokemon.abilities.forEach((element) => {
        abilitiesTextContent +=
          element.ability.name.charAt(0).toUpperCase() +
          element.ability.name.slice(1);
        if (
          pokemon.abilities.indexOf(element) !=
          pokemon.abilities.length - 1
        ) {
          abilitiesTextContent += ", ";
        }

        abilitiesText.innerText = abilitiesTextContent;
        abilitiesDiv.appendChild(abilities);
        abilitiesDiv.appendChild(abilitiesText);
        detailsProfile.appendChild(abilitiesDiv);
      });

      loadSpecies(pokemon).then(function () {
        loadEvolutions(pokemon).then(function () {
          let text = pokemon.flavorText
            .replaceAll("\n", " ")
            .replaceAll("\f", " ");
          description.innerText = text;

          let evoDiv = document.createElement("div");
          let evolutions = document.createElement("span");
          evolutions.classList.add("fw-bold");
          let evoList = document.createElement("span");
          let evoListText = "";

          pokemon.evolutions.forEach((element) => {
            evoListText += element.charAt(0).toUpperCase() + element.slice(1);
            if (
              pokemon.evolutions.indexOf(element) !=
              pokemon.evolutions.length - 1
            ) {
              evoListText += " > ";
            }
          });

          evolutions.innerText = `Evolutions: `;
          evoList.innerText = evoListText;

          evoDiv.appendChild(evolutions);
          evoDiv.appendChild(evoList);
          detailsProfile.appendChild(evoDiv);
        });
      });
    });
  }

  //Clears modal of javascript-created content
  function clearModal() {
    let pokemonDetails = document.querySelector(".modal-body");
    let content = pokemonDetails.querySelectorAll("div");
    content.forEach((element) => {
      element.remove();
    });

    let nextButton = document.querySelector(".pokemon-next");
    if (nextButton) nextButton.remove();
    let prevButton = document.querySelector(".pokemon-prev");
    if (prevButton) prevButton.remove();
  }

  //Switches to next or previous pokemon
  function switchModal(currentPokemon, direction) {
    const index = pokemonList.indexOf(currentPokemon);
    const nextPokemon = pokemonList[index + 1];
    const prevPokemon = pokemonList[index - 1];

    clearModal();

    if (direction === 1) {
      renderModalContent(nextPokemon);
    } else if (direction === 0) {
      renderModalContent(prevPokemon);
    }
  }

  //Clears all buttons from page
  function clearPage() {
    let pokemonList = document.querySelectorAll(".pokemon-button");
    pokemonList.forEach((item) => {
      item.remove();
    });
  }

  //Renders pokemon buttons on page based on search input
  function searchPokemons(input) {
    clearPage();
    getAll().forEach(function (pokemon) {
      if (pokemon.name.startsWith(input)) {
        addListItem(pokemon);
      }
    });
  }

  return {
    getAll,
    add,
    addListItem,
    find,
    loadList,
    loadDetails,
    switchModal,
  };
})();

//Fetches pokemons from API and renders buttons on page
pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
