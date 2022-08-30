import axios from 'axios'
const axiosUpload = axios.create({
  headers: {
    'Content-Type': 'multipart/form-data'
  },
})

export default axiosUpload
