class ErrorHandler extends Error {
    constructor(message,statusCode){
        super(message)   // super here refers to inbuilt Error  class
        this.statusCode = statusCode

        Error.captureStackTrace(this,this.constructor)
    }
}

module.exports = ErrorHandler