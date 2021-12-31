const { Sequelize } = require('sequelize')
const sequelize = new Sequelize(process.env.DB, { logging: false })

module.exports = sequelize
