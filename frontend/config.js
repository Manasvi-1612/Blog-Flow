import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig()

//for easification
export const API = publicRuntimeConfig.API_DEVELOPMENT

export const APP_NAME = publicRuntimeConfig.APP_NAME
export const DOMAIN = "http://localhost:3000"
export const GOOGLE_CLIENT_ID = publicRuntimeConfig.GOOGLE_CLIENT_ID
export const GOOGLE_CLIENT_SECRET = publicRuntimeConfig.GOOGLE_CLIENT_SECRET
