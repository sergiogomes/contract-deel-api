const express = require('express')
const { Op } = require('sequelize')

const {getProfile} = require('../middleware/getProfile')
const {extractProfileQuery} = require('../helpers/extractProfileQuery')

const router = express.Router()

/**
* @returns unpaid jobs
*/
router.get('/unpaid', getProfile, async (req, res) => {
  const {Job, Contract} = req.app.get('models')
  const contractQuery = extractProfileQuery(req.profile.dataValues)
  const contractInstance = [{
    model: Contract,
    where: contractQuery
  }]
  const jobQuery = {paid: {[Op.not]: true}}
  
  const jobs = await Job.findAll({where: jobQuery, include: contractInstance})
  if(!jobs) return res.status(404).end()
  res.json(jobs)
})

module.exports = router
