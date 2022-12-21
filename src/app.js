const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const {getProfile} = require('./middleware/getProfile')
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

/**
* FIX ME!
* @returns contract by id
*/
app.get('/contracts/:id',getProfile ,async (req, res) =>{
  const {Contract} = req.app.get('models')
  const {id} = req.params
  const profile = req.profile.dataValues
  const query = {id}
  const {type} = profile
  
  if (type === 'client'){
    query.ClientId = profile.id
  }

  if (type === 'contractor'){
    query.ContractorId = profile.id
  }  
  
  const contract = await Contract.findOne({where: query})
  if(!contract) return res.status(404).end()
  res.json(contract)
})
module.exports = app;
