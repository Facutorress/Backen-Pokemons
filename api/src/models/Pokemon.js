const { DataTypes } = require('sequelize');
const { v4: UUIDV4 } = require('uuid');


module.exports = (sequelize) => {
  sequelize.define('pokemon', {
    id:{
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,},
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }, 
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { 
        isUrl: true
      } 
    },
    hp: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    attack: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    defense: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
   speed: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },{
    timestamps: false, 
  });
  }
