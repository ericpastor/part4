const blogsRouter = require('express').Router()
const Blog = require('../models/Blog')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {

  const blogs = await Blog.find({}).populate('user',{
    username:1, 
    name:1,
  })
    response.json(blogs)
  })

  const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      return authorization.substring(7)
    }
    return null
  }
  
blogsRouter.post('/', async (request, response) => { 

 const body = request.body

 const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)


 const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,  
    user: user._id
  })  
  
  if (!request.body.title || !request.body.author) {
    return response.status(400).json({ error: 'property missing' })
  }  
 
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
  }
 
)

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    })


blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const id = request.params.id
  const blog = {
   likes: body.likes
  }

 const blogUpdated = await Blog.findByIdAndUpdate(id, blog, { new: true })
    blogUpdated 
      ? response.status(200).json(blogUpdated.toJSON())
      : response.status(404).end()
    
})



module.exports = blogsRouter