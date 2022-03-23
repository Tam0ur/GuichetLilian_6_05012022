//appel chemins
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

//création utilisateur
exports.signup = (req, res, next ) => {
    bcrypt.hash(req.body.password, 10)//hash du mdp
    .then(hash => {
        const user = new User({//création nouvel utilisateur avec l'e-mail écrit + mdp hashé
            email: req.body.email,
            password: hash
        });
        user.save()//sauvegarde utilisateur
        .then(() => res.status(201).json({ message: 'Utilisateur créé.'}))
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};

//gestion connexion utilisateur
exports.login = (req, res, next ) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user){//gestion si l'utilisateur n'est pas dans la base de données
            return res.statys(401).json({error : 'Utilisateur non trouvé.' });
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid){//gestion si le mdp ne correspond pas
                return res.status(401).json({ error : 'Mot de passe incorrect.'});
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { userId: user._id },
                    'randompassword',
                    {expiresIn: '24h' }
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

