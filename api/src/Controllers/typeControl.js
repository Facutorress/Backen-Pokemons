const axios = require ("axios")
const {Type} = require("../db")

const getPokemonType =async ()=>
{ const BD = await Type.findAll()
  if (BD.length===0){
   const datos= await axios.get("https://pokeapi.co/api/v2/type")
   const tipos = datos.data.results.map((tipo) => {
    return {name: tipo.name}
  });
   const NewTipos= await Type.bulkCreate(tipos);
  return(NewTipos)
}
return BD
}; 

  

  module.exports={getPokemonType}