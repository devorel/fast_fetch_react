import React, {useEffect, useState} from 'react';

function FastFetch(url, options, expiration) {

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    function addTime(url) {
        url = new URL(url);
        url.searchParams.append('t', (new Date()).getTime());
        return url.toString();
    }

    useEffect(() => {
        if (loading) {
            return;
        }
        const time = (new Date()).getTime();
        expiration = expiration || 0;
        setLoading(true);

        if (expiration && window.localStorage.getItem(url) != null) {
            // if (expiration && window.sessionStorage.getItem(url.toString()) != null) {
            // let data = JSON.parse(window.sessionStorage.getItem(url.toString()));
            let data = JSON.parse(window.localStorage.getItem(url));
            if (time < (data.timestamp + expiration)) {
                setData(data.data);
                setError(null);
                setLoading(false);
                return

            }
        }

        fetch(addTime(url), options)
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
                if (expiration) {
                    // window.sessionStorage.setItem(url, JSON.stringify({timestamp: time, data: data}));
                    window.localStorage.setItem(url, JSON.stringify({timestamp: time, data: data}));
                }
                setError(null);

            })
            .catch((error) => {
                setError(error);
                // setData(null);

            });
    }, [url]);

    return [loading, error, data]
}

export default FastFetch;