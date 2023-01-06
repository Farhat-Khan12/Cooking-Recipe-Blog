const mongoose = require("mongoose");
const recipeSchema = new mongoose.Schema({
    name:{
        type: String, required: "This is a required field."
    },
    image:{
        type: String, required: "This is a required field."
    },
    description:{
        type: String, required: "This is a required field."
    },
    email:{
        type: String, required: "This is a required field."
    },
    ingredients:{
        type: Array, required: "This is a required field."
    },
    category:{
        type: String, 
        enum: ['Indian','Thai','American','Chinese','Mexican','Spanish','Italian','South Indian','Japanese','Indonesian'],
        required: "This is a required field."
    },
});
recipeSchema.index({name: 'text', description: 'text'});
//reipeSchema.index({"$**" : "text"});
module.exports = mongoose.model('Recipe', recipeSchema);