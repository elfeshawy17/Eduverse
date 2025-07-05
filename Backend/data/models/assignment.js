import { model, Schema } from "mongoose";

const assignmentSchema =new Schema({
    course:{
        type:Schema.Types.ObjectId,
        ref:"Course",
        required:true
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    fileUrl:{
        type:String
    },
    duedate:{
        type:Date,
        required:true
    }
},{
    timestamps:true,
    versionKey:false  
})

// assignmentSchema.pre(/^find/,function(){
//     this.populate("course","title")
// });


export const Assignment = model("Assignment",assignmentSchema);