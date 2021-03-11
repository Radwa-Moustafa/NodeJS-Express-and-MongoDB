const express = require("express");
const favoriteRouter = express.Router();
const favorites = require("../models/favorites");
const authenticate = require("../authenticate");
favoriteRouter.use(express.json());
const cors = require("./cors");

favoriteRouter
  .route("/")
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    favorites.findOne({ postedBy: req.user._id }) //like DAL operation this.GetAll()
      .populate("postedBy")
      .populate("dishes")
      .then(
        (favorites) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favorites); //send back result to client
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    favorites.findOne({ postedBy: req.user._id })
        .then((favorites) => {
            if (req.body.dishes !== null) {
                req.body.dishes.forEach((element) => {
                    if (favorites.dishes.indexOf(element) === -1) {
                        favorites.dishes.push(element);
                    }
                });
            }
            favorites.save().then((fav) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(fav);
            }, (err) => next(err));
        }, (err) => { next(err) })
        .catch((err) => next(err));
})
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation is not suppported on /favorites");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    favorites.remove({ postedBy: req.user._id })
      .then(
        (result) => {
          console.log("favorite Deleted ", result);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(result); //send back result to client
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

  ////////////////////////////////// Using DishId //////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////

favoriteRouter
  .route("/:dishId")
  .get(cors.cors,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end("GET operation is not suppported on /favorites/dishId");
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    favorites.findOne({ postedBy: req.user._id })
        .then((fav) => {
          if(fav){
            if (fav.dishes.indexOf(req.params.dishId) === -1) {
              fav.dishes.push(req.params.dishId);
            }
            fav.save().then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }, (err) => next(err));
          }
            else{
              console.log('user id',req.user._id)
              var favor = new favorites({
                postedBy:req.user._id,
                dishes:[req.params.dishId]
              });
              favorites.create(favor)
              .then((response)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
              })
            }
        }, (err) => next(err))
        .catch((err) => next(err));
})
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation is not suppported on /favorites/dishId");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    favorites
      .findOne({ postedBy: req.user._id }) //like DAL operation this.GetAll()
      .then((favorite) => {
        if (favorite !== null) {
          var index = favorite.dishes.indexOf(req.params.dishId)
          if (index !== -1) {
            favorite.dishes.splice(index, 1);
          }
          favorite.save().then((favorites) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(favorites);
          }, (err) => next(err));
      } else {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(favorite);
      }
      })
      .catch((err) => next(err));
  });

module.exports = favoriteRouter;
