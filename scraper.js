const fetch = require('node-superfetch');
const pokedex = require('./pokedex.json');

const fs = require('fs');

const API_LINK = 'https://pokeapi.co/api/v2/pokemon';

async function update_pokedex() {
	try {
		const { body } = await fetch.get(API_LINK);
		const to_add = await pokemon_to_add(body.count);

		const fetched_poke_data = await fetch_pokemon_data(to_add);

	} catch (err) {
		console.log(err);
	}
}

async function pokemon_to_add(total_pokemon) {
	const list_of_pokemon_in_dex = pokedex.map(pokemon => pokemon.national_number);
	let to_add = Array.from({ length: total_pokemon }, (_, i) => i + 1);

	return to_add.filter(number => !list_of_pokemon_in_dex.includes(number));
}

async function fetch_pokemon_data(pokemon_to_fetch) {
	for (i = 0; i < 1; i++) {
		const { body } = await fetch.get(`${API_LINK}/${pokemon_to_fetch[i]}`);
		console.log(body.sprites);
		const parsed_pokedata = parse_pokedata(body);
		pokedex.push(parsed_pokedata);
	}

	fs.writeFileSync('./pokedex.json', JSON.stringify(pokedex, null, 2), { encoding: 'utf8', flag: 'w', spaces: 2 });
}

function parse_pokedata(pokedata) {
	return {
		name: pokedata.name,
		national_number: pokedata.id,
		type: pokedata.types.map(types => types.type.name),
		species: null,
		height: pokedata.height,
		weight: pokedata.weight,
		abilities: pokedata.abilities.map(poke => poke.ability.name),
		evolutions: null,
		sprites: pokedata.sprites
	}
}

update_pokedex();