import mongoose from "mongoose";
const {Schema, model, Types} = mongoose

const User = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    tasks: [ {type: Types.ObjectId, ref: 'Task'} ]
})

export default model("User" ,User)