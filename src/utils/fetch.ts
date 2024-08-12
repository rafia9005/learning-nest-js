import axios, { AxiosRequestConfig, AxiosResponse } from "axios"

export const Fetch(options: AxiosRequestConfig): Promise<AxiosResponse> => {
  return new Promise((resolve, rejects) => {
    axios(options)
    .then(res => {
        resolve(res)
      })
    .catch(err => {
        const defaultError = {
          code: err.code,
          status: 'error',
          message: err.message
        }

        return rejects(defaultError)
      })
  })
}
