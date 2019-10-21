import * as request from 'supertest'
import * as sinon from 'sinon'
import { expect } from 'chai'

import app from '../../src/app'
import { UserDB, User } from '../../src/models/user'
import { Hmac } from 'crypto'

describe('/auth route test', () => {
  const req = request(app)
  const sandbox = sinon.createSandbox()

  describe('GET /auth/signup', () => {
    const userCreateStub = sandbox.stub(UserDB, 'create')
    const userFindStub = sandbox.stub(UserDB, 'find')
    const encrypteStub = sandbox.stub(Hmac.prototype, 'digest')

    beforeEach(() => {
      sandbox.reset()

      encrypteStub.returns('encrypted')
    })

    it('200 OK', async () => {
      userFindStub.resolves([])

      const data = { email: 'testem', password: 'testpw' }
      const res = await req.post('/api/auth/signup').send(data).expect(200)

      const expected = [{
        email: 'testem',
        password: 'encrypted',
        nickname: undefined
      }]

      expect(res.body).to.eql({ data })
      expect(userCreateStub.called)
      expect(userCreateStub.args[0]).to.eql(expected)
    })

    it('500 E-Mail Duplicated', async () => {
      userFindStub.resolves([{ email: 'testem', password: 'testpw' } as User])

      const data = { email: 'testem', password: 'testpw' }
      const res = await req.post('/api/auth/signup').send(data).expect(500)

      expect(res.body.message).to.eql('user already exist')
    })
  })
})
