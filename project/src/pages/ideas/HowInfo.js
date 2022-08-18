import React, {useEffect} from 'react'
import { Link } from 'react-router-dom'

export default function HowInfo() {
  useEffect(() => {
    window.scrollTo(0, 0);
  },[])
  return (
    <div>
      <img src={require('../../assets/hanging-lights.png')} alt='lights' className='absolute h-10rem top-0 right-0 hanging-lights-position sm:block hidden' />
      <img src={require('../../assets/redline.png')} alt='line1' className='absolute line redline top-0 right-0' />
      <img src={require('../../assets/blueline.png')} alt='line2' className='absolute line blueline top-0 right-0' />
      <div className="flex flex-column gap-8 mt-8">
        <div className='flex flex-column relative'>
          <p className='absolute font-118 top-0 left-0 how-number red'>1</p>
          <h1 className='relative z-2 font-24 static'>SUBMIT YOUR IDEA</h1>
          <p className='md:w-8 w-12 mx-auto bodytext md:mt-3 mt-6'>This is a paragraph with more information about something important. This something has many uses and is made of 100% recycled material. This is a paragraph with more information about something important. </p>
        </div>
        <div className='flex flex-column relative'>
          <p className='absolute font-118 top-0 right-0 how-number-right blue'>2</p>
          <h1 className='text-right relative z-2 font-24 static'>IDEA UNDER REVIEW</h1>
          <p className='md:w-8 w-12 mx-auto bodytext md:mt-3 mt-6 text-right'>This is a paragraph with more information about something important. This something has many uses and is made of 100% recycled material. This is a paragraph with more information about something important. </p>
        </div>
        <div className='flex flex-column relative'>
          <p className='absolute font-118 top-0 left-0 how-number green'>3</p>
          <h1 className='relative z-2 font-24 static'>IDEA SHORTLISTED</h1>
          <p className='md:w-8 w-12 mx-auto bodytext md:mt-3 mt-6'>This is a paragraph with more information about something important. This something has many uses and is made of 100% recycled material. This is a paragraph with more information about something important. </p>
        </div>
        <div className='flex flex-column relative'>
          <p className='absolute font-118 top-0 left-50 how-number yellow'>4</p>
          <h1 className='relative z-2 font-24 static text-center'>START BUILDING</h1>
          <p className='md:w-8 w-12 mx-auto bodytext mt-6 text-center'>This is a paragraph with more information about something important. This something has many uses and is made of 100% recycled material. This is a paragraph with more information about something important. </p>
        </div>
        <div className='flex flex-column align-items-center'>
          <p>What are you waiting for? Let's get started.</p>
          <Link to='/ideas/new'>
            <button className='primary-button mt-5 font-20'>Add an Idea</button>
          </Link>
        </div>
      </div>
    </div>
  )
}
