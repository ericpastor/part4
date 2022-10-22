const Blog = require('../models/Blog')
const User = require('../models/User')


const listWithZeroBlogs = []

const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  const listWithAllBlogs = [
    {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      id: "6339dacd59bd35765d3e4962"
    },
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      id: "6339dad259bd35765d3e4964"
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      id: "6339dade59bd35765d3e4966"
    },
    {
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      id: "6339dafe59bd35765d3e4968"
    },
    {
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      id: "6339db1f59bd35765d3e496a"
    },
    {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      id: "6339db2459bd35765d3e496c"
    }
  ]

  const listInitialBlogs = [
    {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7, 
    
    },
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
  
    }
    
  ]
  const initialUser = { 
    username: "UserTest",
    name: "NameTest",
    password: "passwordTest" 
  }

  const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
  }

  const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }

  module.exports = {
    listWithZeroBlogs, 
    listWithOneBlog, 
    listWithAllBlogs,
    listInitialBlogs,
    initialUser,
    blogsInDb,
    usersInDb

  }