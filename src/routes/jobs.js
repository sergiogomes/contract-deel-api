const express = require('express')

const {getProfile} = require('../middleware/getProfile')
const {getUnpaidJobs, payForTheJob} = require('../controllers/jobs')
const {tryit} = require('../helpers/tryit')

const router = express.Router()

/**
* @url /jobs/unpaid
* @returns unpaid jobs
*/
router.get('/unpaid', getProfile, async (req, res) => {
  const args = {profile: req.profile.dataValues}
  const [error, jobs] = await tryit(getUnpaidJobs(req.app.get('models'), args))

  if (error) res.status(404).end(error.stack)
  
  res.json(jobs)
})

/**
* @url /jobs/:job_id/pay
* @description pay for a job
*/
router.post('/:job_id/pay', getProfile, async (req, res) => {
  const args = {profile: req.profile.dataValues}
  const [error, jobs] = await tryit(payForTheJob(req.app.get('models'), req.params['job_id'], args))

  if (error) res.status(404).end(error.stack)

  res.json('The job was paid successfully')  
})

module.exports = router
