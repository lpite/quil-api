import { model, Schema } from "mongoose";


interface User{
    username:string,
    rating:number
}


const userSchema = new Schema<User>({
    username:{
        type:String,
        required:true,
        unique:true
    },
    rating:{
        type:Number,
        default:1000
    }
});

export const userModel = model("users", userSchema);
