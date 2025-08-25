import mongoose from "mongoose";

const connectDB=()=>{
    const DATABASE_URL=process.env.DATABASE_URL

    mongoose.connect(DATABASE_URL).then(()=>{
        console.log('database connect')
    }).catch((err)=>{
        console.log(err)
    })
}

export default connectDB;