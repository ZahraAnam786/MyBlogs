import React, { useEffect, useState } from 'react'
import dbService from '../appwriteService/dbService'
import { useNavigate, useParams } from 'react-router-dom'
import { Container, PostForm } from '../Components'


const EditPost = () => {

    const [post , setPost] = useState(null)
    const navigate = useNavigate();
    const {slug} = useParams()

    useEffect(() => {
      dbService.getPostByID(slug).then((post) => {
        if(post){
            setPost(post);
        }else{
            navigate('/');
        }
      })
    }, [navigate, slug])

  return post ? (
    <div className='py-8'>
      <Container>
        <PostForm post={post}/>
      </Container>
    </div>
  ) : null
}

export default EditPost
