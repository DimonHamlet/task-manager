const express = require('express')
require('../db/mongoose')
const User = require('../models/user')

const userRouter = new express.Router()

userRouter.get('/users', async  (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    }
    catch (e) {
        res.status(500).send()
    }
})

userRouter.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }
    catch (error) {
        res.status(400)
        res.send({
            error: error.message
        })
    }
})

userRouter.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).send()
        }
        
        res.send(user)
    }
    catch (e) {
        res.status(500).send({
            error: e
        })
    }
})

userRouter.post('/users/login', async (req ,res) => {
    try {
        const user = await User.findByEmail(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }
    catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})


userRouter.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdate = ['name', 'email', 'password'] 
    const isValidUpdate = updates.every((update) => allowedUpdate.includes(update))
    if (!isValidUpdate) {
        return res.status(400).send({
            error: "Invalid updates"
        })
    }
    try {
        const user = await User.findById(req.params.id)
        updates.forEach((update) => user[update] = req.body[update])
        user.save()
         
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    }
    catch (e) {
        res.status(400).send({
            error: e
        })
    }
})

userRouter.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        if (!user) {
            res.status(404)
            return res.send({
                error: "User not found"
            })
        }
        res.send(user)
    }
    catch (e) {
        res.status(404)
        return res.send({
            error: "User not found"
        })
    }
})



module.exports = userRouter