import mongoose from 'mongoose';

const whatsappSchema = mongoose.Schema({
    message: String,
    name: String,
    timestamp: String,
    received: Boolean,
});

export default mongoose.model("messagecontent", whatsappSchema);    //there is not need to create plural form collection but for consistency we will change it same as server.js in changeStream