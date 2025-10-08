const handleErrors = (response: any, setErrorCallback: any) => {
    if (response.error?.data) {
        if (Array.isArray(response.error.data.errors)) {
            const errorObject: any = {};
            // Loop through each error in the array
            response.error.data.errors.forEach((error: any) => {
                // Store error messages in an object where the key is the field name (error.path)
                errorObject[error.path] = error.msg;
            });
            // Call the callback to set errors in the form state
            setErrorCallback(errorObject);
        } else if (response.error.data.message) {
            // If there is a single message error, set it directly
            setErrorCallback({ general: response.error.data.message });
        }
    }
};

export default handleErrors;
