import React, { useCallback, useEffect, useState, useRef } from 'react'
import axios from '../../axios'
import dayjs from 'dayjs'
import IdeaCard from '../../components/IdeaCard'
import { useSelector } from 'react-redux'
import { MixedTags } from '@yaireo/tagify/dist/react.tagify'
import Skeleton from 'react-loading-skeleton'
import styles from './ideas.css'
import { Link } from 'react-router-dom'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Ideas () {
  const [ideas, setIdeas] = useState([])
  const [search, setSearch] = useState('')
  const [userList, setUserList] = useState([])
  const [userStrings, setUserStrings] = useState([])
  const [tagStrings, setTagStrings] = useState([])
  const [sort, setSort] = useState('')
  const [order, setOrder] = useState('')
  const [fromDate, setFromDate] = useState()
  const [toDate, setToDate] = useState()
  const [ideasloading,setIdeasloading] = useState(true)
  const [tagSettings, setTagSettings] = useState({
    pattern: /@|#/,
    dropdown: {
      enabled: 1,
      position: 'text'
    },
    templates: {
      tag (tagData, tagify) {
        return `<tag title="${(tagData.title || tagData.value)}"
                contenteditable='false'
                spellcheck='false'
                tabIndex="${this.settings.a11y.focusableTags ? 0 : -1}"
                class="${this.settings.classNames.tag} ${tagData.class ? tagData.class : ''}"
                ${this.getAttributes(tagData)} style="--tag-bg:${getColor(tagData)}">
        <x title='' class="${this.settings.classNames.tagX}" role='button' aria-label='remove tag'></x>
        <div>
            <span class="${this.settings.classNames.tagText}">${tagData[this.settings.tagTextProp] || tagData.value}</span>
        </div>
      </tag>`
      }
    }
  })

  const getColor = (tagData) => {
    if (tagData.prefix === '@') {
      return '#4799d3'
    } else if (tagData.prefix === '#') {
      return '#65d34c'
    }
  }
  const [user, setUser] = useState('')
  const [tags, setTags] = useState()
  const [ideaCount, setIdeaCount] = useState(0)

  const tagifyRef = useRef()

  const auth = useSelector(state => state.auth)
  const authRef = useRef(auth)

  useEffect(() => {
    document.getElementsByClassName('tagify__input')[0].addEventListener('keydown',((e) => {
      if (e.keyCode === 13 && !e.shiftKey)
      {
        console.log(e)
        // prevent default behavior
        e.preventDefault();
        //alert("ok");
        return false;
      }
    }))

    document.getElementsByClassName('tagify')[0].style.borderRadius = '18px'
    document.getElementsByClassName('tagify')[0].style.paddingLeft = '1rem'
  },[])

  useEffect(() => {
    const fetchIdeas = async () => {
      await axios
        .get('/ideas')
        .then(res => {
          setIdeas(res.data.ideas.sort(function(a,b){
            return new Date(b.createdOn) - new Date(a.createdOn);
          }))
          setIdeasloading(false)
        })
    }
    const fetchUsers = async () => {
      await axios
        .get('/user')
        .then(res => {
          setUserList(res.data.users)
          setUserStrings(res.data.users.map(a => a.name))
        })
    }
    const getIdeaCount = () => {
      axios.get(`/user/${auth._id}`, {
        headers: {
          authorization: auth.token
        }
      }).then(res => {
        setIdeaCount(res.data.user.ideaCount)
      })
    }
    if (auth.token) {
      authRef.current = auth
      getIdeaCount()
    }
    fetchIdeas()
    fetchUsers()
  }, [auth])

  const searchIdeas = (e, userName, authState) => {
    e.preventDefault()

      setUser(user => {
        setFromDate(from => {
          setToDate(to => {
            setTags (tags => {
              setSearch(async search => {
                await axios.get('/ideas', {
                  headers: {
                    authorization: authRef.current.token
                  },
                  params: {
                    endDate: to,
                    startDate: from,
                    user: user,
                    query: search,
                    tags:tags.join()
                  }
                }).then(res => setIdeas(res.data.ideas))
              })
            })
          })
        })
      }) 
  }

  const onInput = (e) => {
    console.log(e)
    setSearch(e.detail.textContent)
    const prefix = e.detail.prefix

    if (prefix) {
      if (prefix === '@') {
        setUserStrings(state => {
          tagifyRef.current.whitelist = state
          return state
        })
      }

      if (prefix === '#') {
        setTagStrings(state => {
          tagifyRef.current.whitelist = state
          return state
        })
      }
    }
  }

  const onChange = useCallback(e => {
    console.log(e.detail)
    console.log(e.detail.value)
    if (e.detail.tagify.value[e.detail.tagify.value.length - 1].prefix === '@') {
      setUser(e.detail.tagify.value[e.detail.tagify.value.length - 1].value)
    } else if (e.detail.tagify.value[e.detail.tagify.value.length - 1].prefix === '#') {
      setTags(e.detail.tagify.value.filter(tag => {
        return tag.prefix === '#'
      }).map(tag => {
        return tag.value
      }))
    }
  }, [])

  return (
    <div className='negmar-ideas grid md:gap-4 gap-2'>
      <div className='col-12 md:col flex flex-column md:gap-3 gap-4'>
        <div className='searchbg z-2 sticky top-0'>
        <div className='align-items-center relative w-full flex gap-3 flex-row'>
          <form className='relative flex-grow-1 flex flex-row gap-4'>
            <Link className='flex' to='/ideas/new' state={{
              toPrevious:true
            }}>
            <div className='flex m-auto'>
              <p className='m-auto font-20'><span className='font-24 blue font-bold'>{ideaCount}</span> ideas</p>
            </div>
            </Link>
            <div className='relative flex-grow-1'>
            <MixedTags
              autoFocus
              id='area'
              settings={tagSettings}
              onInput={onInput}
              onChange={onChange}
              placeholder='hint: type @ or #'
              styles={{'borderRadius':'18px'}}
              tagifyRef={tagifyRef}
              className='radius'
            />
            <img className='button absolute top-0 bottom-0 right-0 mr-3 my-auto' onClick={e =>searchIdeas(e)} src={require('../../assets/searchglass.svg').default} alt='searchglass' />
            </div>
          </form>
        </div>
        <div className='mt-3 flex flex-row gap-4 md:justify-content-end justify-content-center flex-wrap'>
          <span className='flex flex-row'>
            <label className='mr-2' htmlFor='date-from'>From</label>
            <DatePicker selected={fromDate} onChange={(date) => { setFromDate(date) }}  name='date-from' id='date-from' />
          </span>
          <span className='flex flex-row'>
            <label className='mr-2' htmlFor='date-to'>To</label>
            <DatePicker selected={toDate} onChange={(date) => { setToDate(date) }} name='date-to' id='date-to' />
          </span>
        </div>
        </div>
        {!ideasloading ?
        <div className='ideagrid gap-5'>
          {ideas.length ? ideas.map((idea, index) => {
            return <IdeaCard key={index} name={idea.title} description={idea.description} authorId={idea.author._id} ideaspage author={idea.author._id === auth._id ? 'You' : idea.authorName} tags={idea.tags} date={idea.createdOn} ideaId={idea._id} hearted={idea.upvotes.includes(auth._id)} upvoteCount={idea.upvotes.length} />
          })
          : <IdeaCard name='Oops' description='Nothing to see here.' tags={[]} disabled={true} />}
        </div> : <Skeleton containerClassName='flex flex-column gap-2' className='border-round-xl' height={200} count={50} /> }
      </div>
    </div>
  )
}
