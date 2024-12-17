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

    function find(name) {
        return pokemonList.filter((pokemon) => pokemon.name === name);
    }

    return {
        getAll,
        add,
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
    if (pokemonRepository.getAll().indexOf(pokemon) === 0) {
        document.write(`<h1>Pokemons:</h1>`);
        document.write(`<ul>`);
    }

    document.write(`<li>${pokemon.name} (height: ${pokemon.height})`)
    if (pokemon.height >= 0.7) {
        document.write(`<em> - Wow, that's big!</em>`)
    }
    document.write(`</li>`);

    if (pokemonRepository.getAll().indexOf(pokemon) === pokemonRepository.getAll().length) { document.write(`</ul>`) }
})