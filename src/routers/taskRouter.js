const express = require('express')
require('../db/mongoose')
const Task = require('../models/task')

const taskRouter = new express.Router()

taskRouter.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) {
            return res.status(404).send()
        }
        
        res.send(task)
    }
    catch (e) {
        res.status(500).send({
            error: e
        })
    }
})

taskRouter.post('/tasks', async (req, res) => {
    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).send(task)
    }
    catch (error) {
        res.status(400)
        res.send({
            error: error.message
        })
    }
})

taskRouter.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdate = ['description', 'completed'] 
    const isValidUpdate = updates.every((update) => allowedUpdate.includes(update))
    if (!isValidUpdate) {
        return res.status(400).send({
            error: "Invalid updates"
        })
    }
    try {
        const task = await Task.findById(req.params.id)
        updates.forEach((update) => task[update] = req.body[update])

        task.save()

        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    }
    catch (e) {
        res.status(400).send({
            error: e
        })
    }
})

taskRouter.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findById(_id)
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    }
    catch (error) {
        res.status(404).send()
    }
})

taskRouter.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    }
    catch (error) {
        res.status(404).send()
    }
})

module.exports = taskRouter