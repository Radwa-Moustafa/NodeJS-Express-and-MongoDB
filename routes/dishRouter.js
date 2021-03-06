const express = require('express');
const mongoose = require('mongoose');
const dishRouter = express.Router();
const authenticate = require('../authenticate');
const Dishes = require('../models/dishes');
dishRouter.use(express.json());

//request chaining (chain all methods to dishRouter)
dishRouter.route('/')
// .all((req,res,next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type','text/plain');
//     next();
// })
.get(authenticate.verifyUser,(req,res,next) => {
    Dishes.find({}) //like DAL operation this.GetAll()
    .populate('comments.author')
    .then((dishes) => {
        console.log(req.user._id)
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes) //send back result to client
    },(err) => next(err))
    .catch((err) => next(err));
    //res.end('will send all the dishes to you!');
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
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
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation is not suppported on /dishes');
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
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
.get(authenticate.verifyUser,(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish) //send back result to client
    },(err) => next(err))
    .catch((err) => next(err));
    // res.end('will send details of the dish: ' + req.params.dishId
    // + ' to you!');
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation is not suppported on /dishes/dishId');
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
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
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
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

/////////////////////////////////////////// Comments Section //////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

dishRouter.route('/:dishId/comments')
// .all((req,res,next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type','text/plain');
//     next();
// })
.get(authenticate.verifyUser,(req,res,next) => {
    Dishes.findById(req.params.dishId) //like DAL operation this.GetAll()
    .populate('comments.author')
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
.post(authenticate.verifyUser,(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null){
            req.body.author = req.user._id;
            dish.comments.push(req.body);
            dish.save()
            .then((dish) => {
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                    res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(dish) //send back result to client
                })
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
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation is not suppported on /dishes/' + req.params.dishId + '/comments');
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
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
.get(authenticate.verifyUser,(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author') 
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
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation is not suppported on /dishes/' + req.params.dishId + 'comment/' + req.params.commentId);
})
.put(authenticate.verifyUser,(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentId) != null){
            // authenticate.getUserId(req,res,(userId) =>{
                // console.log('returned from authenticate.getUserId fn')
            if(dish.comments.id(req.params.commentId).author == req.user._id)
            {
                if(req.body.rating){
                    dish.comments.id(req.params.commentId).rating = req.body.rating;
                }
                if(req.body.comment){
                    dish.comments.id(req.params.commentId).comment = req.body.comment;
                }
            }else{
                err = new Error('The logged in user is not permitted to update this comment');
                err.statusCode = 403;
                return next(err);
            }
        // })
            dish.save()
            .then((dish) => {
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(dish) //send back result to client
                })
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
.delete(authenticate.verifyUser,(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            // authenticate.getUserId(req,res,(userId) =>{
            //     console.log('returned from authenticate.getUserId fn')
                if(dish.comments.id(req.params.commentId).author == req.user._id){
                    dish.comments.id(req.params.commentId).remove(); //remove comment by id
    
                }else{
                    err = new Error('The logged in user is not permitted to delete this comment');
                    err.statusCode = 403;
                    return next(err);
                }
            // })
          
          dish.save().then((dish) => {
            Dishes.findById(dish._id)
            .populate('comments.author')
            .then((dish) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(dish); //send back result to client
            })
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
