// import jsonwebtoken pour token d'authentification
const jwt = require("jsonwebtoken");

// middleware authentification
module.exports= (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // Récupération du token à la seconde place du tableau
        const decodedToken = jwt.verify(token, "xPm0&8x1M43Uns"); // vérification token avec la clé
        const userId= decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) { //S'il ya une userId et s'il n'est pas égale à userId
            throw "User ID non valable !";
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | "Requête non authentifiée !"})
    }
}