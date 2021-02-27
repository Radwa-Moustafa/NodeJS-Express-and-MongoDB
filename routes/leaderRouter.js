const express = require('express');

const leaderRouter = express.Router();

const Leaders = require('../models/leaders');
leaderRouter.use(express.json());

//request chaining (chain all methods to leaderRouter)
leaderRouter.route('/')
.get((req,res,next) => {
    Leaders.find({}) //like DAL operation this.GetAll()
    .then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders) //send back result to client
    },(err) => next(err))
    .catch((err) => next(err));
})
.post((req,res,next) => {
    Leaders.create(req.body)
    .then((leader) => {
        console.log('Leader Created ', leader);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leader) //send back result to client
    },(err) => next(err))
    .catch((err) => next(err))
})
.put((req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation is not suppported on /leaders');
})
.delete((req,res,next) => {
    Leaders.remove({})
    .then((result) => {
        console.log('Leader Deleted ', result);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(result) //send back result to client
    },(err) => next(err))
    .catch((err) => next(err));
});

leaderRouter.route('/:leaderId')
.get((req,res,next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leader) //send back result to client
    },(err) => next(err))
    .catch((err) => next(err));
})
.post((req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation is not suppported on /leaders/leaderId');
})
.put((req,res,next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId,{$set: req.body},{new:true})
    .then((leader) => {
        console.log('Leader Updated ', leader);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leader) //send back result to client
    },(err) => next(err))
    .catch((err) => next(err));
})
.delete((req,res,next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((leader) => {
        console.log('Leader Deleted ', leader);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leader) //send back result to client
    },(err) => next(err))
    .catch((err) => next(err));
});


module.exports = leaderRouter;
