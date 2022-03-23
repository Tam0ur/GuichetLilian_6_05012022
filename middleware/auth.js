//appel chemins
const jwt = require('jsonwebtoken');

//gestion authentification
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];//récupération tout après l'espace header
        const decodedToken = jwt.verify(token, 'randompassword');//vérification du token
        const userId = decodedToken.userId;//extraction ID utilisateur du token
        if (req.body.userId && req.body.userId !== userId){//comparaison des ID
            throw 'User ID non valable';
        } else {
            res.locals.userId = userId;
            next();
        }
    } catch(error){
        res.status(403).json({ error : error | 'Unauthorized request' });
    }
};