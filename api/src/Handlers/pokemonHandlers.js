const {getPokemonById,getPokemonByName,createPokemon,getPokemons,getPokemonByPk} = require("../Controllers/controlPokemon")

const getPokemonHandler= async(req,res)=>{
  const {id}= req.params
  const result = isNaN(id) ?  await getPokemonByPk(id) : await getPokemonById(id)
  try {
      res.status(200).json(result)}
    
   catch (error) {
    res.status(500).json({ message: "mal" });
  } 
}
const getPokemonsHandler= async(req,res)=>{
  try { const result= await getPokemons()
      res.status(200).json(result)}
    
   catch (error) {
    res.status(500).json({ message: "mal" });
  } 
}
 
const getPokemonByNameHandler = async (req, res) => { 
  try {
    const {name} = req.query; 
    if (name) {
      const results = await getPokemonByName(name);
      res.status(200).json(results);
    }
  } catch (error) {
    res.status(500).json({ message:error.message});
  }
}


const createPokemonHandler = async (req, res) => {
    try {
      const pokemon = req.body;
      createPokemon(pokemon)
      res.status(201).json({ message: `Pokemon ${pokemon.name} creado exitosamente` });
      }
     catch (error) { 
      res.status(400).json({ message: error.message });
    }
  };
  
 
module.exports={ getPokemonHandler, getPokemonByNameHandler,createPokemonHandler,getPokemonsHandler }