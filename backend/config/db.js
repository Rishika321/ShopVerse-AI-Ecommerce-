// const mongoose = require("mongoose");

// const connectDB = () => {
//     mongoose.connect(process.env.MONGO_URI)
//         .then(() => console.log("MongoDB Connected"))
//         .catch((err) => console.log(err));
// };

// module.exports = connectDB;



const mongoose = require("mongoose");

const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI)
        .then(async () => {
            console.log("MongoDB Connected to DB:", mongoose.connection.name, "on host:", mongoose.connection.host);
            const count = await mongoose.connection.db.collection("products").countDocuments();
            console.log("Products in this DB:", count);
        })
        .catch((err) => console.log(err));
};

module.exports = connectDB;