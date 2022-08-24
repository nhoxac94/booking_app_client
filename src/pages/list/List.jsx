import moment from 'moment'
import { useState } from 'react'
import { DateRange } from 'react-date-range'
import { useLocation } from 'react-router-dom'
import Header from '../../components/header/Header'
import Navbar from '../../components/navbar/Navbar'
import SearchItem from '../../components/searchItem/SearchItem'
import useFetch from '../../hooks/useFetch'
import './list.scss'

const List = () => {
    const location = useLocation()
    const [destination, setDestination] = useState(location.state.destination)
    const [dates, setDates] = useState(location.state.dates)
    const [openDate, setOpenDate] = useState(false)
    const [options, setOptions] = useState(location.state.options)
    const [min, setMin] = useState(undefined)
    const [max, setMax] = useState(undefined)



    const { data, loading, error, reFetch } = useFetch(`/hotels?city=${destination}&min=${min || 0}&max=${max || 9999}`)

    const handleSearch = () => {
        reFetch()
    }
    return (
        <div>
            <Navbar />
            <Header type="list" />
            <div className="listContainer">
                <div className="listWrapper">
                    <div className="listSearch">
                        <h1 className="lsTitle">Search</h1>
                        <div className="lsItem">
                            <label > Destination</label>
                            <input type="text" placeholder={destination} />
                        </div>
                        <div className="lsItem">
                            <label > Check-in Date</label>
                            <span onClick={() => setOpenDate(!openDate)}>{dates && `${moment(dates[0].startDate).format('MM/DD/YYYY')} to ${moment(dates[0]?.endDate).format('MM/DD/YYYY')}`}</span>
                            {openDate && <DateRange
                                onChange={item => setDates([item.selection])}
                                minDate={new Date()}
                                ranges={dates}

                            />}
                        </div>
                        <div className="lsItem">
                            <label > Options</label>
                            <div className="lsOptionItem">
                                <span className="lsOptionText">
                                    Min Price <small>(per night)</small>
                                </span>
                                <input onChange={e => setMin(e.target.value)} type="number" className="lsOptionInput" />
                            </div>
                            <div className="lsOptionItem">
                                <span className="lsOptionText">
                                    Max Price <small>(per night)</small>
                                </span>
                                <input onChange={e => setMax(e.target.value)} type="number" className="lsOptionInput" />
                            </div>
                            <div className="lsOptionItem">
                                <span className="lsOptionText">
                                    Adult
                                </span>
                                <input min={1} type="number" className="lsOptionInput" placeholder={options.adult} />
                            </div>
                            <div className="lsOptionItem">
                                <span className="lsOptionText">
                                    Children
                                </span>
                                <input min={0} type="number" className="lsOptionInput" placeholder={options.children} />
                            </div>
                            <div className="lsOptionItem">
                                <span className="lsOptionText">
                                    Room
                                </span>
                                <input min={1} type="number" className="lsOptionInput" placeholder={options.room} />
                            </div>
                        </div>
                        <button onClick={handleSearch}>Search</button>
                    </div>
                    <div className="listResult">
                        {loading ? "Loading" : <>
                            {data.map(item => (
                                <SearchItem item={item} key={item._id} />
                            ))}
                        </>}

                    </div>
                </div>

            </div>
        </div>
    )
}

export default List