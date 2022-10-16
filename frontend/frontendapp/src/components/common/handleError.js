import React from "react";
import errorson from '../../docs/errors.json'

const errors = errorson['errors']


function handleError(errorcode){
    let myError = errors[errorcode]
    alert(myError['message'])
    if(Object.keys(myError).includes('details'))
    {
        return(myError['details']['redirect'])
    }
}

export default handleError;