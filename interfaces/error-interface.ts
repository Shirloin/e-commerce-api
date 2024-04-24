export interface IError extends Error{
    statusCode: number
    msg: string
    data: any
}