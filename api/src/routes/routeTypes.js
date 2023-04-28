const {Router} = require("express")
const routeTypes = Router()
const {getTypeHandler} = require("../Handlers/typesHandlers")

routeTypes.get("/types", getTypeHandler)


module.exports= routeTypes  