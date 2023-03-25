const cheerio = require('cheerio');
const fetch = require('node-superfetch');

const pokedex = require('./pokedex.json');
const base_url = 'https://pokemondb.net/pokedex';

async function fetch_all_pokemon() {
	try {
		const all_pokemon_url = `${base_url}/all`;

		const { body } = await fetch.get(all_pokemon_url);
		const $ = cheerio.load(body);

		let total_pokemon = $('span.infocard-cell-data').eq(-1).text();
		total_pokemon = parseInt(total_pokemon);
		
		const national_numbers_added = pokedex.map(pokedex.national_number);
		let pokemon_numbers_array = Array.from({ length: total_pokemon }, (_, i) => i + 1);

		const to_add = pokemon_numbers_array.filter(number => !national_numbers_added.includes(number));
		console.log(national_numbers_added, pokemon_numbers_array, to_add);

	} catch (err) {
		console.log(err);
	}
}

fetch_all_pokemon();