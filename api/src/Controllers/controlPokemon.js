const axios = require ("axios")
const { Pokemon, Type } = require('../db');
const { Sequelize, Op } = require('sequelize');


const createPokemon = async (pokemon) => {
  const { name, image, hp, attack, defense, speed, height, weight, types } = pokemon;
   
  if (!name || !image || !hp || !attack || !defense || !speed || !height || !weight || !types) {
    throw new Error("Faltan datos");
  } 
    
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/; 
  if (!urlRegex.test(image)) {
    throw new Error("Debes insertar una URL válida en la propiedad Image");
  }

  if (!Array.isArray(types)) {
    throw new Error("La propiedad Types debe ser un array");
  } 
  
  const newPokemon = await Pokemon.create({
    name, image, hp, attack, defense, speed, height, weight,created: true
  }); 
  
  for (const typeName of types) {
    const type = await Type.findOne({ where: { name: typeName } });
    if (type) {
      await newPokemon.addType(type);
    }
  }
  return newPokemon; 
};
const getPokemons = async () => {
  const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=150`);
  const pokemonRequests = response.data.results.map((pok) => axios.get(pok.url));
  const pokemonResponses = await Promise.all(pokemonRequests);
  const pokemonsFromApi = pokemonResponses.map((res) => {
    const {id, name, sprites, types, weight, stats, height} = res.data;
    return {
      id,  
      name,
      image: sprites.other.home.front_default,
      type: types.map((t) => t.type.name),
      hp: stats[0].base_stat,
      attack: stats[1].base_stat,
      defense: stats[2].base_stat,
      speed: stats[5].base_stat,
      weight,
      height,
      created: false
    }; 
  });  
  const pokemonsFromDb = await Pokemon.findAll({
    include: { model: Type, attributes: ["name"] },
  });

  const transformedPokemonsFromDb = pokemonsFromDb.map((pokemon) => ({
    id: pokemon.id,
    name: pokemon.name,
    image: pokemon.image,
    type: pokemon.types.map((t) => t.name),
    hp: pokemon.hp,
    attack: pokemon.attack,
    defense: pokemon.defense,
    speed: pokemon.speed,
    weight: pokemon.weight,
    height: pokemon.height, 
    created: pokemon.created 
  }));

  const allPokemons = [...pokemonsFromApi, ...transformedPokemonsFromDb];

  return allPokemons;
};

const getPokemonByName = async (name) => {
  let pokemonsFromDb = [];

  const pokemons = await Pokemon.findAll({
    where: { name: { [Op.iLike]: `%${name}%` } },
    include: Type,
  });

  console.log("Pokemons encontrados:", pokemons);

  if (pokemons.length !== 0) {
    pokemonsFromDb = pokemons.map((pokemon) => {
      const typess = pokemon.types.map((t) => t.name);
      console.log("Tipos de este Pokemon:", typess);
      return {
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.image,
        type: typess,
        attack: pokemon.attack,
        defense: pokemon.defense,
        speed: pokemon.speed,
        weight: pokemon.weight,
        height: pokemon.height,
        created: pokemon.created,
      };
    });
  }

  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const { id, sprites, types, weight, stats, height } = response.data;
    const pokemonApi = {
      id,
      name,
      image: sprites.other.home.front_default,
      type: types.map((t) => t.type.name),
      hp: stats[0].base_stat,
      attack: stats[1].base_stat,
      defense: stats[2].base_stat,
      speed: stats[5].base_stat,
      weight,
      height,
      created: false,
    };

    const allResults = [pokemonApi, ...pokemonsFromDb];
    return allResults;
  } catch (error) {
    console.error("Error al obtener datos de la API de Pokemon:", error.message);
    return pokemonsFromDb;
  }
};

 
const getPokemonById = async (id) => {
  const  response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
  const { name, sprites, types, weight, stats, height } = response.data;
  console.log(types)
  return {
    id,
    name,
    image: sprites.other.home.front_default,
    type: types.map((t) => t.type.name),
    hp: stats[0].base_stat,
    attack: stats[1].base_stat,
    defense: stats[2].base_stat,
    speed: stats[5].base_stat,
    weight,
    height,
    created: false,
  };
}

const getPokemonByPk = async (id) => {
  const encontrado = await Pokemon.findByPk(id, { include: Type });

  if (!encontrado) {
    throw new Error("El pokemon que buscas no está en la base de datos");
  }

  const types = encontrado.get('types') || [];

  // Transforma el objeto encontrado en un objeto con la estructura correcta
  const pokemonWithTypes = {
    id: encontrado.id,
    name: encontrado.name,
    image: encontrado.image,
    hp: encontrado.hp,
    attack: encontrado.attack,
    defense: encontrado.defense,
    speed: encontrado.speed,
    weight: encontrado.weight, 
    height: encontrado.height,
    created: encontrado.created,
    type: types.map((t) => t.get('name'))
  };

  return pokemonWithTypes;
};



       

module.exports= {getPokemonById,getPokemonByName,createPokemon,getPokemonByPk,getPokemons};