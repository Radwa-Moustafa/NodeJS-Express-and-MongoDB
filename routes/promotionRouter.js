const express = require('express');
const mongoose = require('mongoose');
const promotionRouter = express.Router();
const authenticate = require('../authenticate');
const Promotions = require('../models/promotions');
promotionRouter.use(express.json());
const cors = require('./cors');

//request chaining (chain all methods to promotionRouter)
promotionRouter.route('/')
.get(cors.cors,authenticate.verifyUser,(req,res,next) => {
    Promotions.find({}) //like DAL operation this.GetAll()
    .then((promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promotions) //send back result to client
    },(err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    Promotions.create(req.body)
    .then((promo) => {
        console.log('Promotion Created ', promo);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promo) //send back result to client
    },(err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation is not suppported on /promotions');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    Promotions.remove({})
    .then((result) => {
        console.log('Promotion Deleted ', result);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(result) //send back result to client
    },(err) => next(err))
    .catch((err) => next(err));
});

promotionRouter.route('/:promotionId')
.get(cors.cors,authenticate.verifyUser,(req,res,next) => {
    Promotions.findById(req.params.promotionId)
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promotion) //send back result to client
    },(err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation is not suppported on /promotions/promotionId');
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    Promotions.findByIdAndUpdate(req.params.promotionId,{$set: req.body},{new:true})
    .then((promotion) => {
        console.log('Promotion Updated ', promotion);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promotion) //send back result to client
    },(err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    Promotions.findByIdAndRemove(req.params.promotionId)
    .then((promotion) => {
        console.log('Promotion Deleted ', promotion);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promotion) //send back result to client
    },(err) => next(err))
    .catch((err) => next(err));
});

module.exports = promotionRouter;
