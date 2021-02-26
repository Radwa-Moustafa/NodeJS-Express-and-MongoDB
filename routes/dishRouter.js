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
        console.log('Dish Created ', result);
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
        console.log('Dish Created ', dish);
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
    res.end('POST operation is not suppported on /dishes');
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


module.exports = dishRouter;
