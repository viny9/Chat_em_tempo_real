import { Link } from "react-router-dom";
import style from '../styles/Home.module.css'

const Home = () => {
    return (
        <div className={style.component}>
            <h1>Bem Vindo</h1>
            <p className={style.text}>Bem vindo ao chat em tempo real. </p>
            <p className={style.text}>Isto é um projeto pessoal para relembrar meus conhecimentos em react.</p>
            <Link to={'/signUp'} className={style.a}>
                <button className={style.btn}>Começar</button>
            </Link>
        </div >
    )
}

export default Home;