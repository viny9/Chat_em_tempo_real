import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { BsPencil, BsFillCameraFill } from 'react-icons/bs'
import ErrorDialog from './dialogs/ErrorDialog'
import style from '../styles/SignUp.module.css'
import useUser from '../hooks/useUser'
import useImg from '../hooks/useImg'

const SignUp = () => {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        img: '',
        name: '',
        email: '',
        telephone: '',
        password: '',
        confirmPassword: '',
    })
    const [openDialog, setOpenDialog] = useState(false)
    const [error, setError] = useState('')
    const [selectedImg, setSelectedImg] = useState('')
    const [imgFile, setImgFile] = useState('')
    const { createUser, errorHandle } = useUser()
    const { profileImg, getProfileImg } = useImg()

    useEffect(() => {
        if (form.name === '' ||
            form.email === '' ||
            form.telephone === '' ||
            form.telephone.length < 16 ||
            form.password === '' ||
            form.confirmPassword === '') {
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

    const telephoneMask = e => {
        let telephoneInput = e.target
        telephoneInput.value = telephoneInput.value.replace(/\D/g, "");
        telephoneInput.value = telephoneInput.value.replace(/^(\d{2})(\d)(\d+)/, "($1) $2 $3");
        telephoneInput.value = telephoneInput.value.replace(/(\d{4})(\d)/, "$1-$2");
        setForm({ ...form, [telephoneInput.id]: telephoneInput.value })
    };

    const handleSubmit = async e => {
        e.preventDefault()

        if (form.password === form.confirmPassword) {
            try {

                if (imgFile !== '') {
                    await profileImg(form.name, imgFile)
                    const img = await getProfileImg(form.name)
                    form.img = img
                } else {
                    const img = await getProfileImg('No img.png')
                    form.img = img
                }

                await createUser(form)
                navigate('/main')
            } catch (e) {
                const errorMensage = errorHandle(e)
                setError(errorMensage)
                setOpenDialog(true)
            }
        } else {
            setError('As senhas não estão iguais')
            setOpenDialog(true)
        }
    }

    const isClose = res => {
        setOpenDialog(res)
    }

    const selectImg = img => {
        if (img) {
            setSelectedImg(URL.createObjectURL(img))
            setImgFile(img)
        }
    }

    return (
        <div className={style.component}>
            <form onSubmit={handleSubmit}>
                <h1>Cadasto</h1>

                <img src={selectedImg} alt="Profile img" className={style.profileImg} style={selectedImg ? { display: 'block' } : { display: 'none' }} />

                <label className={style.imgLabel} htmlFor='fileInput' style={selectedImg ? { display: 'flex' } : { display: 'none' }}>
                    <BsPencil className={style.editIcon} />
                </label>
                <label htmlFor="fileInput" className={style.firstLabel} style={selectedImg ? { display: 'none' } : { display: 'block' }}>
                    Selecione uma imagem
                </label>
                <input type="file" onChange={e => selectImg(e.target.files[0])} className={style.fileInput} id="fileInput" />

                <div className='field'>
                    <input type="text" id='name' required onChange={handleInputValue} value={form.name} />
                    <label htmlFor="name">Nome</label>
                    <span className='focusBorder'></span>
                </div>
                <div className='field'>
                    <input type="text" id='email' required onChange={handleInputValue} value={form.email} />
                    <label htmlFor="email">Email</label>
                    <span className='focusBorder'></span>
                </div>
                <div className='field'>
                    <input type="text" id='telephone' maxLength={16} required onChange={e => { handleInputValue(e); telephoneMask(e) }} value={form.telephone} />
                    <label htmlFor="telephone">Telefone</label>
                    <span className='focusBorder'></span>
                </div>
                <div className='field'>
                    <input type="password" id='password' required onChange={handleInputValue} value={form.password} />
                    <label htmlFor="password">Senha</label>
                    <span className='focusBorder'></span>
                </div>
                <div className='field'>
                    <input type="password" id='confirmPassword' required onChange={handleInputValue} value={form.confirmPassword} />
                    <label htmlFor="confirmPassword">Confirmar Senha</label>
                    <span className='focusBorder'></span>
                </div>
                <button disabled id='signUpBtn' className={style.signUpBtn}>Cadastrar</button>
                <Link to={'/login'} className={style.link}>Já possui conta ?</Link>
            </form>
            <ErrorDialog isClose={isClose} isOpen={openDialog} error={error} />
        </div >
    )
}

export default SignUp