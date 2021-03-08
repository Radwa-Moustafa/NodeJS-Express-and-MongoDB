const express = require('express');

const leaderRouter = express.Router();
const Leaders = require('../models/leaders');
const authenticate = require('../authenticate');
leaderRouter.use(express.json());
const cors = require('./cors');

//request chaining (chain all methods to leaderRouter)
leaderRouter.route('/')
.get(cors.cors,(req,res,next) => {
    Leaders.find({}) //like DAL operation this.GetAll()
    .then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders) //send back result to client
    },(err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    Leaders.create(req.body)
    .then((leader) => {
        console.log('Leader Created ', leader);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leader) //send back result to client
    },(err) => next(err))
    .catch((err) => next(err))
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation is not suppported on /leaders');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
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
.get(cors.cors,(req,res,next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leader) //send back result to client
    },(err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation is not suppported on /leaders/leaderId');
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId,{$set: req.body},{new:true})
    .then((leader) => {
        console.log('Leader Updated ', leader);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leader) //send back result to client
    },(err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
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
