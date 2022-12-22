const { Op } = require('sequelize')

const {tryit} = require('../helpers/tryit')
const {getUnpaidJobs} = require('../controllers/jobs')

const PERCENTAGE_LIMIT_ABOVE_JOBS_TO_PAY_SUM = 0.25

const depositsMoney = async (models, userId, args) => {
  const {type, balance, id: ClientId} = args.profile
  if (type !== 'client') {
    throw new Error('Only a client can receive a deposit')
  }
  if (ClientId !== Number(userId)) {
    throw new Error('A client can only deposit into his own account')
  }

  const [jobsError, jobs] = await tryit(getUnpaidJobs(models, args))
  if (jobsError) {
    throw new Error(jobsError)
  }
  if (!jobs || jobs.lenght === 0) {
    throw new Error('Client does not have any job to be paid')
  }

  jobsToPaySum = jobs.reduce((sum, curr) => {
    const {price} = curr.dataValues
    sum += price

    return sum
  }, 0)

  if (jobsToPaySum === 0) {
    throw new Error('Client does not have any job to be paid')
  }

  const depositLimit = jobsToPaySum + (jobsToPaySum * PERCENTAGE_LIMIT_ABOVE_JOBS_TO_PAY_SUM)

  const {deposit} = args.body
  if (deposit > depositLimit) {
    throw new Error(`Client can not deposit more than 25% his total of jobs to pay: $${depositLimit}`)
  }

  const newBalance = balance + deposit

  // update user

}

module.exports = {depositsMoney}
