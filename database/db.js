
const mongoose = require("mongoose");


function connect_db(uri) {
    mongoose
        .connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("DB Connected");
        })
        .catch((err) => console.log(err));
}


module.exports = { connect_db };




