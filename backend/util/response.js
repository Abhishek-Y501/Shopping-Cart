exports.Response = ((responseHeaderText, responseBodyText, responseCode=1, responseMethod="displayMessage",data) => {
    let objResponse = {
        responseHeaderText: responseHeaderText,
        responseBodyText: responseBodyText,
        responseCode: responseCode,
        responseMethod: responseMethod,
        data:data
    }
    return objResponse;
})