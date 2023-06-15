import axios from 'axios'

const baseDomain = import.meta.env.VITE_BASE_DOMAIN
const basePort = import.meta.env.VITE_BASE_PORT
const baseURL = `//${baseDomain}:${basePort}/api`

const headers = {
  'Content-Type': 'application/json',
}

const responseType = 'json'

export default axios.create({ baseURL, headers, responseType })
