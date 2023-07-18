import { BsImageFill, BsGeoAltFill, BsSendFill, BsThreeDotsVertical, BsX } from 'react-icons/bs'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useChats from '../hooks/useChats'
import style from '../styles/Chat.module.css'
import useImg from '../hooks/useImg'

const Chat = () => {
    const [inputText, setInputText] = useState('')
    const [disabled, setDisabled] = useState(true)
    const [chat, setChat] = useState({})
    const [menu, setMenu] = useState('')
    const [img, setImg] = useState('')
    const [imgFile, setImgFile] = useState('')
    const location = useLocation()
    const { sendMessage, getChatMessages, messages, getChatInfos } = useChats()
    const { sendImgMessage, getChatMessageImg } = useImg()

    const id = location.state.id
    const currentUserId = localStorage['userId']
    const combinedId = currentUserId < id ? id + currentUserId : currentUserId + id
    const container = document.querySelector('#messagesContainer ')

    useEffect(() => {
        console.log(process.env);
        if (location.state.id !== '') {
            getChatMessages(combinedId)
            getChatInfos(combinedId)
                .then(chat => setChat(chat.users.filter(user => user.id !== currentUserId)[0]))
        }
    }, [combinedId])

    useEffect(() => {
        setTimeout(() => {
            container?.scrollTo(0, container.scrollHeight)
        }, 1)
    })

    const handleIputText = e => {
        setInputText(e.target.value)

        if (e.target.value === '') {
            setDisabled(true)
        } else {
            setDisabled(false)
        }
    }

    const send = async e => {
        if ((e.key === 'Enter' || e.key === undefined) && inputText != '') {
            const date = new Date()
            const index = (messages?.length) || 0
            let messageInfos

            if (img) {
                await sendImgMessage(combinedId, imgFile, index)
                const imgUrl = await getChatMessageImg(combinedId, index)

                messageInfos = {
                    img: imgUrl,
                    id: index,
                    hour: `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`,
                    sentBy: localStorage['userId']
                }

                cancelImg()

            } else {
                messageInfos = {
                    text: inputText,
                    id: index,
                    hour: `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`,
                    sentBy: localStorage['userId']
                }
            }

            await Promise.all([sendMessage(messageInfos, combinedId), setInputText(''), setDisabled(true)])
        }
    }

    const toggleMenu = () => {
        if (menu === 'open') {
            setMenu('')
        } else {
            setMenu('open')
        }
    }

    const selectImg = img => {
        if (img) {
            setImgFile(img)
            setImg(URL.createObjectURL(img))
            setDisabled(false)
            setInputText('')
        }
    }

    const cancelImg = () => {
        setDisabled(true)
        setImg('')
        setImgFile('')
    }

    return (
        <div className={style.chatComponent} >
            <div className={style.chatHead}>
                <span>
                    <img src={chat.img} alt="User img" />
                    <p>{chat.name}</p>
                </span>
                <button onClick={toggleMenu} className={style.settingsBtn}>
                    <BsThreeDotsVertical />
                </button>
                <div className={`${style.chatOptionMenu} ${style[menu]}`}>
                    <ul>
                        <li>
                            <button>Teste</button>
                        </li>
                        <li>
                            <button>Apagar conversa</button>
                        </li>
                        <li>
                            <button>Editar conversa</button>
                        </li>
                    </ul>
                </div>
            </div>
            <div id='messagesContainer' className={style.messagesContainer}>

                {messages?.map(message => {
                    const userId = localStorage['userId']
                    const sentBy = userId === message.sentBy ? 'you' : 'otherPerson'

                    if (message.img) {
                        return (
                            <div key={message.id} className={style.messageContainer}>
                                <div className={`${style.imgMessageContainer} ${style[sentBy]}`} >
                                    <img src={message.img} alt="" className={style.imgMessage} />
                                </div>
                                <p className={style.messageHour} id={style[sentBy]} >{message.hour}</p>
                            </div>
                        )
                    } else {
                        return (
                            <div key={message.id} className={style.messageContainer}>
                                <div className={`${style.message} ${style[sentBy]}`}>
                                    <p className={style.messageText}>{message.text}</p>
                                </div>
                                <p className={style.messageHour} id={style[sentBy]} >{message.hour}</p>
                            </div>
                        )
                    }
                })}

                {img ?
                    <div className={style.imgMessageContainer}>
                        <img src={img} alt="" className={style.imgMessage} />
                        <button className={style.cancelIcon} onClick={cancelImg}>
                            <BsX />
                        </button>
                    </div>
                    :
                    []
                }

            </div>

            <div className={style.chatFooterContainer}>
                <div className={style.inputContainer}>
                    <input type="text" disabled={img ? true : false} placeholder='Digite uma mensagem' onKeyUp={e => send(e)} onChange={handleIputText} value={inputText} />

                    <label htmlFor="fileInput">
                        <BsImageFill className={style.icons} />
                    </label>
                    <input type="file" id='fileInput' onChange={e => { selectImg(e.target.files[0]); e.target.value = null }} style={{ display: 'none' }} />

                    {/* <button>
                        <BsGeoAltFill className={style.icons} />
                    </button> */}

                </div>
                <button disabled={disabled} className={style.sendIconBtn} onClick={() => send(inputText)} >
                    <BsSendFill className={style.sendIcon} />
                </button>
            </div>
        </div >
    )
}

export default Chat