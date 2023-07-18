import { BsPencil, BsCheck2, BsArrowLeftShort } from 'react-icons/bs'
import { useEffect, useState } from 'react'
import style from '../styles/User.module.css'
import useUser from '../hooks/useUser'
import ConfirmWithLoginDialog from './dialogs/ConfirmWithLoginDialog'

const User = props => {
    const [editForm, setEditForm] = useState({
        email: false,
        telephone: false
    })
    const [fieldValue, setFieldValue] = useState({
        img: '',
        name: '',
        email: '',
        telephone: ''
    })
    const [isOpen, setIsOpen] = useState(false)
    const { userInfos, updateUserInfos, updateChatsInfos } = useUser()

    useEffect(() => {
        updateChatsInfos()
    })

    useEffect(() => {
        setIsOpen(props.isOpen)
    }, [props])

    useEffect(() => {
        setFieldValue({
            img: userInfos.img,
            name: userInfos.name,
            email: userInfos.email,
            telephone: telephoneMask(userInfos.telephone)
        })
    }, [userInfos])

    const toggleIcon = field => {
        setEditForm({ ...editForm, [field]: !editForm[field] })
    }

    const telephoneMask = e => {
        let telephoneInput = String(e)
        telephoneInput = telephoneInput.replace(/\D/g, "");
        telephoneInput = telephoneInput.replace(/^(\d{2})(\d)(\d+)/, "($1) $2 $3");
        telephoneInput = telephoneInput.replace(/(\d{4})(\d)/, "$1-$2");
        return telephoneInput
    };

    const saveInfos = () => {
        const user = { ...fieldValue }
        updateUserInfos(user)
    }

    const closeSidebar = () => {
        props.isClose(false)
        setIsOpen(false)
    }

    return (
        <div className={`${style.component} ${isOpen ? style.open : ''} `}>
            <div className={style.userHead}>
                <button className={style.backArrowBtn} onClick={closeSidebar}>
                    <BsArrowLeftShort />
                </button>
            </div>
            <img className={style.userImg} src={fieldValue.img} alt="" />
            <div className={style.userInfos}>
                <h1>{userInfos.name}</h1>
                <span className={style.field}>
                    <p>Email: </p>
                    <span>
                        {
                            editForm.email ?
                                <input type="text"
                                    className={style.fieldInput}
                                    placeholder='Email'
                                    onChange={e => setFieldValue({ ...fieldValue, ['email']: e.target.value })}
                                    value={fieldValue.email} />
                                :
                                <p>{fieldValue.email}</p>
                        }
                        {
                            editForm.email ?
                                <button className={style.editBtn} onClick={e => { toggleIcon('email'); saveInfos() }}>
                                    <BsCheck2 />
                                </button>
                                :
                                < button className={style.editBtn} onClick={e => toggleIcon('email')}>
                                    <BsPencil />
                                </button>
                        }
                    </span>
                </span>
                <span className={style.field}>
                    <p>Telefone: </p>
                    <span>
                        {
                            editForm.telephone ?
                                <input type="text"
                                    className={style.fieldInput}
                                    placeholder='Telefone'
                                    maxLength={16}
                                    onChange={e => setFieldValue({ ...fieldValue, ['telephone']: telephoneMask(e.target.value) })}
                                    value={telephoneMask(fieldValue.telephone)} />
                                :
                                <p>{fieldValue.telephone}</p>
                        }
                        {
                            editForm.telephone ?
                                <button className={style.editBtn} onClick={e => { toggleIcon('telephone'); saveInfos() }}>
                                    <BsCheck2 />
                                </button>
                                :
                                <button className={style.editBtn} onClick={e => toggleIcon('telephone')}>
                                    <BsPencil />
                                </button>
                        }
                    </span>
                </span>
            </div>
        </div >
    )
}

export default User