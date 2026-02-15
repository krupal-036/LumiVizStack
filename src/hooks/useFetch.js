import { useEffect, useState } from "react";

export default function useFetch(url) {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(url).then(res => res.json()).then(setData);
    }, [url]);

    return data;
}
