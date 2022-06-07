import Head from 'next/head'
import styles from '../styles/Home.module.css'
import axios from 'axios'

import { GoogleLogin } from '@react-oauth/google'

export default function Home () {
  return (
    <div className={styles.container}>
      <Head>
        <title>DSC Ideas Hub</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <GoogleLogin
        onSuccess={async (res) => {
          await axios
            .post('https://ideas-backend-v2.herokuapp.com/auth/google', {
              token: res.credential
            })
            .then(res => {
              console.log(res.data)
            })
        }}
      />

      <div className={`${styles.hero} w-8`}>
        <h1 className='text-7xl'>
          DSC Idea
        </h1>
        <h1 className='text-7xl'>
          Hub
        </h1>
        <p className='mt-5'>DSC VIT is all about working constructively to find solutions to real-life problems faced by communities. We would love to receive unique ideas from you. The best ones may be nominated as team projects!
        </p>
        <p className='mt-5'>"Everything Begins With An Idea" – Earl Nightingale</p>
        <button className='primary-button mt-5'>Add an Idea</button>
      </div>

      <div>
        <h2>Trending Ideas</h2>
      </div>
      <div className='mt-6'>
        <h2>Ideas Made Real</h2>
      </div>
    </div>
  )
}
