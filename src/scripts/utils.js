const { API_LINK } = require('../../config.json');
const pokedex = require('../../data/pokedex.json');

const fs = require('fs');
const fetch = require('node-superfetch');


class Utils {
	async update_pokedex() {
		try {
			const { body } = await fetch.get(`${API_LINK}/pokemon`);
			const to_add = await this.pokemon_to_add(body.count);

			const fetched_poke_data = await this.fetch_pokemon_data(to_add);
		} catch (err) {
			console.log(err);
		}
	}

	async pokemon_to_add(total_pokemon) {
		const list_of_pokemon_in_dex = pokedex.map(pokemon => pokemon.national_number);
		let to_add = Array.from({ length: total_pokemon }, (_, i) => i + 1);

		return to_add.filter(number => !list_of_pokemon_in_dex.includes(number));
	}

	async fetch_pokemon_data(pokemon_to_fetch) {
		const promises = [];

		for (let i = 0; i < 20; i++) {
		  const promise = fetch.get(`${API_LINK}/pokemon/${pokemon_to_fetch[i]}`)
			.then(({ body }) => this.parse_pokedata(body))
			.then(parsed_pokedata => pokedex.push(parsed_pokedata))
			.catch(error => console.error(error));
	  
		  promises.push(promise);
		}
	  
		await Promise.all(promises);
	  
		return fs.writeFileSync('data/pokedex.json', JSON.stringify(pokedex, null, 2), { encoding: 'utf8', flag: 'w', spaces: 2 });
	  }

	parse_pokedata(pokedata) {
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
}

module.exports = Utils;