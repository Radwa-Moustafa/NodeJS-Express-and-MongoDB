const express = require('express');

const dishRouter = express.Router();

dishRouter.use(express.json());

//request chaining (chain all methods to dishRouter)
dishRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next) => {
    res.end('will send all the dishes to you!');
})
.post((req,res,next) => {
    res.end('will add the dish: ' + req.body.name + 
    ' with details: ' + req.body.description);
})
.put((req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation is not suppported on /dishes');
})
.delete((req,res,next) => {
    res.end('deleting all the dishes!');
});

dishRouter.route('/:dishId')
.get((req,res,next) => {
    res.end('will send details of the dish: ' + req.params.dishId
    + ' to you!');
})
.post((req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation is not suppported on /dishes');
})
.put((req,res,next) => {
    res.write('Updating the dish ' + req.params.dishId + '\n');
    res.end('will update the dish ' + req.params.dishId
    +' with details: ' + req.body.description);
})
.delete((req,res,next) => {
    res.end('deleting the dish: ' + req.params.dishId);
});


module.exports = dishRouter;
