class ResponseFormatter {

    /**
     * 
     * @param {any} data 
     * @param {string} message 
     * @param {number} statusCode 
     * @returns {Object}
     */
    static success(data = null, message = "success", statusCode = 200){
        return{
            success: true,
            data,
            message,
            statusCode,
            timeStamp: new Date().toISOString()
        }
    }

    /**
     * 
     * @param {any} error 
     * @param {string} message 
     * @param {number} statusCode 
     * @returns {Object}
     */
    static error(message = "success", statusCode = 500, error = null){
        return{
            success: false,
            message,
            error,
            statusCode,
            timeStamp: new Date().toISOString()
        }
    }

    /**
     * 
     * @param {any} error 
     * @returns {Object}
     */
    static validationError(error = null){
        return{
            success: false,
            message: "Validation failed",
            error,
            statusCode : 400,
            timeStamp: new Date().toISOString()
        }
    }

    /**
     * 
     * @param {any} data 
     * @param {number} page 
     * @param {number} limit 
     * @param {number} total 
     * @returns {Object}
     */
    static paginate(data = null, page, limit, total){
        return{
            success: true,
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
            timeStamp: new Date().toISOString()
        }
    }
}

export default ResponseFormatter

