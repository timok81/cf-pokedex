let pokemonList = [];

pokemonList.push({ name: 'Bulbasaur', height: 0.7, types: ['grass', 'poison'] });
pokemonList.push({ name: 'Charmander', height: 0.6, types: ['fire'] });
pokemonList.push({ name: 'Squirtle', height: 0.5, types: ['water'] });
pokemonList.push({ name: 'Caterpie', height: 0.3, types: ['bug'] });
pokemonList.push({ name: 'Weedle', height: 0.3, types: ['bug', 'poison'] });

//Displays pokemon information on the page
pokemonList.forEach(function(pokemon) {
    if (pokemonList.indexOf(pokemon) === 0) { 
        document.write(`<h1>Pokemons:</h1>`);
        document.write(`<ul>`);        
    }

    document.write(`<li>${pokemon.name} (height: ${pokemon.height})`)
    if (pokemon.height >= 0.7) {
        document.write(`<em> - Wow, that's big!</em>`)
    }
    document.write(`</li>`);

    if (pokemonList.indexOf(pokemon) === pokemonList.length) { document.write(`</ul>`)}
})