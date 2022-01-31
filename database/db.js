
const mongoose = require("mongoose");

const uri = "mongodb://127.0.0.1:27017/NodeJS";



mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("DB Connected");
    })
    .catch((err) => console.log(err));


