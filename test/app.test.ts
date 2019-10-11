import * as request from 'supertest'
import { expect } from 'chai'

import app from '../src/app'

describe('APP test', () => {
  const req = request(app)

  it('GET / OK', async () => {
    const res = await req.get('/').expect(200)
    expect(res.text).to.equal('Hello world!')
  })

  it('GET /not_found NOT FOUND', async () => {
    const res = await req.get('/not_found').expect(404)
    expect(res.body.message).to.equal('Not Found')
  })
})
