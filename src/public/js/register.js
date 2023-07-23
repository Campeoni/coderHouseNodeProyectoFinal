const first_name = document.getElementById("first_name")
const last_name  = document.getElementById("last_name")
const email     = document.getElementById("email")
const password  = document.getElementById("password")

document.addEventListener("keydown", (event)=>{    
  if (event.key === "Enter" ) {
    registerUser()
  } 
})

const registerUser = () => {
  alert('procesando');    

  const User = {}

  User.first_name  = first_name.value
  User.last_name   = last_name.value
  User.email      = email.value
  User.password   = password.value

  const request = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(User).toString()
  }

  fetch('/api/user/register', request)
    .then(response => {
      if (response.ok) {
        window.location.href = '/';
      } else {
        alert("Datos incorrectos")
      }
    })
}