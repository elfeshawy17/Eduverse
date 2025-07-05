import { model, Schema } from "mongoose";


const lectureSchema= new Schema({
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
        type:String,
    },
    order:{
        type:Number,
        required:true
    }
},{
    timestamps:true,
    versionKey:false
})

lectureSchema.pre(/^find/,function(){
    this.populate("course","title")
})

export const Lecture =model("Lecture",lectureSchema)