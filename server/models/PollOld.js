const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Choice = require("./Choice");
const Comment = require("./Comment");
const Vote = require("./Vote");


//The Poll Schema -->

const PollSchema = new Schema({
    _id: Schema.Types.ObjectId,
    question:{
        type: String,
        required: true,
        max: 400
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
                default:0
            }
        }
    ],
    comments:[
        {
            name:{
                type:String,
                required:true
            },
            comment:{
                type:String,
                required:true
            }

        }
    ]
}, { timestamps: true })

module.exports = Poll = mongoose.model("Poll",PollSchema);


    // polls:[
    //     {
    //         vote:{
    //             type: Number,
    //             required:true
    //         },
    //         mac:{  // mac address of user 
    //             type: String,
    //             required:true
    //         },
    //         ethMac:{  // ethernet mac adress of user
    //             type: String,
    //             required:true
    //         },
    //         privateIp:{
    //             type:String,
    //             required:true
    //         }
    //     }
    // ],
    // comments:[
    //     {
    //         name:{
    //             type: String,
    //             min:2,
    //             max:40
    //         },
    //         message:{
    //             type:String,
    //             min:2,
    //             max:40,
    //             required:true
    //         },
    //         date:{
    //             type: Date,
    //             default: Date.now
    //         }
    //     }
    // ]