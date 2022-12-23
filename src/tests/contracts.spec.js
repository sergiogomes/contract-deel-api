const { Op } = require('sequelize')

const {findOneContractById, findAllContracts} = require('../services/contracts')
const {ContractMock} = require('./mocks/ContractMock')

describe('Contracts Service', () => {
  let Contract, response

  beforeAll(() => {
    Contract = ContractMock
  })

  describe('find All', () => {
    it('should return 10 contracts', async () => {
      response = await findAllContracts(ContractMock, {})

      expect(response.length).toEqual(10)
    })
  })

  describe('find One', () => {
    it('should return the contract with id 5', async () => {
      const contractId = 5
      response = await findOneContractById(ContractMock, contractId, {})

      const {id} = response.dataValues

      expect(id).toEqual(contractId)
    })
  })
})
