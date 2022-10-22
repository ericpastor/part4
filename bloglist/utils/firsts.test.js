const listHelper = require('./list_helper')
const {listWithAllBlogs, listWithOneBlog, listWithZeroBlogs} = require('./blog_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
    
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  
  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listWithAllBlogs)
    expect(result).toBe(36)
    })

   
  test('of empty list is zero', () => {
   const result = listHelper.totalLikes(listWithZeroBlogs)
   expect(result).toBe(0)
    })
  
})

describe('favorite blog', () => {
    
  test('with more likes' , () => {
    const result = listHelper.favoriteBlog(listWithAllBlogs)
    expect(result).toEqual({
      title:"Canonical string reduction", 
      author: "Edsger W. Dijkstra", 
      likes: 12
  })
  
  })
})

