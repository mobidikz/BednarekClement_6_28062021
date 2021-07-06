//import du model
const Sauce = require("../models/Sauce");
//import package pour modification et supression de fichiers
const fs = require("fs");

//Créer sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl : `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    })
    sauce.save()
    .then(() => res.status(201).json({message: "Objet enregistré !"}))
    .catch(error => res.status(400).json({error}));
};

//Modifier sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl : `${req.protocol}://${req.get("host")}/images/${req.file.filename}`

         } : {...req.body};
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(sauce => res.status(200).json({ message: "Objet modifié !"}))
      .catch(error => res.status(400).json({ error }));
};

//Supprimer sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Objet supprimé !"}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({error}))   
};


// Récupérer 1 seule sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

//Récupérer toutes les sauces
exports.getAllSauces =(req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
};

//Ajout like ou dislike
exports.likeSauce = (req, res, next) => {    
    const like = req.body.like;
    if(like === 1) { // Option like
        Sauce.updateOne({_id: req.params.id}, { $inc: { likes: 1}, $push: { usersLiked: req.body.userId}, _id: req.params.id })
        .then( () => res.status(200).json({ message: 'Vous avez liké :)' }))
        
        .catch( error => res.status(400).json({ error}))
    } else if(like === -1) { // Option dislike
        Sauce.updateOne({_id: req.params.id}, { $inc: { dislikes: 1}, $push: { usersDisliked: req.body.userId}, _id: req.params.id })
        .then( () => res.status(200).json({ message: 'Vous avez disliké :(' }))
        .catch( error => res.status(400).json({ error}))

    } else {    // Annuler like ou dislike
        Sauce.findOne( {_id: req.params.id})
        .then( sauce => {
            if( sauce.usersLiked.indexOf(req.body.userId)!== -1){
                 Sauce.updateOne({_id: req.params.id}, { $inc: { likes: -1},$pull: { usersLiked: req.body.userId}, _id: req.params.id })
                .then( () => res.status(200).json({ message: 'Vous annulé le like :(' }))
                .catch( error => res.status(400).json({ error}))
                }
            else if( sauce.usersDisliked.indexOf(req.body.userId)!== -1) {
                Sauce.updateOne( {_id: req.params.id}, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId}, _id: req.params.id})
                .then( () => res.status(200).json({ message: 'Vous annulé le dislike :)' }))
                .catch( error => res.status(400).json({ error}))
                }           
        })
        .catch( error => res.status(400).json({ error}))             
    }   
};

