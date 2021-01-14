const app = require('../src/app');
const knex = require('knex');
const supertest = require('supertest');
const makeVeggiesArray = require('./veggies.fixtures');

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
    context('given veggies in database', () => {
      beforeEach('Seed veggies table', () => {
        let veggieArray = makeVeggiesArray();
        return db.insert(veggieArray).into('veggies')
      })
      it('responds with 200 and an array of veggie names and ids', () => {
        return supertest(app)
          .get('/api/allVeggies')
          .expect(200, [
            {
              id: 1,
              veggie_name: 'Beets',
              row_spacing: 16,
              plant_spacing: 4,
              germination_days: 8,
              thinning_days: 15,
              harvest_days: 60
            },
            {
              id: 2,
              veggie_name: 'Radishes',
              row_spacing: 8,
              plant_spacing: 2,
              germination_days: 5,
              thinning_days: 10,
              harvest_days: 45
            }
          ]
          )
      })
    })
  })
})

describe('events endpoints', () => {
  describe('GET /api/events', () => {
    it('returns 200 and [] when database is empty', () => {
      return supertest(app)
        .get('/api/events')
        .expect(200, [])
    })
  })
})