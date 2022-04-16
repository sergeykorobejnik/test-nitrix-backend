import mongoose from "mongoose";
const {Schema, model, Types} = mongoose

// Task state:
// 0 - pending
// 1 - done
//

const Task = new Schema({
    state: {
        type: Number,
        min: [0, 'Unexpected error due task state'],
        max: [1, 'Unexpected error due task state'],
        required: true
    },
    title: {
        type: String,
        minLength: [3, 'Error at string length'],
        maxLength: [255, 'Error at string length'],
        required: true
    },
    user: {
        type: Types.ObjectId,
        ref: "User"
    }
})

export default model('Task', Task)