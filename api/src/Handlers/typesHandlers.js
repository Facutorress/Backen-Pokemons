const {getPokemonType} = require("../Controllers/typeControl")

const getTypeHandler= async (req,res)=>{
  try {
    const types=  await getPokemonType();
    res.status(200).json(types);
  } catch (error) {
    res.status(500).json({ message: "mal" });
  }
};



module.exports = {getTypeHandler};