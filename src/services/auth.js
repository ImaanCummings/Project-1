export default {
  login(email, password) {
    return new Promise((resolve, reject) => {
      if (email && password) {
        const token = 'fake-jwt-' + Date.now()
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify({ email }))
        resolve({ token })
      } else {
        reject(new Error('Invalid email or password'))
      }
    })
  },
  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
  isAuthenticated() {
    return !!localStorage.getItem('token')
  },
  getUser() {
    return JSON.parse(localStorage.getItem('user') || 'null')
  }
}