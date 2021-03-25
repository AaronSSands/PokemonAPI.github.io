const pokemonTypesBaseURL = "https://pokeapi.co/api/v2/type/";
const pokemonBaseURL = "https://pokeapi.co/api/v2/pokemon/";


const pokemonListView = document.getElementById("pokemon"); 
const pokemonDataView = document.getElementById("pokemon-data");
pokemonDataView.style.display = "none";
pokemonListView.parentElement.style.display = "none"; 
let currentlyActiveTypeLink; 
let currentlyActivePokemonLink;


function PokemonTypes(url) {
    fetch(url) 
        .then(checkForOkResponse)
        .then(displayPokemonTypesList)
        .catch(console.error)
}

function PokemonType(url) {
    fetch(url)
        .then(checkForOkResponse)
        .then(displayPokemonList)
        .catch(console.error)
}

function Pokemon(url) {
    fetch(url)
        .then(checkForOkResponse)
        .then(displayPokemonData)
        .catch(console.error)
}


function checkForOkResponse(response) { 
    if (!response.ok) { 
        return Promise.reject(response.status); 
    }
    return response.json(); 
}

function displayPokemonTypesList(typesList) { 
    const pokemonTypesListView = document.getElementById("type")
    let pokemonTypes = typesList.results; 
    createListLinks(pokemonTypes, pokemonTypesListView, typeListLinkClicked); 
}

function displayPokemonList(pokemonData) { 
    pokemonListView.parentElement.style.display = "block";

    let pokemonArray = pokemonData.pokemon;
    let pokemon = [];

    if (pokemonArray != 0) {
        pokemonArray.forEach((obj) => {
            pokemon.push(obj.pokemon);
        })
    } else {
        pokemonListView.parentElement.style.display = "none"; 
    }
    
    while(pokemonListView.firstChild) { 
        pokemonListView.removeChild(pokemonListView.firstChild); 
    }
    createListLinks(pokemon, pokemonListView, pokemonListLinkClicked);
    
}

function displayPokemonData(pokemon) {
    pokemonDataView.style.display = "block";
    const name = pokemon.name
    const types = pokemon.types
    const stats = pokemon.stats;
    const abilities = pokemon.abilities;
    const moves = pokemon.moves;
    const image = pokemon.sprites.other["official-artwork"]["front_default"]
    const pokemonNameElement = document.getElementById("pokemon-name");
    const pokemonImageElement = document.getElementById("pokemon-image");

    pokemonImageElement.src = image;
    pokemonNameElement.innerText = name.replaceAll("-", " ");
    pokemonNameElement.style.textTransform = "capitalize"
    
    displayStats(stats);
    displayTypes(types);
    displayAbilities(abilities);
    displayMoves(moves);
}

function displayMoves(pokeMoves) {
    const movesElement = document.getElementById("moves");
    while(movesElement.firstChild) {
        movesElement.removeChild(movesElement.firstChild);
    }

    let moves = [];
    pokeMoves.forEach((move) => {
        moves.push(move.move.name.replaceAll("-", " "));
    })

    moves.forEach((move) => {
        let span = document.createElement("span");
        span.setAttribute("class", "badge bg-dark m-1");
        span.innerText = move;
        span.style.textTransform = "capitalize";
        movesElement.appendChild(span);
    })

}

function displayAbilities(pokeAbilities) {
    const abilitiesElement = document.getElementById("abilities")
    while(abilitiesElement.firstChild) { 
        abilitiesElement.removeChild(abilitiesElement.firstChild);
    }
    let abilities = [];
    pokeAbilities.forEach((ability) => {
        abilities.push(ability.ability.name.replaceAll("-", " "))
    })
    
    abilities.forEach((ability) => {
        let span = document.createElement("span");
        span.setAttribute("class", "badge bg-warning text-dark m-1");
        span.innerText = ability;
        span.style.textTransform = "capitalize";
        abilitiesElement.appendChild(span);
    })
}

