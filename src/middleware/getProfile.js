const {findOneProfileById} = require('../services/profiles')

const getProfile = async (req, res, next) => {
  const {Profile} = req.app.get('models')

  const profile = await findOneProfileById(Profile, req.get('profile_id') || 0)
  if(!profile) return res.status(401).end('Unauthorized')
  req.profile = profile
  next()
}

module.exports = {getProfile}
