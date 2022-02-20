import React, {useEffect, useState} from 'react';

function FastFetch(url, options, expiration) {

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const time = (new Date()).getTime();
        expiration = expiration || 0;
        setLoading(true);

        if (expiration && window.localStorage.getItem(url) != null) {
            // if (expiration && window.sessionStorage.getItem(url) != null) {
            // let data = JSON.parse(window.sessionStorage.getItem(url));
            let data = JSON.parse(window.localStorage.getItem(url));
            if (time < (data.timestamp + expiration)) {
                setData(data.data);
                setError(null);
                setLoading(false);
                return

            }
        }
        url = new URL(url);
        url.searchParams.append('t', time);
        url = url.toString()
        fetch(url, options)
            .then(res => res.json())
            .then(data => {
                setData(data);
                if (expiration) {
                    // window.sessionStorage.setItem(url, JSON.stringify({timestamp: time, data: data}));
                    window.localStorage.setItem(url, JSON.stringify({timestamp: time, data: data}));
                }
                setError(null);

            })
            .catch((error) => {
                setError(error);
                setData(null);

            }).finally(() => setLoading(false))
    }, [url, options]);

    return [loading, error, data]
}

export default FastFetch;