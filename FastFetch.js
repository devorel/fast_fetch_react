import React, {useEffect, useState} from 'react';

function FastFetch(url, options, expiration) {

    const urlOrginal=url.toString();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const time = (new Date()).getTime();
        expiration = expiration || 0;
        setLoading(true);

        if (expiration && window.localStorage.getItem(url.toString()) != null) {
            // if (expiration && window.sessionStorage.getItem(url.toString()) != null) {
            // let data = JSON.parse(window.sessionStorage.getItem(url.toString()));
            let data = JSON.parse(window.localStorage.getItem(url.toString()));
            if (time < (data.timestamp + expiration)) {
                setData(data.data);
                setError(null);
                setLoading(false);
                return

            }
        }
        url = new URL(url);
        url.searchParams.append('t', time);
        fetch(url.toString(), options)
            .then(res => res.json())
            .then(data => {
                setData(data);
                if (expiration) {
                    // window.sessionStorage.setItem(urlOrginal, JSON.stringify({timestamp: time, data: data}));
                    window.localStorage.setItem(urlOrginal.toString(), JSON.stringify({timestamp: time, data: data}));
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