const bcrypt = require('bcryptjs');

function makeUsersArray() {
    return usersArray = [
                {
                    name: 'Tim',
                    username: 'tim1',
                    password: '$2a$12$9lWnT6TP1UedCEVDfAoqG.4v6uOJKNIaCtro6kjiHO/9F0LZZKUnu'
                },
                {
                    name: 'George',
                    username: 'george1',
                    password: '$2a$12$XMAsJaGhkwFelxEENYGz6uq.06anYtGX0URCsVueF/CFvnTf9NyXO'
                },
                {
                    name: 'Mary',
                    username: 'mary1',
                    password:  '$2a$12$CF/4hO5D9btg7LR3zc57t.5MwKJTmiazNHuoCSfNBdL/U7w5153uq'

                }
            ]
}

module.exports = makeUsersArray;