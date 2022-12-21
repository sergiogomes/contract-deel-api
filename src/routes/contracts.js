const express = require('express')
const { Op } = require('sequelize')

const {getProfile} = require('../middleware/getProfile')
const {extractProfileQuery} = require('../helpers/extractProfileQuery')

const router = express.Router()

/**
* @returns contract by id
*/
router.get('/:id', getProfile, async (req, res) => {
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
router.get('/', getProfile, async (req, res) => {
  const {Contract} = req.app.get('models')
  const query = extractProfileQuery(req.profile.dataValues)
  query.status = {[Op.ne]: 'terminated'}
  
  const contracts = await Contract.findAll({where: query})
  if(!contracts) return res.status(404).end()
  res.json(contracts)
})

module.exports = router
