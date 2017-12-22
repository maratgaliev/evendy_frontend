import axios from 'axios'

const API_URL = process.env.API_URL || 'http://194.67.217.132:81'

export default axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})
