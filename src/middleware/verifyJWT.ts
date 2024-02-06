const jwt = require('jsonwebtoken');
require('dotenv').config();

export const verifyJWT = (req:any, res:any, next:any) => {
    
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);
    console.log(authHeader); // Bearer token
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err:any, decoded:any) => {
        console.log("%c 🏨: verifyJWT -> decoded ", "font-size:16px;background-color:#9cbb76;color:white;",decoded)
            if (err) return res.sendStatus(403); //invalid token
            req.user = decoded.userEmail;
            next();
        }
    );
}

