let pokemonList = [];

pokemonList.push({ name: 'Bulbasaur', height: 0.7, type: ['grass', 'poison'] });
pokemonList.push({ name: 'Charmander', height: 0.6, type: ['fire'] });
pokemonList.push({ name: 'Squirtle', height: 0.5, type: ['water'] });
pokemonList.push({ name: 'Caterpie', height: 0.3, type: ['bug'] });
pokemonList.push({ name: 'Weedle', height: 0.3, type: ['bug', 'poison'] });

//Displays pokemon information on the page
for (i = 0; i < pokemonList.length; i++) {
    if (i === 0) { document.write(`<h1>Pokemons:</h1>`) }
    document.write(`<p>${pokemonList[i].name} (height: ${pokemonList[i].height})`)
    if (pokemonList[i].height >= 0.7) {
        document.write(`<em> - Wow, that's big!</em>`)
    }
    document.write(`</p>`);
}