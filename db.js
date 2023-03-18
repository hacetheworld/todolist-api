const mongoose =require("mongoose");
const mongoString = process.env.DATA_BASE_URL
// console.log(mongoString,"mongoString");
mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

