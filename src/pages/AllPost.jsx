import React, { use, useEffect, useState } from 'react'
import dbService from '../appwriteService/dbService'
import { Container, PostCard } from '../Components';

const AllPost = () => {

  const [posts , setPost] = useState([]);

  useEffect(() => {
     dbService.getAllPost([]).then((posts) => {
        if(posts){
            setPost(posts.documents)

        }
     })
  }, [])

  return (
    <div className='w-full py-8'>
      <Container>
        <div className='flex flex-wrap'>
             {posts && posts.map((post) => (
                 <div key={post.$id} className='p-2 w-1/4'>
                    <PostCard {...post}/>
                 </div>
             ))}
        </div>
      </Container>
    </div>
  )
}

export default AllPost
