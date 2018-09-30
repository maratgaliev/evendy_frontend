export default class User {
  static from (uo, token) {
    try {
      var userObj = JSON.parse(localStorage.getItem('userData'))
      return new User(userObj)
    } catch (_) {
      return null
    }
  }

  constructor ({id, email, phone, name}) {
    this.id = id
    this.email = email
    this.phone = phone
    this.name = name
  }
}
