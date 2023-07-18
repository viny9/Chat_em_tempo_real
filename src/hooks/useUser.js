import { get, onValue, ref, update } from "firebase/database"
import { database, auth } from "../config/firebase"
import { useEffect, useState } from "react"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"

const useUser = () => {
    const currentUserId = localStorage['userId']
    const [user, setUser] = useState([])
    const [allUsers, setAllUsers] = useState([])

    useEffect(() => {
        getUserInfos()
        getAllUsers()
    }, [])

    // Adicionar atualizações para quando as informações dos usuários forem alteradas
    //Adicionar metodo para atualizar as infos do usuário
    const login = async user => {
        const userCredential = await signInWithEmailAndPassword(auth, user.email, user.password)
        localStorage.setItem('userId', userCredential.user.uid)

        return userCredential
    }

    const logOut = async () => {
        localStorage.clear()
        await auth.signOut()
    }

    const createUser = async user => {
        const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password)
        const snapshot = await get(ref(database, 'users'))
        const index = snapshot.val()?.length || 0
        const staRef = ref(database, 'users/' + index)
        localStorage.setItem('userId', userCredential.user.uid)

        const telephone = Number(user.telephone.replace(/[^+\d]+/g, ""))
        user.telephone = telephone
        user.id = userCredential.user.uid
        delete user.password
        delete user.confirmPassword
        update(staRef, user)
    }

    const getUserInfos = async () => {
        const startCountRef = ref(database, 'users')
        onValue(startCountRef, (snapshot) => {
            const data = snapshot.val()
            const filter = data?.filter(user => user.id === currentUserId)[0]
            setUser(filter)
        })
    }

    const getAllUsers = () => {
        const startCountRef = ref(database, 'users')

        onValue(startCountRef, (snapshot) => {
            const data = snapshot.val()
            if (data) {
                const filter = data.filter(user => user?.id !== localStorage['userId'])
                setAllUsers(filter)
            }
        })
    }

    const updateUserInfos = async currentUser => {
        const snapshot = await get(ref(database, 'users'))
        const users = snapshot.val().map(user => user.id)
        const currentUserId = localStorage['userId']
        const index = users.indexOf(currentUserId)

        const telephone = Number(currentUser.telephone.replace(/[^+\d]+/g, ""))
        currentUser.telephone = telephone

        const startRef = ref(database, 'users/' + index)
        update(startRef, currentUser)
    }

    const updateChatsInfos = async () => {
        const chatsRef = await get(ref(database, 'usersChats'))
        const chats = chatsRef.val()
    }

    const errorHandle = e => {
        switch (e.code) {
            case 'auth/invalid-email':
            case 'auth/wrong-password':
                return 'Email ou senha Incorretos.'

            case 'auth/email-already-in-use':
                return 'Este email já está em uso.'

            case 'auth/weak-password':
                return 'Sua senha deve posuir pelo menos 6 caracteres.'

            default:
                return 'Error'
        }
    }

    return {
        userInfos: user,
        users: allUsers,
        createUser,
        login,
        logOut,
        updateUserInfos,
        updateChatsInfos,
        errorHandle
    }
}

export default useUser
