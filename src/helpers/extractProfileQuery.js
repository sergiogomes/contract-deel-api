const extractProfileQuery = (profile) => {
  if (!profile) return {}

  const query = {}

  if (profile.type === 'client'){
    query.ClientId = profile.id
  }

  if (profile.type === 'contractor'){
    query.ContractorId = profile.id
  }  

  return query
}

module.exports = {extractProfileQuery}
