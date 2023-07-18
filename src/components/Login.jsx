import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import ErrorDialog from "./dialogs/ErrorDialog"
import style from '../styles/Login.module.css'
import useUser from "../hooks/useUser"

const Login = () => {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        email: '',
        password: '',
    })
    const [error, setError] = useState('')
    const [openDialog, setOpenDialog] = useState(false)
    const { login, errorHandle } = useUser()

    useEffect(() => {
        if (form.email === '' || form.password === '') {
            document.querySelector('#signUpBtn').setAttribute('disabled', true)
        } else {
            document.querySelector('#signUpBtn').removeAttribute('disabled')
        }
    }, [form])

    const handleInputValue = e => {
        e.preventDefault()

        const { id, value } = e.target

        setForm({ ...form, [id]: value })
    }

    const handleSubmit = async e => {
        e.preventDefault()

        try {
            await login(form)
            navigate('/main')
        } catch (e) {
            const errorMensage = errorHandle(e)
            setError(errorMensage)
            setOpenDialog(true)
        }
    }

    const isClose = (res) => {
        setOpenDialog(res)
    }

    return (
        <div className={style.component}>
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                <div className='field'>
                    <input type="text" id='email' required onChange={handleInputValue} value={form.email} />
                    <label htmlFor="email">Email</label>
                    <span className='focusBorder'></span>
                </div>
                <div className='field'>
                    <input type="password" id='password' required onChange={handleInputValue} value={form.password} />
                    <label htmlFor="password">Senha</label>
                    <span className='focusBorder'></span>
                </div>
                <button disabled id='signUpBtn' onClick={handleSubmit} className={style.signUpBtn}>Login</button>
                <Link to='/signUp' className={style.link}>Ainda não possui conta ?</Link>
            </form>
            <ErrorDialog isClose={isClose} isOpen={openDialog} error={error} />
        </div >
    )
}

export default Login