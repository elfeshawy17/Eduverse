class AppError extends Error {

    constructor(){
        super()
    }

    create(messagge, statusCode, statusText){
        this.message = messagge;
        this.statusCode = statusCode;
        this.statusText = statusText;
        return this;
    }

}

export default new AppError();