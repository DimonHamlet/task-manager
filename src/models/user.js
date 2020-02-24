const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')

const userSchema= new mongoose.Schema({
    name : {
        type: String,
        required: true,
        trim: true
    },
    email : {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
             if (!validator.isEmail(value)) {
                 throw new Error('Enter correct email ')
             }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number!')
            }
        }
    },
    password : {
        type: String,
        required: true,
        trim: true,
        minlength: [6, 'Password must be at least 6 letters'],
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password must not contain word "password"')
            }
        }
    },
    tokens : [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function() {
    const user = this

    const token = jwt.sign({_id: user.id.toString()}, 'secret', {expiresIn: '1 day'})

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.statics.findByEmail = async function (email, password) {

        const user = await User.findOne({email})
        if (!user) {
            throw new Error('Unable to login!')
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            throw new Error('Unable to login')
        }
        return user    
}

const User = mongoose.model('User', userSchema)
// Hashing password before saving
userSchema.pre('save', async function(next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// Delete tasks after user is removed
userSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({
        owner: user._id
    })

    next()
})



module.exports = User