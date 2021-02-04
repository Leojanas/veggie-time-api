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
    }
}

module.exports = AuthenticationService;