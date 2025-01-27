import { FC } from "react"
import { getTodaysShows } from "../../functions/fetchAnime"
import itemFilter from "../itemFilter/itemFilter"

const airingToday = () => {
    const data = getTodaysShows()
    return <>{data ? itemFilter(data!) : <p>Loading Data...</p>}</>;
}

export default airingToday