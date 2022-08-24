import { faCircleXmark } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useContext, useState } from 'react'
import { SearchContext } from '../../context/SearchContext'
import useFetch from '../../hooks/useFetch'
import './reserve.scss'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../../const/BaseURL'

const Reserve = ({ setOpen, hotelId }) => {
    const [selectedRooms, setSelectedRooms] = useState([])
    const navigate = useNavigate()
    const { data, loading, error } = useFetch(`/hotels/room/${hotelId}`)
    const { dates } = useContext(SearchContext)
    const getDatesInRange = (start, end) => {
        const startDate = new Date(start)
        const endDate = new Date(end)
        const date = new Date(startDate.getTime())
        const dates = []
        while (date < endDate) {
            dates.push(new Date(date).getTime())
            date.setDate(date.getDate() + 1)
        }
        return dates
    }
    const bookingDate = getDatesInRange(dates[0].startDate, dates[0].endDate)
    const isAvailable = (roomNumber) => {
        const isFound = roomNumber?.unavailableDates?.some(date =>
            bookingDate.includes(new Date(date).getTime())
        )
        return !isFound
    }
    const handleSelect = (e) => {
        const checked = e.target.checked
        const value = e.target.value
        setSelectedRooms(checked ? [...selectedRooms, value] : selectedRooms.filter(item => item !== value))
    }
    const handleReserve = async () => {
        try {
            await Promise.all(selectedRooms.map(roomId => {
                const res = axios.put(`${BASE_URL}/rooms/availability/${roomId}`, { dates: bookingDate })
                return res.data
            }))
            setOpen(false)
            navigate("/")
        } catch (err) {

        }
    }

    return (
        <div className='reserve'>
            <div className="rContainer">
                <FontAwesomeIcon icon={faCircleXmark} className="rClose" onClick={() => setOpen(false)} />
                <span>Select your rooms: </span>
                {data.map(item => (
                    <div className="rItem" key={item._id}>
                        <div className="rItemInfo">
                            <div className="rTitle">{item.title}</div>
                            <div className="rDesc">{item.desc}</div>
                            <div className="rMax">
                                Max people: <b>{item.maxPeople}</b>
                            </div>
                            <div className="rPrice">{item.price}</div>
                        </div>
                        {item.roomNumbers.map(roomNumber => (
                            <div className="room" key={roomNumber.number}>
                                <label>{roomNumber.number}</label>
                                <input disabled={!isAvailable(roomNumber)} type="checkbox" value={roomNumber._id} onChange={handleSelect} />
                            </div>
                        ))}
                    </div>
                ))}
                <button onClick={handleReserve} className="rButton">Reserve Now!</button>
            </div>
        </div>
    )
}

export default Reserve