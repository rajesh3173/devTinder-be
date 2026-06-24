const mongoose = require("mongoose");

const userName = "ruttalarajesh111_db_user";
const password = "vN3q9dBesmRdho3E";
const dbName = "devTinder";

const uri = `mongodb+srv://${userName}:${password}@namastenodejscluster.ncdg9wq.mongodb.net/${dbName}`;

const connectDb = async () => {
  await mongoose.connect(uri);
};

module.exports = { connectDb };
