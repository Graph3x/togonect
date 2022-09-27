

class FetchMe{

    constructor(url, token) {
        this.url = url;
        this.token = token;
    }

    get = () => {
        fetch("http://localhost:8000/" + this.url + '?token=' + this.token)
        .then((response) => {return response})
    }

}

export default FetchMe;