const express = require('express')
require('../db/mongoose')
const auth = require('../middleware/auth')
const Task = require('../models/task')

const taskRouter = new express.Router()

taskRouter.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        })
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

taskRouter.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
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

taskRouter.patch('/tasks/:id', auth,  async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdate = ['description', 'completed'] 
    const isValidUpdate = updates.every((update) => allowedUpdate.includes(update))
    if (!isValidUpdate) {
        return res.status(400).send({
            error: "Invalid updates"
        })
    }
    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    }
    catch (e) {
        res.status(400).send({
            error: e
        })
    }
})

taskRouter.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
    const task = await Task.findOne({_id, owner: req.user._id})

        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    }
    catch (error) {
        res.status(404).send()
    }
})

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
taskRouter.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        //const tasks = await Task.find({owner: req.user._id})
        res.send(req.user.tasks)
    }
    catch (error) {
        res.status(404).send()
    }
})

module.exports = taskRouter