import { BsFillGearFill, BsBoxArrowLeft, BsSearch, BsPersonPlusFill, BsPersonFill } from 'react-icons/bs'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import style from '../styles/Sidebar.module.css'
import useChats from '../hooks/useChats'
import useUser from '../hooks/useUser'
import User from './User'

const Sidebar = (props) => {
    const [menu, setMenu] = useState('')
    const [search, setSearch] = useState('')
    const [lastMessage, setLastMessage] = useState([])
    const [openUserSidebar, setOpenUserSidebar] = useState(false)

    const lastMessageArray = []
    const navigate = useNavigate()

    const { chats, messages, getChatMessages, getMessages } = useChats()
    const { logOut, userInfos } = useUser()

    const getChatsIds = () => {
        return chats?.map(chat => {
            const user = chat?.users.filter(user => user.id !== localStorage['userId']) || []

            const currentUserId = localStorage['userId']
            const id = user[0].id
            const combinedId = currentUserId < id ? id + currentUserId : currentUserId + id
            return combinedId
        })
    }

    useEffect(() => {
        if (chats.length > 0) {
            const ids = getChatsIds()
            ids?.map(async id => {
                await getChatMessages(id)
                await getLastMessage(id)
            })
        }
    }, [chats])

    useEffect(() => {
        if (chats.length > 0) {
            const ids = getChatsIds()
            ids?.map(async id => await getLastMessage(id))
        }
    }, [messages])

    const getLastMessage = async id => {
        const message = await getMessages(id)
        const allMessages = message?.messages || []
        const index = allMessages.length - 1
        const lasMessage = allMessages[index]
        lastMessageArray.push(lasMessage)
        setLastMessage(lastMessageArray)
    }

    const filterChats = chats?.length > 0 ?
        chats.map(chat => chat?.users.filter(user => user.id !== localStorage['userId'])[0])
            .filter(chat => chat?.name.toLowerCase()
                .includes(search.trim()?.toLowerCase()))
        : []

    const toggleMenu = () => {
        if (menu === '') {

            setMenu('open')
        } else {
            setMenu('')
        }
    }

    const selectChat = async chat => {
        navigate('/main/chat', {
            state: {
                id: chat
            }
        })
        setSearch('')
    }

    const openDialog = () => {
        props.dialog(true)
    }

    const out = async () => {
        await logOut()
        navigate('/login')
    }

    const closeSidebar = res => {
        setOpenUserSidebar(res)
    }

    return (
        <div className={style.sidebar}>
            <h1>Mensagens</h1>
            <div className={style.searchBar}>
                <div className={style.inputContainer}>
                    <span className={style.icon}>
                        <BsSearch />
                    </span>

                    <input type="text" placeholder='Pesquisar' onChange={e => setSearch(e.target.value)} value={search} />
                </div>
            </div>

            <p className={style.divisor}>Todas as conversas</p>
            <div className={style.chatsContainer}>
                {search ?
                    filterChats.map(chat => {
                        return (
                            <div key={chat.name} className={style.chat} onClick={() => selectChat(chat.id)}>
                                <img src={chat.img} alt="teste" />
                                <span className={style.userInfos}>
                                    <p>{chat.name}</p>
                                </span>
                            </div>
                        )
                    })
                    :
                    chats?.map((chat, i) => {
                        const user = chat?.users.filter(user => user.id !== localStorage['userId']) || []
                        return (
                            <div key={user[0]?.name} className={style.chat} onClick={() => selectChat(user[0].id)}>
                                <img src={user[0].img} alt="teste" />
                                <span className={style.userInfos}>
                                    <p>{user[0]?.name}</p>
                                    {
                                        lastMessage[i]?.img === undefined ?
                                            <p className={style.lastMessage}>{lastMessage[i]?.text}</p>
                                            :
                                            <p className={style.lastMessage}>Imagem</p>
                                    }
                                </span>
                                <span className={style.messageInfos}>

                                    <p>{lastMessage[i]?.hour}</p>
                                    {/* <p className={style.newMessages}>1</p> */}
                                </span>
                            </div>
                        )
                    })
                }
            </div>

            <div className={style.user}>
                <span>
                    <img src={userInfos?.img} alt="teste" />
                    <p>{userInfos?.name}</p>
                </span>
                <div className={`${style.menu} ${style[menu]}`} id='menu'>
                    <button onClick={e => { setOpenUserSidebar(true); toggleMenu() }}>
                        <BsPersonFill />
                    </button>
                    <button onClick={e => { openDialog(); toggleMenu() }}>
                        <BsPersonPlusFill />
                    </button>
                    <button onClick={out}>
                        <BsBoxArrowLeft />
                    </button>
                </div>
                <button className={`${style.config} ${style[menu]}`} onClick={toggleMenu}>
                    <BsFillGearFill />
                </button>
            </div>

            <User isOpen={openUserSidebar} isClose={closeSidebar} />
        </div >
    )
}

export default Sidebar