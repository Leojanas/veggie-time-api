const authenticationService = require('../src/Authentication/authentication-service');
const makeUsersArray = require('./users.fixtures');

let users = makeUsersArray();

let jwtArray = [];
users.map((user, i)=> {
    let jwt = authenticationService.createJwt(user.username, {user_id: i})
    jwtArray.push(jwt)
})

module.exports = jwtArray;
