const axiosConfig = {
  // eslint-disable-next-line no-undef
  baseURL: window.appAPI[process.env.VUE_APP_BUILT_MODE].server
}

// eslint-disable-next-line no-unused-vars
export const requestInterceptor = (config)=>{

}

// eslint-disable-next-line no-unused-vars
export const requestErrorHandler = (config)=>{

}

// eslint-disable-next-line no-unused-vars
export const responseInterceptor = (config)=>{

}

// eslint-disable-next-line no-unused-vars
export const responseErrorHandler = (config)=>{

}


export default axiosConfig
