const mongoose = require("mongoose");
const Schema = mongoose.Schema;


//The Poll Schema -->

const CommentSchema = new Schema({
        poll:{
            type:Schema.Types.ObjectId,ref:'Poll'
        },
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
        
}, { timestamps: true })

module.exports = Comment = mongoose.model("Comment",CommentSchema);  