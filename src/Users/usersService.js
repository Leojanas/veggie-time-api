const usersService = {
    checkUserId(knex, id) {
        return knex('users')
            .select('*')
            .where('id', id)
            .first()
    },
    checkUsername(knex, username){
        return knex('users')
            .select('*')
            .where('username', username)
            .first()
    },
    insertUser(knex, user){
        return knex
            .insert(user)
            .into('users')
            .returning('*')
    }
}

module.exports = usersService;