//Stores pokemons
let pokemonRepository = (function () {
    let pokemonList = [];

    function getAll() {
        return pokemonList;
    }

    function add(item) {
        if (typeof item != "object") { return console.warn("Only objects may be added to list") }
        if (!Object.keys(item).includes("name")) { return console.warn("Pokemon must have a name") }
        if (!Object.keys(item).includes("height")) { return console.warn("Pokemon must have a height") }
        if (!Object.keys(item).includes("types")) { return console.warn("Pokemon must have types") }
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
        console.log(pokemon);
    }

    function find(name) {
        return pokemonList.filter((pokemon) => pokemon.name === name);
    }

    return {
        getAll,
        add,
        addListItem,
        find
    }
})();

//Adding new pokemons to repository
pokemonRepository.add({ name: 'Bulbasaur', height: 0.7, types: ['grass', 'poison'] });
pokemonRepository.add({ name: 'Charmander', height: 0.6, types: ['fire'] });
pokemonRepository.add({ name: 'Squirtle', height: 0.5, types: ['water'] });
pokemonRepository.add({ name: 'Caterpie', height: 0.3, types: ['bug'] });
pokemonRepository.add({ name: 'Weedle', height: 0.3, types: ['bug', 'poison'] });

//Displays pokemon information on the page
pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
})