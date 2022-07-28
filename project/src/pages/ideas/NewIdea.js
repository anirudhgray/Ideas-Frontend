import React, { useEffect, useState, useCallback } from 'react'
import axios from '../../axios'
import IdeaCard from '../../components/IdeaCard'
import { useSelector } from 'react-redux'

export default function NewIdea () {
  const [title, setTitle] = useState('')
  const [description, setDesc] = useState('')
  const [tags, setTags] = useState('')
  const [userIdeas, setUserIdeas] = useState([])

  const auth = useSelector(state => state.auth)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const tagList = tags.split(',')
    const postObject = {
      idea: {
        title,
        description,
        tags: tagList
      }
    }
    await axios
      .post('/ideas', postObject, {
        headers: {
          authorization: auth.token
        }
      })
      .then(res => {
        setDesc('')
        setTitle('')
        setTags('')
        fetchUserPosts()
      })
      .catch(e => console.log(e))
  }

  const fetchUserPosts = useCallback(
    async () => {
      await axios
        .get(`/ideas/user/${auth._id}`, {
          headers: {
            authorization: auth.token
          }
        })
        .then((res) => {
          console.log(res.data)
          setUserIdeas(res.data.ideas)
        })
        .catch(e => console.log(e))
    }, [auth]
  )

  useEffect(() => {
    if (auth.token) {
      fetchUserPosts()
    }
  }, [auth, fetchUserPosts])

  return (
    <div>
      <div className='mt-6 grid gap-3 relative'>
        <div className='xl:w-4 lg:w-6 md:w-7 sm:w-8 w-12'>
          <h1 className='lg:text-4xl md:text-3xl text-2xl font-medium'>Add an Idea</h1>
          <form onSubmit={handleSubmit} className='md:p-5 p-2 flex flex-column gap-3 mt-3'>
            <label className='relative' htmlFor='title-input'>
              <img className='absolute' style={{ top: '-0.5rem', left: '-0.7rem' }} src={require('../../assets/drawCircle1.svg').default} alt='stroke' />
              Title
            </label>
            <input value={title} onChange={(e) => { setTitle(e.target.value) }} className='input' id='title-input' />
            <label htmlFor='desc-input'>Description</label>
            <textarea value={description} onChange={(e) => { setDesc(e.target.value) }} rows={5} className='input' id='desc-input' />
            <label htmlFor='tag-input'>Tags</label>
            <input value={tags} onChange={(e) => { setTags(e.target.value) }} className='input' id='tag-input' />
            <button disabled={!title || !description || !tags} className={((!title || !description || !tags) ? 'disabled-button' : null) + ' primary-button mx-auto mt-5'}>Submit</button>
          </form>
        </div>
        <img src={require('../../assets/frame.png')} alt='frame' className='absolute h-3rem top-0 right-0 frame-position sm:block hidden' />
        <img src={require('../../assets/plant1.png')} alt='frame' className='absolute h-7rem bottom-0 right-0 mb-3 sm:block hidden' />
        <img src={require('../../assets/addIdeaPerson.png')} className='h-20rem hidden md:block absolute bottom-0 right-0 lg:mr-8 md:mr-5 mb-2 sm:block hidden' alt='addIdeaPerson' />
      </div>
      <img src={require('../../assets/shelf.png')} alt='frame' className='absolute h-10rem top-0 right-0 shelf-position sm:block hidden' />
      <img src={require('../../assets/plant2.png')} alt='frame' className='absolute h-7rem left-0 top-0 plant2-position md:block hidden' />
      <div className='mt-8 grid gap-4'>
        <div className='md:col-4 h-min col-12 md:sticky top-0'>
          <h1 className='lg:text-4xl md:text-3xl text-2xl relative font-medium'>
            Your previous Ideas
            <img className='absolute lg:block md:hidden block' style={{ top: '2.7rem', left: '5.2rem' }} src={require('../../assets/drawUnderline1.svg').default} alt='stroke' />
          </h1>
          <p className='mt-4 font-16 bodytext'>This is a paragraph with more information about something important. This something has many uses and is made of 100% recycled material.</p>
        </div>
        <div className='md:col md:mt-8 mt-2 col-12 flex flex-column gap-5'>
          {userIdeas.map((idea, index) => {
            return <IdeaCard key={index} name={idea.title} description={idea.description} author='You' tags={idea.tags} date={idea.createdOn} ideaId={idea._id} hearted={idea.upvotes.includes(auth._id)} upvoteCount={idea.upvotes.length} />
          })}
        </div>
        {/* <div className='grid gap-4 mt-4'>
          <div className='md:col-4 col-12 top-0 md:sticky h-min'>
          </div>
          <div className='md:col col-12 flex flex-column gap-5'>
            {userIdeas.map((idea, index) => {
              return <IdeaCard key={index} name={idea.title} description={idea.description} author='You' tags={idea.tags} date={idea.createdOn} ideaId={idea._id} />
            })}
          </div>
        </div> */}
      </div>
    </div>
  )
}
