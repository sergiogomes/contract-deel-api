const express = require('express')
const bodyParser = require('body-parser')
const { Op } = require('sequelize')

const {sequelize} = require('./model')
const {getProfile} = require('./middleware/getProfile')
const {extractProfileQuery} = require('./helpers/extractProfileQuery')

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

/**
* @returns contract by id
*/
app.get('/contracts/:id', getProfile, async (req, res) => {
  const {Contract} = req.app.get('models')
  const query = extractProfileQuery(req.profile.dataValues)
  query.id = req.params.id
  
  const contract = await Contract.findOne({where: query})
  if(!contract) return res.status(404).end()
  res.json(contract)
})

/**
* @returns non terminated contracts
*/
app.get('/contracts', getProfile, async (req, res) => {
  const {Contract} = req.app.get('models')
  const query = extractProfileQuery(req.profile.dataValues)
  query.status = {[Op.ne]: 'terminated'}
  
  const contract = await Contract.findAll({where: query})
  if(!contract) return res.status(404).end()
  res.json(contract)
})

module.exports = app;
