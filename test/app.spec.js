const app = require('../src/app');
const knex = require('knex');
const supertest = require('supertest');
const makeVeggiesArray = require('./veggies.fixtures');
const makeUsersArray = require('./users.fixtures');
const makeEventsArray = require('./events.fixtures');
const makeGardenArray = require('./garden.fixtures');

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
    it('returns 401 when no user_id in request', () => {
      return supertest(app)
        .get('/api/events')
        .expect(401, {error: {message: 'Must provide a user_id.'}})
    })
    it('returns 401 when invalid user_id in request', () => {
      return supertest(app)
        .get('/api/events')
        .send({user_id: 5})
        .expect(401, {error: {message: 'Must provide a valid user_id.'}})
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
  describe('POST /api/events', () => {
    context('given a valid user_id', () => {
      beforeEach('Seed users table', () => {
        const usersArray = makeUsersArray();
        return db.insert(usersArray).into('users')
      })
      it('should return 400 if field(s) missing', () => {
        return supertest(app)
          .post('/api/events')
          .send({user_id: 1, event_type: 'watering'})
          .expect(400, {error: {message: 'One or more event attributes missing or invalid'}})
      })
      it('should return 400 for invalid event_type', () => {
        return supertest(app)
        .post('/api/events')
        .send({user_id: 1, event_type: 'Invalid type', event_date: '2021-04-20', completed: false, notes: 'Whole Garden'})
        .expect(400, {error: {message: 'One or more event attributes missing or invalid'}})
      })
      it('should post the event and return 200 if valid', () => {
        return supertest(app)
          .post('/api/events')
          .send({user_id: 1, event_type: 'weeding', event_date: '2021-04-20', completed: false, notes: 'Whole Garden'})
          .expect(201, {
            id: 1,
            user_id: 1,
            event_type: 'weeding',
            event_date: '2021-04-20T06:00:00.000Z',
            completed: false,
            notes: 'Whole Garden'
          })
      })
      it('should mark completed as false if not given', () => {
        return supertest(app)
          .post('/api/events')
          .send({user_id: 1, event_type: 'weeding', event_date: '2021-04-20', notes: 'Whole Garden'})
          .expect(201, {
            id: 1,
            user_id: 1,
            event_type: 'weeding',
            event_date: '2021-04-20T06:00:00.000Z',
            completed: false,
            notes: 'Whole Garden'
          })
      })
    })
  })
})

describe('events/:id endpoints', () => {
  beforeEach('Seed users table', () => {
    const usersArray = makeUsersArray();
    return db.insert(usersArray).into('users')
  })
  it('returns 404 if id does not exist', () => {
      return supertest(app)
        .get('/api/events/25')
        .send({user_id: 1})
        .expect(404, {error: {message: 'Resource Not Found'}})
  })
  describe('GET /api/events/:id', () => {
    beforeEach('Seed events table', () => {
      const eventsArray = makeEventsArray();
      return db.insert(eventsArray).into('events')
    })
    it('returns the event if user_id matches', () => {
      return supertest(app)
        .get('/api/events/1')
        .send({user_id: 1})
        .expect(200, {
          id: 1,
          user_id: 1,
          event_type: 'planting',
          event_date: '2021-04-12T06:00:00.000Z',
          completed: false,
          notes: 'Radishes'
        })
    })
  })
  describe('PATCH /api/events/:id', () => {
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
  describe('DELETE /api/events/:id', () => {
    beforeEach('Seed events table', () => {
      const eventsArray = makeEventsArray();
      return db.insert(eventsArray).into('events')
    })
    it('should delete the event', () => {
      return supertest(app)
        .delete('/api/events/3')
        .send({user_id: 1})
        .expect(204)
        .then(() => {
          return supertest(app)
            .get('/api/events/3')
            .send({user_id: 1})
            .expect(404, {error: {message: 'Resource Not Found'}})
        })
    })
  })
})

describe('garden endpoints', () => {
  describe('GET /api/garden', () => {
    beforeEach('Seed veggies table', () => {
      let veggieArray = makeVeggiesArray();
      return db.insert(veggieArray).into('veggies')
    })
    beforeEach('Seed users table', () => {
      const usersArray = makeUsersArray();
      return db.insert(usersArray).into('users')
    })
    beforeEach('Seed garden table', () => {
      const gardenArray = makeGardenArray();
      return db.insert(gardenArray).into('garden')
    })
    it('should return all garden veggies give na valid user_id', () => {
      return supertest(app)
        .get('/api/garden')
        .send({user_id: 1})
        .expect(200, [
          {
            veggie_name: 'Beets',
            germination_days: 8,
            thinning_days: 15,
            harvest_days: 60,
            plant_date: '2021-03-18T06:00:00.000Z',
            id: 1
          },
          {
            veggie_name: 'Radishes',
            germination_days: 5,
            thinning_days: 10,
            harvest_days: 45,
            plant_date: null,
            id: 3
          }
        ])
    })
  })
})