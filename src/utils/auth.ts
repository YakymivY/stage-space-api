const jwt = require('jsonwebtoken');

if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

export function authenticateToken (req, res, next) {
    //take token
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
  
    //verify user by token
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

//module.exports = authenticateToken;