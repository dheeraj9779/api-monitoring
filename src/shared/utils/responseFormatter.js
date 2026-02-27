class ResponseFormatter {
    static success(data = null, message = "success", statusCode = 200){
        return{
            success: true,
            data,
            message,
            statusCode,
            timeStamp: new Date().toISOString()
        }
    }

    static error(message = "success", statusCode = 500, error = null){
        return{
            success: false,
            message,
            error,
            statusCode,
            timeStamp: new Date().toISOString()
        }
    }

    static validationError(error = null){
        return{
            success: false,
            message: "Validation failed",
            error,
            statusCode : 400,
            timeStamp: new Date().toISOString()
        }
    }

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

