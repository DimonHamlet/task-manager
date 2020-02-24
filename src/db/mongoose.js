const mongoose = require('mongoose')

const db_url = process.env.MONGODB_URL.toString()

mongoose.connect( db_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).catch((error) => {
    console.log("Unable to connect to db server")
})



