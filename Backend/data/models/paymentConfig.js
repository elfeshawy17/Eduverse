import { model, Schema } from "mongoose";


const configSchema = new Schema({
    hourRate: {
        type: Number,
        required: true,
        min: 1
    },
    term: {
        type: Number, 
        required: true,
    }
}, {
    timestamps:true,
    versionKey:false
});

export const Config = model("Config", configSchema);