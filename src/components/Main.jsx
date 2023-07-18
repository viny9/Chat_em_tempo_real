import { Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import style from '../styles/Main.module.css'
import Sidebar from './Sidebar'
import AddPersonDialog from './dialogs/AddPersonDialog'

const Main = () => {
    const [openDialog, setOpenDialog] = useState(false)
    const navigate = useNavigate(false)

    const open = res => {
        setOpenDialog(res)
    }

    const closeDialog = res => {
        setOpenDialog(res)
    }

    const selectChat = res => {
        navigate('/main/chat', {
            state: {
                id: res
            }
        })
    }

    return (
        <div className={style.components}>
            <Sidebar dialog={open} />
            <Outlet />
            <AddPersonDialog isOpen={openDialog} isClose={closeDialog} selectedUser={selectChat} />
        </div>
    )
}

export default Main