function displayTypes(pokeTypes) {
    const pokemonTypeElement = document.getElementById("pokemon");
    let types = [];
    pokeTypes.forEach((type) => {
        types.push(type.type.name);
    })   
    if (types.length !== 1) {
        pokemonTypeElement.innerText = types.join(", ");
        pokemonTypeElement.style.textTransform = "capitalize"
    } else {
        pokemonTypeElement.innerText = types[0];
        pokemonTypeElement.style.textTransform = "capitalize"
    }
}

function displayStats(pokeStats) {
    const hpElement = document.getElementById("hp-stat");
    const attackElement = document.getElementById("attack-stat");
    const defenseElement = document.getElementById("defense-stat");
    const specialAttackElement = document.getElementById("special-attack-stat");
    const specialDefenseElement = document.getElementById("special-defense-stat");
    const speedElement = document.getElementById("speed-stat");
    
   
    let stats = [];
    pokeStats.forEach(stat => {
        stats.push({
            name: stat.stat.name,
            base_stat: stat.base_stat,
            effort: stat.effort,
            url: stat.stat.url
        })
    })
    
    stats.forEach((stat) => {
        switch (stat.name) {
            case "hp":
                hpElement.innerText = `HP: ${stat.base_stat}`;
                break;
            case "attack":
                attackElement.innerText = `ATK: ${stat.base_stat}`;
                break;
            case "defense":
                defenseElement.innerText = `DEF: ${stat.base_stat}`;
                break;
            case "special-attack":
                specialAttackElement.innerText = `SPL-ATK: ${stat.base_stat}`;
                break;
            case "special-defense":
                specialDefenseElement.innerText = `SPL-DEF: ${stat.base_stat}`;
                break;
            case "speed":
                speedElement.innerText = `SPD: ${stat.base_stat}`;
            default:
                break;
        }
    })
}

function createListLinks(list, parentElement, clickEventHandler) {
    list.forEach((item) => {
        let a = document.createElement("a");
        a.setAttribute("class", "list-group-item list-group-item-action")
        a.setAttribute("name", item.name);
        a.innerText = item.name.replaceAll("-", " ");
        a.style.textTransform = "capitalize";
        parentElement.appendChild(a)

        if (clickEventHandler) { 
            a.addEventListener("click", clickEventHandler);
        }
    })
}

function typeListLinkClicked(event) {
    let queryURL;
    let newlyClickedLink = event.target;
    
    if (currentlyActiveTypeLink === undefined) {
        newlyClickedLink.setAttribute("class", "list-group-item list-group-item-action active"); 
        currentlyActiveTypeLink = newlyClickedLink; 
        queryURL = pokemonTypesBaseURL + newlyClickedLink.name; 
    } else if (currentlyActiveTypeLink !== newlyClickedLink) { 
        newlyClickedLink.setAttribute("class", "list-group-item list-group-item-action active"); 
        currentlyActiveTypeLink.setAttribute("class", "list-group-item list-group-item-action"); 
        currentlyActiveTypeLink = newlyClickedLink;
        queryURL = pokemonTypesBaseURL + newlyClickedLink.name;  
    } else {
        queryURL = pokemonTypesBaseURL + newlyClickedLink.name; 
    } 
    
    
    PokemonType(queryURL);
    window.scrollTo({
        top:0,
        left: 0,
        behavior: "smooth"
    })
}

function pokemonListLinkClicked(event) {
    
    let queryURL; 
    let newlyClickedLink = event.target; 
    if (currentlyActivePokemonLink === undefined) {
        newlyClickedLink.setAttribute("class", "list-group-item list-group-item-action active"); 
        currentlyActivePokemonLink = newlyClickedLink; 
        queryURL = pokemonBaseURL + newlyClickedLink.name; 
    } else if (currentlyActivePokemonLink !== newlyClickedLink) {
        newlyClickedLink.setAttribute("class", "list-group-item list-group-item-actionr active"); 
        currentlyActivePokemonLink.setAttribute("class", "list-group-item list-group-item-action"); 
        currentlyActivePokemonLink = newlyClickedLink; 
        queryURL = pokemonBaseURL + event.target.name;
    } else {
        queryURL = pokemonBaseURL + newlyClickedLink.name; 
    } 
    Pokemon(queryURL)
    window.scrollTo({
        top:0,
        left: 0,
        behavior: "smooth"
    })
}



PokemonTypes(pokemonTypesBaseURL);