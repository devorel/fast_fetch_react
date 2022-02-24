import React, {useEffect, useState} from 'react';

function FastFetch({url, options, expiration, page}) {

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    function setResponse(response) {
        setData({...data, ...response});
    }

    function addTime(url) {
        let url1 = new URL(url);
        url1.searchParams.set('t', (new Date()).getTime());
        return url1.toString();
    }

    useEffect(() => {
        if (loading) {
            return;
        }
        const time = (new Date()).getTime();
        expiration = expiration || 0;
        setLoading(true);

        if (page) {
            let url1 = new URL(url);
            url1.searchParams.set('page', page);
            url = url1.toString();
        }

        if (expiration && window.localStorage.getItem(url) != null) {
            let dataStorage = JSON.parse(window.localStorage.getItem(url));
            if (time < (dataStorage.timestamp + expiration)) {
                setResponse(dataStorage.data);
                setError(null);
                setLoading(false);
                return
            }
        }

        fetch(addTime(url), options)
            .then(res => res.json())
            .then(json => {
                if (expiration) {
                    window.localStorage.setItem(url, JSON.stringify({timestamp: time, data: json}));
                }
                setResponse(json);
                setLoading(false);
                setError(null);
            })
            .catch((error) => {
                setError(error);
                // setData(null);

            });
    }, [url, page]);

    return [loading, error, data];
}

export default FastFetch;