//Stores pokemons
let pokemonRepository = (function () {
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=50';

    function getAll() {
        return pokemonList;
    }

    //Adds pokemon to repo
    function add(item) {
        if (typeof item != "object") { return console.warn("Only objects may be added to list") }
        if (!Object.keys(item).includes("name")) { return console.warn("Pokemon must have a name") }
        pokemonList.push(item);
    }

    //Creates buttons on the page for each pokemon in repo
    function addListItem(pokemon) {
        let pokemonList = document.querySelector('.pokemon-list');
        let pokemonButton = document.createElement("button");
        pokemonButton.innerText = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        pokemonButton.classList.add("pokemon-button");
        pokemonButton.addEventListener('click', () => showDetails(pokemon));
        pokemonList.appendChild(pokemonButton);
    }

    //Brings up modal
    function showDetails(pokemon) {
        showModal(pokemon);
    }

    function find(name) {
        return pokemonList.filter((pokemon) => pokemon.name === name);
    }

    //Fetches list of pokemons from API
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

    //Fetches pokemon's details from API
    function loadDetails(item) {
        let url = item.detailsUrl;
        showLoadingMessage();

        return fetch(url).then(function (response) {
            return response.json();
        }).then(function (details) {
            hideLoadingMessage();
            item.imageUrl = details.sprites.other["official-artwork"].front_default;
            item.height = details.height;
            item.types = details.types;
            item.weight = details.weight;
            item.abilities = details.abilities;
        }).catch(function (error) {
            hideLoadingMessage();
            console.error(error);
        });
    }

    //Displays loading msg while API is fetching data
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

    //Brings up details modal about clicked pokemon
    function showModal(pokemon) {
        let modalContainer = document.querySelector('.modal-container');
        modalContainer.innerHTML = '';
        let modal = document.createElement('div');
        modal.classList.add('modal');
        modalContainer.appendChild(modal);

        let topDiv = document.createElement('div');
        topDiv.classList.add('modal-top');
        let imageDiv = document.createElement('div');
        imageDiv.classList.add('modal-image');
        let detailsDiv = document.createElement('div');
        detailsDiv.classList.add('modal-details');
        modal.appendChild(topDiv);
        modal.appendChild(imageDiv);
        modal.appendChild(detailsDiv);

        let closeButton = document.createElement('button');
        closeButton.classList.add('modal-close-button');
        closeButton.innerText = 'X';
        closeButton.addEventListener('click', hideModal)
        topDiv.appendChild(closeButton);

        //Renders info in modal based on API data
        loadDetails(pokemon).then(function () {
            console.log(pokemon);

            let image = document.createElement('img');
            image.src = pokemon.imageUrl;
            image.classList.add('pokemon-image')
            imageDiv.appendChild(image);

            let name = document.createElement('h1');
            name.innerText = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
            detailsDiv.appendChild(name);

            pokemon.types.forEach(element => {
                let typeSpan = document.createElement('div');
                typeSpan.classList.add('type-span');
                typeSpan.classList.add(`${element.type.name}`);
                typeSpan.innerText = element.type.name.toUpperCase();
                detailsDiv.appendChild(typeSpan);
            });

            let detailsProfile = document.createElement('div');
            detailsProfile.classList.add('details-profile');
            detailsDiv.appendChild(detailsProfile);

            let height = document.createElement('p');
            height.innerText = `Height: ${pokemon.height}`;
            detailsProfile.appendChild(height);

            let weight = document.createElement('p');
            weight.innerText = `Weight: ${pokemon.weight}`;
            detailsProfile.appendChild(weight);

            let abilitiesList = '';
            let abilities = document.createElement('p');

            pokemon.abilities.forEach(element => {
                abilitiesList += element.ability.name.charAt(0).toUpperCase() + element.ability.name.slice(1);
                if (pokemon.abilities.indexOf(element) != pokemon.abilities.length - 1) {
                    abilitiesList += ', ';
                }
                abilities.innerText = `Abilities: ${abilitiesList}`;
                detailsProfile.appendChild(abilities);
            });
        });

        modalContainer.classList.add('is-visible');
        
        //Hides modal when clicking outside the modal
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                hideModal();
            }
        })

        //Hides modal when pressing ESC
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
                hideModal();
            }
        })

        //Prevents scrolling of the main page
        document.body.style.overflow = 'hidden';
    }

    function hideModal() {
        let modalContainer = document.querySelector('.modal-container');
        modalContainer.classList.remove('is-visible');
        document.body.style.overflow = 'visible';
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
