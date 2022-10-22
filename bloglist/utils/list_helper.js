const dummy = (blogs) => {
    return 1
  }
  
 

  const totalLikes = (blogs) => {
    const reducer = (sum, amount)=>{
      return sum + amount.likes
    }
    return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0) 
}

const favoriteBlog = (blogs) =>{
  const favorite = blogs.reduce(function(prev, current) {
    return (prev.likes > current.likes) ? prev : current
})
  console.log(favorite)
   return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
   }
   
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}