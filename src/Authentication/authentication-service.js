const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

AuthenticationService = {
    checkUsername(knex, username){
        return knex('users')
            .select('*')
            .where('username', username)
            .first()
    },
    getUserPassword(knex, id){
        return knex('users')
            .select('password')
            .where('id', id)
            .first()
    },
    createJwt(subject, payload){
        return jwt.sign(payload, config.JWT_SECRET, {subject: subject, algorithm: 'HS256'})
    },
    verifyJwt(token){
        return jwt.verify(token, config.JWT_SECRET, {algorithms: ['HS256']})
    }
}

module.exports = AuthenticationService;