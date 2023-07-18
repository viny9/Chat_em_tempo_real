import { BsExclamationCircle } from 'react-icons/bs'
import { useEffect, useState } from 'react'
import style from '../../styles/ErrorDialog.module.css'

const ErrorDialog = (props) => {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        setIsOpen(props.isOpen)
    }, [props])

    const close = (() => {
        setIsOpen(false);
        props.isClose(false)
    })

    return (
        <div className='dialog'
            style={isOpen === false ? { display: 'none' } : { display: "flex" }}>
            <div className={`${style.body} body`}>
                <h2>{props.error}</h2>
                <BsExclamationCircle className={style.warningSignal} />
                <button onClick={close} className={style.closeBtn}>Fechar</button>
            </div>
        </div >
    )
}

export default ErrorDialog