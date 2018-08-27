const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ChoiceSchema = new Schema({
    poll:{
        type:Schema.Types.ObjectId,ref:'Poll'
    },
    text:{
        type: String,
        required:true
    },
    votes:[
        {
            type:Schema.Types.ObjectId,ref:'Vote'
        }
    ]
})

module.exports = Choice = mongoose.model("Choice",ChoiceSchema);