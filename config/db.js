const mongoose=require('mongoose');

const connectDB= async()=>{
    try {
        const connet= await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
          
        });
        console.log(" DB Connected");
    } catch (err) {
        console.log(err.message,"|| Err");
        process.exit();
    }
}

module.exports = connectDB