exports.Error = ((responseHeaderText, responseBodyText, responseCode=0, responseMethod="displayMessage") => {
    let objResponse = {
        responseHeaderText: responseHeaderText,
        responseBodyText: responseBodyText,
        responseCode: responseCode,
        responseMethod: responseMethod
    }
    return objResponse;
})