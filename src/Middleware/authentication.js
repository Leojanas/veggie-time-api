const AuthenticationService = require('../Authentication/authentication-service');
const usersService = require('../Users/usersService');

function requireAuth(req, res, next){
    const authToken = req.get('Authorization') || ''

    let bearerToken;
    if(!authToken.toLowerCase().startsWith('bearer ')){
        return res.status(401).json({error: {message: 'Missing bearer token.'}})
    }else{
        bearerToken = authToken.split(' ')[1]
    }
    try {
        let payload = AuthenticationService.verifyJwt(bearerToken);
        req.payload = payload;
        next()
    } catch(error) {
        return res.status(401).json({error: {message: 'Unauthorized request.'}})
    }
}

module.exports = {
    requireAuth
}