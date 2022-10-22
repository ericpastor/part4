const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.password || body.password === '') {
    return response.status(400).json({ error: 'password required' })
  }

  if (body.password && body.password.length < 4) {
    return response
      .status(400)
      .json({ error: 'password must be at least 3 characters' })
  }

  if (body.username && body.username.length < 4) {
    return response
      .status(400)
      .json({ error: 'username must be at least 3 characters' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()
  response.json(savedUser)

})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', {
      title:1,
      author:1, 
      url:1, 
      likes:1
    })
    response.json(users)
  })

module.exports = usersRouter