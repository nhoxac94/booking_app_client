import axios from 'axios'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../../const/BaseURL'
import { AuthContext } from '../../context/AuthContext'
import './login.scss'

const Login = () => {
    const [credentials, setCredentials] = useState({
        username: undefined,
        password: undefined
    })

    const { loading, error, dispatch } = useContext(AuthContext)

    const navigate = useNavigate()

    const handleChange = (e) => {
        setCredentials(prev => ({
            ...prev,
            [e.target.id]: e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        dispatch({ type: "LOGIN_START" })
        try {
            const res = await axios.post(`${BASE_URL}/auth/login`, credentials)
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details })
            navigate('/')
        } catch (err) {
            dispatch({ type: "LOGIN_FAILURE", payload: err.response.data })
        }
    }

    return (
        <div className='login'>
            <div className="lContainer">
                <input type="text" placeholder='username' id="username" className='lInput' onChange={(e) => handleChange(e)} />
                <input type="password" placeholder='password' id="password" className='lInput' onChange={(e) => handleChange(e)} />
                <button disabled={loading} className='lButton' onClick={(e) => handleSubmit(e)}>Login</button>
                {error && <span>{error.message}</span>}
            </div>
        </div>
    )
}

export default Login