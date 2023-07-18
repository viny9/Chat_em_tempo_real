import { get, onValue, ref, set, update } from "firebase/database"
import { useEffect, useState } from "react"
import { database } from "../config/firebase"

const useChats = () => {
    const [chats, setChats] = useState([])
    const [messages, setMessages] = useState([])
    const [chatUpdate, setChatUpdate] = useState()

    useEffect(() => {
        getCurrentUserChats()
        teste()
    }, [])

    // useEffect(() => {
    //     getCurrentUserChats()
    // }, [chatUpdate])

    const createChat = async (usersInfos, combinedId) => {
        const chatInfos = {
            users: usersInfos,
            messages: []
        }

        const chatRef = {
            id: combinedId
        }

        const snapshot = await get(ref(database, 'users'))
        const array = snapshot.val().map(user => user.email)

        chatInfos.users.forEach(async user => {
            const index = array.indexOf(user.email)
            const gets = await get(ref(database, 'users/' + `${index}/` + 'chats'))
            const userChatIndex = gets.val() === null ? 0 : [gets.val()].length
            const userRef = ref(database, 'users/' + `${index}/` + 'chats/' + userChatIndex)
            set(userRef, chatRef)
        });

        const chatsRef = ref(database, 'usersChats/' + combinedId)
        set(chatsRef, chatInfos)
    }

    const getCurrentUserChats = async () => {
        const snapshot = await get(ref(database, 'users'))
        const array = snapshot.val().map(user => user.id)
        const index = array.indexOf(localStorage['userId']) //Pegar o index do array para usar de ref

        const startCountRef = ref(database, 'users/' + index)

        onValue(startCountRef, async (snapshot) => {
            const data = snapshot.val()
            const allChats = data.chats?.map(async (chat) => await getChatInfos(chat?.id)) || []
            chats[0] === null ? setChats([]) : setChats(await Promise.all(allChats))
        })
    }

    const teste = () => {
        const startCountRef = ref(database, 'usersChats')
        onValue(startCountRef, (snapshot) => {
            const data = snapshot.val()
            setChatUpdate(data)
        })
    }

    const getChatMessages = async combinedId => {
        const startCountRef = ref(database, `usersChats/${combinedId}`)
        onValue(startCountRef, (snapshot) => {
            const data = snapshot.val()
            setMessages(data.messages)
        })
    }

    const getMessages = async combinedId => {
        const gets = await get(ref(database, `usersChats/${combinedId}`))
        const snapshot = gets.val()
        return snapshot
    }

    const getChatInfos = async combinedId => {
        return new Promise((resolve, reject) => {
            const startCountRef = ref(database, `usersChats/${combinedId}`)
            onValue(startCountRef, (snapshot) => {
                const data = snapshot.val()
                resolve(data)
            })
        })
    }

    const checkChat = async combinedId => {
        const gets = await get(ref(database, `usersChats/${combinedId}`))
        const data = gets.val()

        if (data === (undefined || null)) {
            return true
        } else {
            return false
        }

    }

    // const deleteChat = async combinedId => {
    //     // Talvez alterar para excluir para os dois lados
    //     // Tanto para quem ta logado pra outro usuário
    //     const ref = doc(db, 'users', currentUserId, 'chats', combinedId)
    //     return await deleteDoc(ref)
    // }

    const sendMessage = async (message, combinedId) => {
        const startCountRef = ref(database, 'usersChats/' + `${combinedId}/` + 'messages/' + message.id)
        update(startCountRef, message)
    }

    return {
        chats,
        messages,
        checkChat,
        sendMessage,
        getChatMessages,
        createChat,
        getChatInfos,
        getMessages,
        chatUpdate,
    }


}

export default useChats