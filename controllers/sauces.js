//appel chemins
const Sauce = require('../models/sauce');
const fs = require('fs');
const sauce = require('../models/sauce');


//createSauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);//création objet sauce avec l'appel de la requête
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,//concaténation de l'objet dans la Sauce
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //gestion de l'ajout d'une image
  });
  sauce.save()//sauvegarde de l'objet
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

//getAllSauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

//modifySauce
exports.modifySauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
      if ( sauce.userId == res.locals.userId ){//protection route modifier
        Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
        .catch(error => res.status(400).json({ error }));
      } else {
        res.status(403).json({
          message: 'unauthorized request.'
        });
      }
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

//deleteSauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
      if ( sauce.userId == res.locals.userId ){//protection route supprimer 
        Sauce.deleteOne({_id: req.params.id}).then(
          () => {
            res.status(200).json({
              message: 'Sauce deleted!'
            });
          }
        ).catch(
          (error) => {
            res.status(400).json({
              error: error
            });
          }
        );
      } else {
        res.status(403).json({
          message: 'unauthorized request.'
        });
      }
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

//getOneSauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

//likeSauce
exports.likeSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce)=>{
      switch ( req.body.like ){//gestion en fonction de chaque cas possible
        case 0://si l'utilisateur n'a rien like ou dislike
          const found = sauce.usersLiked.find( e => e == req.body.userId );
          if (found){
            sauce.likes --;
            sauce.usersLiked.pull(req.body.userId);
          }
          if (sauce.usersDisliked.find( e => e == req.body.userId ) ){
            sauce.disLikes --;
            sauce.usersDisliked.pull(req.body.userId);
          }
          break;

        case 1://si l'utilisateur n'a pas like
          if ( !sauce.usersLiked.find( e => e == req.body.userId )){
            sauce.likes ++;
            sauce.usersLiked.push(req.body.userId);
          }
          break;

        case -1://si l'utilisateur n'a pas dislike
          if ( !sauce.usersDisliked.find( e => e == req.body.userId ) ){
            sauce.disLikes ++;
            sauce.usersDisliked.push(req.body.userId);
          }
          break;
      }
      sauce.save();
      res.status(200).json({ message: 'Sauce mise à jour.'});
    }
  ).catch(
    (error) => {
      console.log(error);
      res.status(400).json({
        error: error
      });
    }
  );
};
