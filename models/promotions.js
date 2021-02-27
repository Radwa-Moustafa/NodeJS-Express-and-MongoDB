const mongoose =  require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const promotionSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    designation:{
        type: String,
        required: true
    },
    abbr:{
        type: String
    }
},{
    timestamps: true
}); 

var Promotions = mongoose.model('Promotion', promotionSchema);

module.exports = Promotions;