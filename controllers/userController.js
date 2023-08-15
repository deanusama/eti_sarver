import User from "../model/userModel.js";
import { StatusCodes } from "http-status-codes";



export const registerUser = async (req, res) => {
    // const { name, email, password } = req.body

    // console.log(name, email, password);
    console.log(req.body);
    // try {
    //     const userAlreadyExist = await User.findOne({ email })

    //     if (userAlreadyExist) {
    //         throw new Error('Email is already in use')
    //     }

    const user = await User.create(req.body)
    //     const token = await user.createJWT()


    res.status(StatusCodes.OK).json({ user })
    // } catch (error) {
    //     res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message })
    // }

}

export const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {

        const user = await User.findOne({ email })
        
        if (!user) {
            throw new Error("Incorrect email or password")
        }

        if (password !== user.password) {
            throw new Error('Incorrect email or password')
        }

        const token = await user.createJWT()
        user.password = undefined

        res.status(StatusCodes.OK).json({ user, token })
        
        
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message })

    }

}