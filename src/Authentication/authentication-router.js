const express = require('express');
const jsonParser = express.json();
const authenticationRouter = express.Router();
const AuthenticationService = require('./authentication-service');
const usersService = require('../Users/usersService');
const bcrpyt = require('bcryptjs');




authenticationRouter
    .route('/login')
    .post(jsonParser, (req,res,next) => {
        let {username, password} = req.body;
        if(!username || !password){
            return res.status(400).json({error: {message: 'Invalid submission.'}})
        }
        AuthenticationService.checkUsername(req.app.get('db'), username)
            .then(user => {
                if(!user){
                    return res.status(401).json({error: {message: 'Invalid username/password combination.'}})
                }
                AuthenticationService.getUserPassword(req.app.get('db'), user.id)
                    .then(db_password => {
                        let authorized = bcrpyt.compareSync(password, db_password.password);
                        if(!authorized){
                            return res.status(401).json({error: {message: 'Invalid username/password combination.'}})
                        }
                        return res.status(200).json({authToken: AuthenticationService.createJwt(username, {user_id: user.id})})
                    })
            })
            .catch(next)
    })

authenticationRouter
    .route('/signup')
    .post(jsonParser, (req,res,next) => {
        let {name, username, password} = req.body;
        if(!name || !username || !password){
            return res.status(400).json({error: {message: 'Invalid submission.'}})
        }
        usersService.checkUsername(req.app.get('db'), username)
            .then(user => {
                if(user){
                    return res.status(400).json({error: {message: 'Username not available.'}})
                }
            })
            .then(() => {
                let user = {name, username, password}
                usersService.insertUser(req.app.get('db'), user)
                    .then(user => {
                        return res.status(200).json({authToken: AuthenticationService.createJwt(username, {user_id: user.id})})
                    })
            })
        .catch(next)
    })

module.exports = authenticationRouter;