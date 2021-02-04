const express = require('express');
const jsonParser = express.json();
const authenticationRouter = express.Router();
const AuthenticationService = require('./authentication-service');
const bcrpyt = require('bcryptjs');

authenticationRouter
    .route('/login')
    .post(jsonParser, (req,res,next) => {
        let { username, password} = req.body;
        if(!username || !password){
            return res.status(400).json({error: {message: 'Must provide username and password'}})
        }
        console.log(username)
        console.log(password)
        AuthenticationService.checkUsername(req.app.get('db'), username)
            .then(user => {
                if(!user){
                    return res.status(401).json({error: {message: 'Invalid username'}})
                }
                AuthenticationService.getUserPassword(req.app.get('db'), user.id)
                    .then(db_password => {
                        console.log(db_password.password)
                        console.log(password)
                        let authorized = bcrpyt.compareSync(password, db_password.password);
                        if(!authorized){
                            return res.status(401).json({error: {message: 'Invalid password'}})
                        }
                        return res.status(200).json({jwt: 'this should be a jwt'})
                    })
            })
            .catch(next)
    })

module.exports = authenticationRouter;