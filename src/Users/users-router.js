const express = require('express');
const usersRouter = express.Router();
const usersService = require('./usersService');
const jsonParser = express.json();

usersRouter
    .route('/')
    .get((req,res) => {
        usersService.getUsers(req.app.get('db'))
        .then(users => {
            return res.status(200).send(users)
        })
    })

usersRouter
    .route('/:id')
    .delete((req,res) => {
        let id = req.params.id;
        usersService.deleteUser(req.app.get('db'), id)
        .then(() => res.status(204).end())
    })

module.exports = usersRouter;