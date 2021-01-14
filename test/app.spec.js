const app = require('../src/app');
const knex = require('knex');
const { expect } = require('chai');
const supertest = require('supertest');

let db;
  
before('make knex instance', () => {
  db = knex({
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL,
  })
  app.set('db', db)
});
after('disconnect from db', () => db.destroy());
before('clean the table', () => db.raw('TRUNCATE veggies, users, events, garden RESTART IDENTITY CASCADE'));
afterEach('cleanup',() => db.raw('TRUNCATE veggies, users, events, garden RESTART IDENTITY CASCADE'));

describe('allVeggies endpoints', () => {
  describe('GET /api/allVeggies', () => {
    it('Responds 200 and [] if no data in database', () => {
      return supertest(app)
        .get('/api/allVeggies')
        .expect(200, [])
    })
  })

})