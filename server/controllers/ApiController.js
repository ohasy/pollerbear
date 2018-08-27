const Choice = require("../models/Choice");
const Comment = require("../models/Comment");
//const Poll = require("../models/Poll");
const Poll = require("../models/Poll");
const Vote = require("../models/Vote");
const mongoose = require("mongoose");
const ObjectId = require('mongoose').Types.ObjectId;

const isEmpty = require('../utils/is-empty');
// Add A Poll ...

exports.addPollOld = (req,res)=> {
    const errors = {};
    const pollId = new mongoose.Types.ObjectId();

    let {choices,question} = req.body;

    if(choices){
        choices = JSON.parse(choices);
        console.log("choices",choices);
    }

    if(!question || question.length == 0){
        errors.question="This field shouldn't be left empty."
        return res.status(400).json(errors);
    }
    if(!choices || choices.length < 2){
        errors.choices="There should be atleast two choices";
        return res.status(400).json(errors);
    }
    const validatedChoices = [];

    choices.forEach(choice => {
        if(!choice.text){
            errors.choices="Inavalid Choice";
            return res.status(400).json(errors);
        } 
        const newChoice = new Choice ({
            poll:pollId,
            text:choice.text
        });
        validatedChoices.push(newChoice);
    });

    Choice.insertMany(validatedChoices).then(choices=>{
        console.log("choices",choices);

        const newPoll = new Poll ({
            _id: pollId,
            question:req.body.question,
        })
        newPoll
        .save()
        .then(user => {
            res.json({"success":user})
        })
        .catch(error => {
            res.json({"error":error})
        })

    }).catch(err=>{

    })
}



// Get a poll from id..

exports.getPoll = (req,res)=>{
const errors = {};
const pollId = req.params.pollId;
if(!ObjectId.isValid(pollId)){
    errors.incorrectUserID = "The id is incorrect."
    res.status(400).json(errors);
  }
  Poll.findById(pollId).then(poll=>{
      if(!poll){
          errors.notFound= "Poll not found";
          res.status(400).json(errors);
      }
      res.json({poll});
   }).catch(err=>{
      res.status(400).send(err);
  })
//   Choice.find({poll:req.params.id}).populate({ path: 'poll', select: 'question' }).then(poll=>{
//       if(!poll){
//           errors.notFound= "Poll not found";
//           res.status(400).json(errors);
//       }
//       res.json({"success":poll});
//   }).catch(err=>{
//       res.status(400).send(err);
//   })

}

//  POST :simply let users add a poll with minimum two choices. done
//  GET  :get poll with question, vote counts on choices  done
//  POST :votes can be sent to  the poll id and choice id with some unique identifer (MAC,IP).
//  POST :add Comment to Poll id
//  POST :add choice to poll id

exports.addPoll = (req,res) => {
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
        res.json(newPoll);
    }).catch(err=>{
        res.status(400).send(err);
    })
}

exports.votePoll = (req,res) => {
    const {pollId,choiceId} = req.params;
    if(!ObjectId.isValid(pollId)){
        errors.incorrectUserID = "The poll id is incorrect."
        res.status(400).json(errors);
    }
    if(!ObjectId.isValid(choiceId)){
        errors.incorrectUserID = "The choice id is incorrect."
        res.status(400).json(errors);
      }
    const newVote = {
        mac:"this is mac addres",
        ethMac:"this is eth mac addres",

    };
    Poll.findById(pollId).then(poll=>{
        poll.choices.forEach(choice=>{
            if(choice._id == choiceId){
                choice.push(newVote);
            }
        })
    }).catch(err=>{
        //err code
    })
    // Poll.findById(,{
        
    //     "$push":{"votes":newVote}
    // },{
    //     "new":true
    // }).the
}