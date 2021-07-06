const bcrytp = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");


//Créaton d'un utilisateur
exports.signup = (req, res, next) => {
    bcrytp.hash(req.body.password, 10) //hashage 10 tours
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
            .then(() => res.status(201).json({message: "Utilisateur créé !"}))
            .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};

//Connextion d'un utilisateur existant
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) //Trouver un seul utilisateur
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: "Utilisateur non trouvé !"});
            }
            bcrytp.compare(req.body.password, user.password) // comparaision du mot de passe envoyé avec le hash dans le document user
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ error: "Mot de passe incorrect !"});
                }
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                        { userId: user._id},
                        "xPm0&8x1M43Uns",
                        { expiresIn: "24h"}
                    )
                });
            })
            .catch(error => res.status(500).json({ error}));
        })
        .catch(error => res.status(500).json({ error }));
};