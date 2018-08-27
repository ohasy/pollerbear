const mongoose = require("mongoose");
const Schema = mongoose.Schema;


//The Poll Schema -->

const PollSchema = new Schema({
    _id: Schema.Types.ObjectId,
    question:{
        type: String,
        required: true,
        max: 400
    },
    commentEnabled:{
        type:Boolean,
        required:true,
        default:true
    },
    addChoicesEnabled:{
        type:Boolean,
        required:true,
        default:false
    },
    choices:[
        {
            _id: Schema.Types.ObjectId,
            text:{
                type: String,
                required:true
            },
            votes:{
                type:Number,
                required:true
            }
        }
    ],
    // choices : [
    //     {
    //     _id: Schema.Types.ObjectId,
    //     text:{
    //         type: String,
    //         required:true
    //     },
    //     votes:[ // the length of this array will be it.
    //         {   
    //             mac:{  // mac address of user 
    //                 type: String,
    //                 //required:true
    //                 },
    //             ethMac:{  // ethernet mac adress of user
    //                 type: String,
    //                 //required:true
    //                 },
    //             privateIp:{
    //                 type:String,
    //                 //required:true
    //                 }
    //         },
    //     ]
    //     },
    // ],
    comments: [
        {
            _id: Schema.Types.ObjectId,
            name:{
                type: String,
                min:2,
                max:40
            },
            message:{
                type:String,
                min:2,
                max:40,
                required:true
            }
        }
    ]
}, { timestamps: true })

module.exports = Poll = mongoose.model("Poll",PollSchema);

//changed the vote field
// I will go back to making separate schema for votes, 
// since they are to be unique for the question , not just for a choice.