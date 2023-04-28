const {Router} = require("express")
const routePokemons = Router()
const {getPokemonHandler,getPokemonByNameHandler,createPokemonHandler,getPokemonsHandler} = require ("../Handlers/pokemonHandlers")

routePokemons.get("/byname", getPokemonByNameHandler)
routePokemons.get("", getPokemonsHandler)
routePokemons.get("/:id", getPokemonHandler)
routePokemons.post("", createPokemonHandler)


 
module.exports= routePokemons; 