const mongoose = require('mongoose');

const db = "mongodb+srv://mark4245:iforgot4245@cluster0.xg8uz.mongodb.net/Animetable?retryWrites=true&w=majority";

mongoose
    .connect(db)
    .then(() => {
        console.log("Connected to database");
    }
    )
    .catch(() => {
        console.log("Error Connecting to database");
    }
    )

    const animeSchema = new mongoose.Schema({
         mal_id:{type: String},
         url: {type: String},
         title: {type:String}, 
         image_url: {type:String}, 
         episodes: {type:String}, 
         score: {type:String},
         members: {type:String},
         rank: {type:String},
         synopsis: {type:String}
    
    }
    
    );
    
    
    const Record = mongoose.model('animes', animeSchema);
    
    module.exports = Record;