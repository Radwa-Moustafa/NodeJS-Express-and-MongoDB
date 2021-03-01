const express = require('express');
const mongoose = require('mongoose');
const dishRouter = express.Router();

const Dishes = require('../models/dishes');
dishRouter.use(express.json());

//request chaining (chain all methods to dishRouter)
dishRouter.route('/')
// .all((req,res,next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type','text/plain');
//     next();
// })
.get((req,res,next) => {
    Dishes.find({}) //like DAL operation this.GetAll()
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes) //send back result to client
    },(err) => next(err))
    .catch((err) => next(err));
    //res.end('will send all the dishes to you!');
})
.post((req,res,next) => {
    Dishes.create(req.body)
    .then((dish) => {
        console.log('Dish Created ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish) //send back result to client
    },(err) => next(err))
    .catch((err) => next(err));
    // res.end('will add the dish: ' + req.body.name + 
    // ' with details: ' + req.body.description);
})
.put((req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation is not suppported on /dishes');
})
.delete((req,res,next) => {
    Dishes.remove({})
    .then((result) => {
        console.log('Dish Deleted ', result);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(result) //send back result to client
    },(err) => next(err))
    .catch((err) => next(err));
    // res.end('deleting all the dishes!');
});

dishRouter.route('/:dishId')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish) //send back result to client
    },(err) => next(err))
    .catch((err) => next(err));
    // res.end('will send details of the dish: ' + req.params.dishId
    // + ' to you!');
})
.post((req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation is not suppported on /dishes/dishId');
})
.put((req,res,next) => {
    Dishes.findByIdAndUpdate(req.params.dishId,{$set: req.body},{new:true})
    .then((dish) => {
        console.log('Dish Updated ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish) //send back result to client
    },(err) => next(err))
    .catch((err) => next(err));

    // res.write('Updating the dish ' + req.params.dishId + '\n');
    // res.end('will update the dish ' + req.params.dishId
    // +' with details: ' + req.body.description);
})
.delete((req,res,next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((dish) => {
        console.log('Dish Deleted ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish) //send back result to client
    },(err) => next(err))
    .catch((err) => next(err));
    // res.end('deleting the dish: ' + req.params.dishId);
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

dishRouter.route('/:dishId/comments')
// .all((req,res,next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type','text/plain');
//     next();
// })
.get((req,res,next) => {
    Dishes.findById(req.params.dishId) //like DAL operation this.GetAll()
    .then((dish) => {
        if(dish != null){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dish.comments) //send back result to client
        } else{
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.statusCode = 404;
            return next(err);
        }
    },(err) => next(err))
    .catch((err) => next(err));
    //res.end('will send all the dishes to you!');
})
.post((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null){
            dish.comments.push(req.body);
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(dish) //send back result to client
            },(err) => next(err))
        } else{
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.statusCode = 404;
            return next(err);
        }
    },(err) => next(err))
    .catch((err) => next(err));
    // res.end('will add the dish: ' + req.body.name + 
    // ' with details: ' + req.body.description);
})
.put((req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation is not suppported on /dishes/' + req.params.dishId + '/comments');
})
.delete((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null){
            for(var i= dish.comments.length -1; i>=0; i--)
            {
                dish.comments.id(dish.comments[i]._id).remove(); //remove comment by comment
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(dish) //send back result to client
            },(err) => next(err))
        } else{
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.statusCode = 404;
            return next(err);
        }
    },(err) => next(err))
    .catch((err) => next(err));
    // res.end('deleting all the dishes!');
});

dishRouter.route('/:dishId/comments/:commentId')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentId) != null){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dish.comments.id(req.params.commentId)) //send back result to client
        } else if(dish == null){
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.statusCode = 404;
            return next(err);
        } else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.statusCode = 404;
            return next(err);
        }
    },(err) => next(err))
    .catch((err) => next(err));
    // res.end('will send details of the dish: ' + req.params.dishId
    // + ' to you!');
})
.post((req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation is not suppported on /dishes/' + req.params.dishId + 'comment/' + req.params.commentId);
})
.put((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentId) != null){
            if(req.body.rating){
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if(req.body.comment){
                dish.comments.id(req.params.commentId).comment = req.body.comment;
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(dish) //send back result to client
            },(err) => next(err))
        } else if(dish == null){
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.statusCode = 404;
            return next(err);
        } else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.statusCode = 404;
            return next(err);
        }
    })
    .catch((err) => next(err));

    // res.write('Updating the dish ' + req.params.dishId + '\n');
    // res.end('will update the dish ' + req.params.dishId
    // +' with details: ' + req.body.description);
})
.delete((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
          dish.comments.id(req.params.commentId).remove(); //remove comment by id
          dish.save().then(
            (dish) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(dish); //send back result to client
            },
            (err) => next(err)
          );
        } else if (dish == null) {
          err = new Error("Dish " + req.params.dishId + " not found");
          err.statusCode = 404;
          return next(err);
        } else {
          err = new Error("Cooment " + req.params.commentId + " not found");
          err.statusCode = 404;
          return next(err);
        }
    },(err) => next(err))    .catch((err) => next(err));
    // res.end('deleting the dish: ' + req.params.dishId);
});


module.exports = dishRouter;
