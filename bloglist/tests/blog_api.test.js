const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/Blog')
const api = supertest(app)
const helper = require('../utils/blog_helper')
const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt')
const User = require('../models/User')

beforeEach(async () => {

  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash(helper.initialUser.password, 10)

  const user = new User({ 
    "username": helper.initialUser.username,
    "name": helper.initialUser.name,
     passwordHash })
     
  const userForToken = {
    username: user.username,
    id: user._id,
    }
  
  token = jwt.sign(userForToken, process.env.SECRET)
     
  await user.save()

  await Blog.insertMany(
  helper.listInitialBlogs.map((blog)=>({...blog, user: user._id}))
  )
 
})


describe('when come blogs created at the beggining', ()=>{
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test ('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.listInitialBlogs.length)
  }) 

  test ('check that id is not undefined', async () => {
    const response = await api.get('/api/blogs')
    const ids = response.body.map(response => response.id)
    expect(ids[0]).toBeDefined()
  })
})

describe('When adding a new blog:', () => {
  test ('valid blog can be added', async () =>{
    const newBlog = {
      title: "Test title",
      author: "Test Name",
      url: "http:test",
      likes: 1,      
    }

    await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.listInitialBlogs.length + 1)
    const titles = blogsAtEnd.map((blog) => blog.title)
    expect(titles).toHaveLength(helper.listInitialBlogs.length + 1)
    expect(titles).toContain("Test title")
  })
  test ('likes property is missing from the request, it will default to the value 0', async () =>{
    const newBlogProperty = {
      title: "Test title NO Likes",
      author: "Test Name NO likes",
      url: "http:test NO likes",    
    }

    await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlogProperty)
    .expect(201)
    .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    
    expect(response.body).toHaveLength(helper.listInitialBlogs.length + 1)
    expect(response.body[helper.listInitialBlogs.length].likes).toBe(0)
  })
  test ('properties missing, response 400 bad request', async () =>{
    const newBlog = {
    url: "http:test NO properties",
    likes: 1,   
    }

    await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(400)
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.listInitialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.listInitialBlogs.length - 1
    )

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('updating likes of a blog', () => {
  test('succeeds with status code 200 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({likes: 45})
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    const blogUpdated = blogsAtEnd[0]

    expect(blogsAtEnd).toHaveLength(helper.listInitialBlogs.length)

    expect(blogUpdated.likes).toBe(45)
  })
})


describe('when there is initially one user in db', () => {
  
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'UserTest',
      name: 'NameTest',
      password: 'passwordTest',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  
  })
})

  afterAll(() => {
    mongoose.connection.close()
  })


