const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ObjectId = require('mongoose').Types.ObjectId;

// const Choice = require("../../models/Choice");
// const Comment = require("../../models/Comment");
const Poll = require("../../models/PollOld");
// const Vote = require("../../models/Vote");

const session = require('express-session');
router.use(session({
    //secret: cookie_secret,
    //name: cookie_name,
    //store: sessionStore, // connect-mongo session store
    secret:"awdasd1Z2asd",
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

const isEmpty = require('../../utils/is-empty');


//const ApiController = require("../../controllers/ApiController")

// router.post('/add',ApiController.addPoll);

// router.get('/:pollId',ApiController.getPoll);

// router.post('/poll/:pollId/:choiceId',ApiController.votePoll);
router.get('/',((req,res)=>{
    res.render('index');
}))
router.post('/add',((req,res)=>{
    const errors = {};

    if(isEmpty(req.body.question)){
        errors.invalidQuestion = "Please Enter a valid question";
        return res.status(400).json(errors)
    }
    if(isEmpty(req.body.choices) || !Array.isArray(JSON.parse(req.body.choices))){
        errors.invalidChoices = "Please Enter valid choices for your question";
        return res.status(400).json(errors)
    }

    const choicesArray = JSON.parse(req.body.choices);
    //const choicesArray = req.body.choices;
    if( choicesArray.length <2 ){
        errors.invalidChoices = "Please Enter atleast two choices for your question";
        return res.status(400).json(errors)
    }
    
    choicesArray.forEach(item=>{
        if(isEmpty(item)){
            errors.invalidChoices = "Please Enter valid choices for your question";
            return res.status(400).json(errors)
        }
       item._id = new ObjectId();
    })
    const newPoll = new Poll({
        _id: new ObjectId(),
        question:req.body.question,
        choices:choicesArray
    })

    newPoll.save().then(poll=>{
        if(!poll){
            errors.unableToSave = "couldn't save the poll"
            res.status(400).json(errors);
        }
        //res.render
        res.json(newPoll);
    }).catch(err=>{
        res.status(400).send(err);
    })
}));



// vote for the poll
router.post('/vote',((req,res)=>{

    /*
     * req.body [ poll_id, choice_id, mac ]
     * res.json ["Success: Poll with updated votes"]
     */

     const errors = {};
     const poll_id = req.body.poll_id;
     const choice_id = req.body.choice_id;


     if(isEmpty(poll_id) || !ObjectId.isValid(poll_id)){
        errors.invalidQuestion = "Please Select a valid question";
        return res.status(400).json(errors);
     }
     else if(isEmpty(choice_id) || !ObjectId.isValid(choice_id)){
        errors.invalidChoices = "Please Select a valid choice";
        return res.status(400).json(errors);
     }
     /**** Commented because want to test stuff over and over agian.
    //Checking User Session --->

    //if user is first time on app
    if(!req.session.answerdPolls)  req.session.answerdPolls = [poll_id];

     // if user is voting again on same poll
    else if(req.session.answerdPolls && req.session.answerdPolls.includes(poll_id)) 
        return res.status(400).send("You have already voted");

    // if user is coming second time on app but on different poll
    else   req.session.answerdPolls.push(poll_id);
    */  
    Poll.findOneAndUpdate(
        {
        _id: {$eq: poll_id},
       choices:{$elemMatch:{_id: {$eq: choice_id}}}
    },{$inc:{'choices.$.votes':1}},{new:true}
    ).then(poll=>{
            res.json(poll)
        }).catch(err=>{
            res.status(400).send(err);
        })
}))

router.all('/:poll_id',((req,res)=>{

    /*
     * req.params [ poll_id ]
     * res.json ["Success: poll, pollId incorrect "]
     */

    const errors = {};
    const poll_id = req.params.poll_id;
    const resInJSON = req.body.json;

    if(isEmpty(poll_id) || !ObjectId.isValid(poll_id)){
       errors.invalidPollId = "Please Select a valid poll id";
       return res.status(400).json(errors);
    }
    Poll.findById(poll_id).then(poll=>{

        if(!poll){
            errors.pollNotFound = "Poll doesn't exists.";
        }
        // let data = {poll};
        // if(req.session.answerdPolls && req.session.answerdPolls.includes(poll_id)) 
        // data.voted = true;
        // else 
        // data.voted = false;
        // console.log("data",data);
        if(resInJSON){
            return res.json(poll);
        }
        res.render('answer',{data:poll});
        //res.json(data);
    }).catch(err=>{
        res.status(500).json({"crappp":err});
    })
}))




module.exports = router;