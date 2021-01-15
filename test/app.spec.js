const app = require('../src/app');
const knex = require('knex');
const supertest = require('supertest');
const makeVeggiesArray = require('./veggies.fixtures');
const makeUsersArray = require('./users.fixtures');
const makeEventsArray = require('./events.fixtures');

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
    it('returns 400 when no user_id in request', () => {
      return supertest(app)
        .get('/api/events')
        .expect(400, {error: {message: 'Must provide a user_id.'}})
    })
    it('returns 400 when invalid user_id in request', () => {
      return supertest(app)
        .get('/api/events')
        .send({user_id: 5})
        .expect(400, {error: {message: 'Must provide a valid user_id.'}})
    })
    context('Given users and events in database', () => {
      beforeEach('Seed users table', () => {
        const usersArray = makeUsersArray();
        return db.insert(usersArray).into('users')
      })
      beforeEach('Seed events table', () => {
        const eventsArray = makeEventsArray();
        return db.insert(eventsArray).into('events')
      })
      it('returns 200 and [] when user has no events', () => {
        return supertest(app)
          .get('/api/events')
          .send({user_id:2})
          .expect(200, [])
      })
      it('returns array of events for correct user', () => {
        return supertest(app)
          .get('/api/events')
          .send({user_id: 1})
          .expect(200, [
            {
              id: 1,
              user_id: 1,
              event_type: 'planting',
              event_date: '2021-04-12T06:00:00.000Z',
              completed: false,
              notes: 'Radishes'
            },
            {
              id: 3,
              user_id: 1,
              event_type: 'watering',
              event_date: '2021-03-05T07:00:00.000Z',
              completed: true,
              notes: 'Entire Garden'
            }
          ])
      })
    })
  })

})

describe('events/:id endpoints', () => {
  describe('PATCH /api/events/:id', () => {
    beforeEach('Seed users table', () => {
      const usersArray = makeUsersArray();
      return db.insert(usersArray).into('users')
    })
    beforeEach('Seed events table', () => {
      const eventsArray = makeEventsArray();
      return db.insert(eventsArray).into('events')
    })
    it('returns 400 if no update sent', () => {
      return supertest(app)
        .patch('/api/events/1')
        .send({user_id: 1})
        .expect(400, { error: { message: 'Must update at least one field.' }})
    })
    it('returns 401 unathorized if user_id is incorrect', () => {
      return supertest(app)
        .patch('/api/events/1')
        .send({user_id: 2})
        .expect(401, {error: {message: 'Unauthorized request'}})
    })
    it('updates the event if request is valid', () => {
      return supertest(app)
        .patch('/api/events/1')
        .send({user_id: 1, completed: true})
        .expect(200, 
          {
            id: 1,
            user_id: 1,
            event_type: 'planting',
            event_date: '2021-04-12T06:00:00.000Z',
            completed: true,
            notes: 'Radishes'
          }
        )
        .then(() => {
          return supertest(app)
            .get('/api/events/1')
            .send({user_id: 1})
            .expect(200, 
              {
                id: 1,
                user_id: 1,
                event_type: 'planting',
                event_date: '2021-04-12T06:00:00.000Z',
                completed: true,
                notes: 'Radishes'
              }
            )
        })
    })
  })
})