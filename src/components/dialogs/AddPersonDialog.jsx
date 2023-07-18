import { useEffect, useState } from 'react'
import { BsSearch } from 'react-icons/bs'
import style from '../../styles/AddPersonDialog.module.css'
import useUser from '../../hooks/useUser'
import useChats from '../../hooks/useChats'

const AddPersonDialog = (props) => {
    const [isOpen, setIsOpen] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [seachedUser, setSeachedUser] = useState([])
    const { users, userInfos } = useUser()
    const { createChat, checkChat } = useChats()

    useEffect(() => {
        setIsOpen(props.isOpen)
    }, [props])

    const close = (e) => {
        const dialogBody = document.querySelector('#dialogBody').getBoundingClientRect()

        if (e.clientY < dialogBody.top || e.clientY > dialogBody.bottom || e.clientX < dialogBody.left || e.clientX > dialogBody.right) {
            setIsOpen(false)
            props.isClose(false)
            setInputValue('')
        }
    }

    const telephoneMask = value => {
        let telephone = String(value)
        telephone = telephone.replace(/\D/g, "");
        telephone = telephone.replace(/^(\d{2})(\d)(\d+)/, "($1) $2 $3");
        telephone = telephone.replace(/(\d{4})(\d)/, "$1-$2");
        return telephone
    };

    const search = async e => {
        const searchWord = e.target.value.toLowerCase()
        let filter = []

        if (isNaN(Number(searchWord))) {
            filter = users.filter(user => {
                return user.email.includes(searchWord)
            })
        } else if (!isNaN(Number(searchWord))) {
            filter = users.filter(user => {
                const telephone = String(user.telephone)
                return telephone.includes(searchWord)
            })
        }

        setInputValue(e.target.value)
        setSeachedUser(filter)
    }

    const newChat = async user => {
        const currentUser = userInfos
        const combinedUsersId = currentUser.id < user.id ? user.id + currentUser.id : currentUser.id + user.id
        const isEmpty = await checkChat(combinedUsersId)

        if (isEmpty) {
            delete user.telephone
            delete currentUser.telephone
            const users = [user, currentUser]

            createChat(users, combinedUsersId)

            setIsOpen(false)
            props.isClose(false)
            setInputValue('')
        } else {
            props.selectedUser(user.id)
            props.isClose(false)
            setInputValue('')
        }
    }

    return (
        <div
            className='dialog'
            style={isOpen === true ? { display: 'flex' } : { display: 'none' }}
            onClick={close}>

            <div className={`${style.body} body`} id='dialogBody'>
                <div className={style.inputContainer}>
                    <BsSearch />
                    <input type="text" placeholder='Email ou Número' onChange={search} value={inputValue} />
                </div>
                <p className={style.title}>Contatos</p>
                <div className={style.contactList}>
                    {inputValue ?
                        seachedUser.map(user => {
                            return (
                                <div key={user.name} className={style.contact} onClick={e => newChat(user)}>
                                    <img src={user.img} alt="" />
                                    <span>
                                        <p>{user.name}</p>
                                        <p>{telephoneMask(user.telephone)}</p>
                                    </span>
                                </div>
                            )
                        })
                        : users.map(user => {
                            return (
                                <div key={user.name} className={style.contact} onClick={e => newChat(user)}>
                                    <img src={user.img} alt="" />
                                    <span>
                                        <p>{user.name}</p>
                                        <p>{telephoneMask(user.telephone)}</p>
                                    </span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default AddPersonDialog