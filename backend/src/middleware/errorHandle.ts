import { Request, Response, NextFunction } from 'express';

const errorHandle = (error: Error, req: Request, res: Response, next: NextFunction) => {
    // Extract the status code and message from the error object
    const statusCode = res.statusCode || 500;
    const message = error.message || 'Internal Server Error';

    // Log the error message
    // console.error(`An error occurred: ${message}`);

    // Respond with the extracted status code and message
    res.status(statusCode).json({ 
        'success': false,
        statusCode,
        message,
        
     });
};

export default errorHandle;
