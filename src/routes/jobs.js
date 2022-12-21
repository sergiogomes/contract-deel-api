const express = require('express')
const { Op } = require('sequelize')

const {getProfile} = require('../middleware/getProfile')
const {findOneJobById, findAllJobs, editOneJobById} = require('../services/jobs')
const {findOneProfileById, editOneProfileById} = require('../services/profiles')

const router = express.Router()

/**
* @url /jobs/unpaid
* @returns unpaid jobs
*/
router.get('/unpaid', getProfile, async (req, res) => {
  const {Job, Contract} = req.app.get('models')
  const contractQuery = {status: {[Op.ne]: 'terminated'}}
  const contractInstance = {
    model: Contract,
    where: contractQuery
  }
  const jobQuery = {paid: {[Op.not]: true}}
  const args = {
    profile: req.profile.dataValues,
    association: contractInstance,
    query: jobQuery,
  }
  
  const jobs = await findAllJobs(Job, args)
  if(!jobs) return res.status(404).end()
  res.json(jobs)
})

/**
* @url /jobs/:job_id/pay
* @description pay for a job
*/
router.post('/:job_id/pay', getProfile, async (req, res) => {
  const {type, balance, id: ClientId} = req.profile.dataValues
  if (type !== 'client'){
    res.status(404).end('Only a client can pay for a job')
  }

  // get the unpaid job with the ID
  const {Job, Contract, Profile} = req.app.get('models')
  const contractQuery = {status: {[Op.ne]: 'terminated'}}
  const contractInstance = {
    model: Contract,
    where: contractQuery
  }
  const JobId = req.params['job_id']
  const jobQuery = {paid: {[Op.not]: true}}
  const args = {
    profile: req.profile.dataValues,
    association: contractInstance,
    query: jobQuery,
  }
  const job = await findOneJobById(Job, JobId, args)
  if (!job) {
    res.status(404).end('The job does not belong to the client,\nor the job was terminated,\nor the job is already paid')
  }

  const {price, Contract: jobContract} = job

  // client can only pay if his balance >= the amount to pay.
  if (price > balance) {
    res.status(404).end('The client can not afford this job')
  }

  // get the contractor
  const {ContractorId} = jobContract

  // The amount should be moved from the client's balance to the contractor balance.
  // update profile client
  const newClientBalance = balance - price
  const clientResp = await editOneProfileById(Profile, ClientId, {balance: newClientBalance})
  if (!clientResp) {
    res.status(404).end('Failed to update the client')
  }

  // update profile contractor
  const contractor = await findOneProfileById(Profile, ContractorId)
  const newContractorBalance = contractor.balance + price
  const contractorResp = await editOneProfileById(Profile, ContractorId, {balance: newContractorBalance})
  if (!contractorResp) {
    res.status(404).end('Failed to update the contractor')
  }
  
  // update job
  const newData = {
    paid: true,
    paymentDate: new Date(),
  }
  const jobResp = await editOneJobById(Job, JobId, newData)
  if (!jobResp) {
    res.status(404).end('Failed to update the job')
  }

  res.json('The job was paid successfully')
})

module.exports = router
