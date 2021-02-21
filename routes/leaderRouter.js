const express = require('express');

const leaderRouter = express.Router();

leaderRouter.use(express.json());

//request chaining (chain all methods to leaderRouter)
leaderRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next) => {
    res.end('will send all the leaders to you!');
})
.post((req,res,next) => {
    res.end('will add the leader: ' + req.body.name + 
    ' with details: ' + req.body.description);
})
.put((req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation is not suppported on /leaders');
})
.delete((req,res,next) => {
    res.end('deleting all the leaders!');
});

leaderRouter.route('/:leaderId')
.get((req,res,next) => {
    res.end('will send details of the leader: ' + req.params.leaderId
    + ' to you!');
})
.post((req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation is not suppported on /leaders');
})
.put((req,res,next) => {
    res.write('Updating the leader ' + req.params.leaderId + '\n');
    res.end('will update the leader ' + req.params.leaderId
    +' with details: ' + req.body.description);
})
.delete((req,res,next) => {
    res.end('deleting the leader: ' + req.params.leaderId);
});


module.exports = leaderRouter;
