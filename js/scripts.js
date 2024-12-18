//Stores pokemons
let pokemonRepository = (function () {
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    function getAll() {
        return pokemonList;
    }

    function add(item) {
        if (typeof item != "object") { return console.warn("Only objects may be added to list") }
        if (!Object.keys(item).includes("name")) { return console.warn("Pokemon must have a name") }
        pokemonList.push(item);
    }

    //Creates buttons for each pokemon in list
    function addListItem(pokemon) {
        let pokemonList = document.querySelector('.pokemon-list');
        let listElement = document.createElement('li');
        let pokemonButton = document.createElement("button");
        pokemonButton.innerText = pokemon.name;
        pokemonButton.classList.add("pokemon-button");
        pokemonButton.addEventListener('click', () => showDetails(pokemon));
        listElement.appendChild(pokemonButton);
        pokemonList.appendChild(listElement);
    }

    function showDetails(pokemon) {
        loadDetails(pokemon).then(function () {
            console.log(pokemon);
        });
    }

    function find(name) {
        return pokemonList.filter((pokemon) => pokemon.name === name);
    }

    function loadList() {
        showLoadingMessage();
        return fetch(apiUrl).then(function (response) {
            return response.json();
        }).then(function (json) {
            hideLoadingMessage();
            json.results.forEach(function (item) {
                let pokemon = {
                    name: item.name,
                    detailsUrl: item.url,
                    height: item.height
                };
                add(pokemon);
            })
        }).catch(function (error) {
            hideLoadingMessage();
            console.error(error);
        })
    }

    function loadDetails(item) {
        let url = item.detailsUrl;
        showLoadingMessage();

        return fetch(url).then(function (response) {
            return response.json();
        }).then(function (details) {
            hideLoadingMessage();
            item.imageUrl = details.sprites.front_default;
            item.height = details.height;
            item.types = details.types;
        }).catch(function (error) {
            hideLoadingMessage();
            console.error(error);
        });
    }

    function showLoadingMessage() {
        let pokemonList = document.querySelector('.pokemon-list');
        let message = document.createElement('p');
        message.classList.add('loading-message');
        message.innerText = 'Retrieving Pokemon data...';
        pokemonList.appendChild(message);
    }

    function hideLoadingMessage() {
        let message = document.querySelector('.loading-message');
        message.remove();
    }

    return {
        getAll,
        add,
        addListItem,
        find,
        loadList,
        loadDetails
    }
})();

//Fetches pokemons from API and renders buttons on page
pokemonRepository.loadList().then(function () {
    pokemonRepository.getAll().forEach(function (pokemon) {
        pokemonRepository.addListItem(pokemon);
    });
});
