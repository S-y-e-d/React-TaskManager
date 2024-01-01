import { useState, useEffect } from "react";

const useFetch = (url) => {

    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);
    const [isDataUpdated, setIsDataUpdated] = useState(false);

    // Dynamically adjust height to keep the same aspect ratio
    const adjustHeight = () => {
        const list = document.querySelector(".list");
        const listItems = list.children;
        for(const item of listItems){
            item.style.minHeight = 0.05*item.offsetWidth+'px';
        }
    }
    window.addEventListener('resize', adjustHeight);

    // Check when data is updated and fetch the results from the server to redisplay
    useEffect(() => {
        fetch(url)
            .then(res => {
                if (!res.ok) {
                    throw Error('Error fetching users data');
                }
                return res.json();
            })
            .then(data => {
                setData(data);
                setIsPending(false);
                setError(null);
            }).then(()=>{
                adjustHeight();
            })
            .catch(err => {
                setIsPending(false);
                setError(err.message);
            });
    }, [url, isDataUpdated]);

    return { data, isPending, error, isDataUpdated, setIsDataUpdated };

}

export default useFetch;