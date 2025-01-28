import { FC, useState } from "react"
import { useTodaysShows } from "../../functions/fetchAnime"
import itemFilter from "../itemFilter/itemFilter"
import { AnimeDataArray } from "../../models/anime"

const airingToday = () => {
    const [data, setData] = useState<AnimeDataArray | null>(null);

    useTodaysShows(setData)

    return <>{data ? itemFilter(data!) : <p>Loading Data...</p>}</>;
}

export default airingToday