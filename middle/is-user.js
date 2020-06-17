const jsonWtoken = require('jsonwebtoken');

module.exports = (req, res, next) =>{
    const userHeader = req.get('Authorization');
    if(!userHeader){
        req.isUser = false;
        return next();
    }
    const token = userHeader.split(' ')[1];
    if(!token || token === ''){
        req.isUser = false;
        return next();
    } 
    let decodedToken;
    try{
        decodedToken = jsonWtoken.verify(token, 'averyextremelysecretkey');
    }   catch(err){
        req.isUser = false;
        return next();
    }
    if(!decodedToken){
        req.isUser = false;
        return next();
    }
    req.isUser = true;
    req.userId = decodedToken.userId;
    next();
};