const { Op } = require('sequelize')

const {tryit} = require('../helpers/tryit')
const {findOneJobById, findAllJobs, editOneJobById} = require('../services/jobs')
const {findOneProfileById, editOneProfileById} = require('../services/profiles')

const getUnpaidJobs = async (models, args) => {
  const {Job, Contract} = models
  const contractQuery = {status: {[Op.ne]: 'terminated'}}
  args.association = {
    model: Contract,
    where: contractQuery
  }
  args.query = {paid: {[Op.not]: true}}
  
  const [error, jobs] = await tryit(findAllJobs(Job, args))

  if (error) throw new Error(error)

  return jobs
}

const payForTheJob = async (models, JobId, args) => {
  const {type, balance, id: ClientId} = args.profile
  if (type !== 'client') {
    throw new Error('Only a client can pay for a job')
  }

  // get the unpaid job with the ID
  const {Job, Contract, Profile} = models
  const contractQuery = {status: {[Op.ne]: 'terminated'}}
  args.association = {
    model: Contract,
    where: contractQuery
  }
  args.query = {paid: {[Op.not]: true}}
  
  const [jobError, job] = await tryit(findOneJobById(Job, JobId, args))
  if (jobError) {
    throw new Error(jobError)
  }
  if (!job) {
    throw new Error('The job does not belong to the client, or the job was terminated, or the job is already paid')
  }

  const {price, Contract: jobContract} = job

  // client can only pay if his balance >= the amount to pay.
  if (price > balance) {
    throw new Error('The client can not afford this job')
  }

  // get the contractor
  const {ContractorId} = jobContract

  // The amount should be moved from the client's balance to the contractor balance.
  // update profile client
  const newClientBalance = balance - price
  const [clientError, clientResp] = await tryit(editOneProfileById(Profile, ClientId, {balance: newClientBalance}))
  if (clientError) {
    throw new Error(clientError)
  }
  if (!clientResp) {
    throw new Error('Failed to update the client')
  }

  // update profile contractor
  const contractor = await findOneProfileById(Profile, ContractorId)
  const newContractorBalance = contractor.balance + price
  const [contractorError, contractorResp] = await tryit(editOneProfileById(Profile, ContractorId, {balance: newContractorBalance}))
  if (contractorError) {
    throw new Error(contractorError)
  }
  if (!contractorResp) {
    throw new Error('Failed to update the contractor')
  }
  
  // update job
  const newData = {
    paid: true,
    paymentDate: new Date(),
  }
  const [jobUpdateError, jobResp] = await tryit(editOneJobById(Job, JobId, newData))
  if (jobUpdateError) {
    throw new Error(jobUpdateError)
  }
  if (!jobResp) {
    throw new Error('Failed to update the job')
  }

  return jobResp
}

module.exports = {getUnpaidJobs, payForTheJob}
