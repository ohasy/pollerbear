const mongoose = require("mongoose");
const Schema = mongoose.Schema;


//The Poll Schema -->

const VoteSchema = new Schema({
    choice:{
        type:Schema.Types.ObjectId, ref:'Choice'
    },
    // poll:{
    //     type:Schema.Types.ObjectId, ref: 'Poll'
    // },
    mac:{  // mac address of user 
        type: String,
        //required:true
        },
    ethMac:{  // ethernet mac adress of user
        type: String,
        //required:true
        },
    privateIp:{
        type:String,
        //required:true
        }
        
})

module.exports = Vote = mongoose.model("Vote",VoteSchema);  