'use strict';

const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  // Define a Sequelize model
  const Usuario = sequelize.define('usuarios', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER
    },
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    nombre: {
      type: Sequelize.STRING,
      allowNull: false
    },
    edad: {
      type: Sequelize.INTEGER
    }
  });

  return Usuario;
};
