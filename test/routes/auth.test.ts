import * as request from 'supertest'
import * as jwt from 'jsonwebtoken'
import * as sinon from 'sinon'
import { expect } from 'chai'
import { Hmac } from 'crypto'

import app from '../../src/app'
import { UserDB, User } from '../../src/models/user'

type jwtStubType = sinon.SinonStub<[string | Buffer | object, jwt.Secret, jwt.SignOptions], string>

describe('/auth route test', () => {
  const req = request(app)

  const userCreateStub = sinon.stub(UserDB, 'create')
  const userFindStub = sinon.stub(UserDB, 'find')
  const encrypteStub = sinon.stub(Hmac.prototype, 'digest')
  const jwtStub = sinon.stub(jwt, 'sign')

  beforeEach(() => {
    sinon.reset()
  })

  describe('POST /auth/signup', () => {
    beforeEach(() => {
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

    it('400 Bad Request (email duplicated)', async () => {
      userFindStub.resolves([{ email: 'testem', password: 'testpw' } as User])

      const data = { email: 'testem', password: 'testpw' }
      const res = await req.post('/api/auth/signup').send(data).expect(400)

      expect(res.body.message).to.eql('user already exist')
    })
  })

  describe('GET /auth/duplicated', () => {
    it('200 OK (duplicated)', async () => {
      userFindStub.resolves([{ email: 'test', password: 'test' } as User])

      const res = await req.get('/api/auth/duplicated?email=test').expect(200)

      expect(res.body).to.eql({ email: 'test', result: true })
    })

    it('200 OK (not duplicated)', async () => {
      userFindStub.resolves([])

      const res = await req.get('/api/auth/duplicated?email=test').expect(200)

      expect(res.body).to.eql({ email: 'test', result: false })
    })

    it('400 Bad Request (request data missing)', async () => {
      await req.get('/api/auth/duplicated').expect(400)
    })
  })

  describe('POST /auth/login', () => {
    beforeEach(() => {
      jwtStub.value((payload: any) => JSON.stringify(payload))
      encrypteStub.returns('encrypted')
    })

    it('200 OK', async () => {
      userFindStub.resolves([{ email: 'test', password: 'encrypted' } as User])

      const res = await req.post('/api/auth/login').send({ email: 'test', password: 'test' }).expect(200)
      const expectedToken = JSON.stringify({ email: 'test' })

      expect(res.body).to.eql({ data: { token: expectedToken } })
    })

    it('400 Bad Request (email missing)', async () => {
      const res = await req.post('/api/auth/login').send({ password: 'test' }).expect(400)

      expect(res.body.message).to.eql('request data missing')
    })

    it('400 Bad Request (password missing)', async () => {
      const res = await req.post('/api/auth/login').send({ email: 'test' }).expect(400)

      expect(res.body.message).to.eql('request data missing')
    })

    it('401 Unauthorized', async () => {
      userFindStub.resolves([{ email: 'test', password: 'wrongpassword' } as User])

      const res = await req.post('/api/auth/login').send({ email: 'test', password: 'test' }).expect(401)
 
      expect(res.body.message).to.eql('wrong password')
    })

    it('404 Not Found', async () => {
      userFindStub.resolves([])

      const res = await req.post('/api/auth/login').send({ email: 'test', password: 'test' }).expect(404)

      expect(res.body.message).to.eql('user not found')
    })
  })
})
