import { useEffect, useState } from 'react'
import axios from 'axios'
import { BASE_URL } from '../const/BaseURL'

const useFetch = (url) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const path = BASE_URL + url
    console.log(BASE_URL)
    console.log(url)
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const res = await axios.get(path)
                setData(res.data)
            } catch (err) {
                setError(err)
            }
            setLoading(false)
        }
        fetchData()
    }, [path])

    const reFetch = async () => {
        setLoading(true)
        try {
            const res = await axios.get(path)
            setData(res.data)
        } catch (err) {
            setError(err)
        }
        setLoading(false)
    }

    return { data, loading, reFetch, error }
}

export default useFetch
