const express = require('express');

const promotionRouter = express.Router();

promotionRouter.use(express.json());

//request chaining (chain all methods to promotionRouter)
promotionRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next) => {
    res.end('will send all the promotions to you!');
})
.post((req,res,next) => {
    res.end('will add the promotion: ' + req.body.name + 
    ' with details: ' + req.body.description);
})
.put((req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation is not suppported on /promotions');
})
.delete((req,res,next) => {
    res.end('deleting all the promotions!');
});

promotionRouter.route('/:promotionId')
.get((req,res,next) => {
    res.end('will send details of the promotion: ' + req.params.promotionId
    + ' to you!');
})
.post((req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation is not suppported on /promotions');
})
.put((req,res,next) => {
    res.write('Updating the promotion ' + req.params.promotionId + '\n');
    res.end('will update the promotion ' + req.params.promotionId
    +' with details: ' + req.body.description);
})
.delete((req,res,next) => {
    res.end('deleting the promotion: ' + req.params.promotionId);
});


module.exports = promotionRouter;
