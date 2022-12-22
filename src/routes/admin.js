const express = require('express')

const {getProfile} = require('../middleware/getProfile')
const {getBestProfession} = require('../controllers/jobs')
const {tryit} = require('../helpers/tryit')

const router = express.Router()

/**
* @url /admin/best-profession?start=<date>&end=<date>
* @returns profession that earned the most money for in the query time range
*/
router.get('/best-profession', getProfile, async (req, res) => {
  const args = {query: req.query}
  const [error, profession] = await tryit(getBestProfession(req.app.get('models'), args))

  if (error) res.status(404).end(error.stack)

  res.json(profession)
})

module.exports = router
