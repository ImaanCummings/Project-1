<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink, RouterView } from 'vue-router'
import logo from './assets/Canva Design.png'
import auth from './services/auth'

const router = useRouter()
const logoSrc = logo

const isLoggedIn = ref(auth.isAuthenticated())

const snackbar = ref({
  message: '',
  type: '',
  visible: false
})

function showMessage(message, type = 'success', duration = 3000) {
  snackbar.value.message = message
  snackbar.value.type = type
  snackbar.value.visible = true
  setTimeout(() => {
    snackbar.value.visible = false
  }, duration)
}

function logout() {
  auth.logout()
  isLoggedIn.value = false
  router.push('/')
  showMessage('Logged out successfully', 'success')
}
</script>

<template>
  <header>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <img alt="Logo" class="logo" :src="logoSrc" />
        <a class="navbar-brand" href="#">ModernTech Solutions</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div class="navbar-nav">  
            <template v-if="isLoggedIn">
              <RouterLink to="/management" class="nav-link" active-class="active">Employee Management</RouterLink>
              <RouterLink to="/payroll" class="nav-link" active-class="active">Payroll Processor</RouterLink>
              <RouterLink to="/timeOff" class="nav-link" active-class="active">Time Off & Attendance</RouterLink>
              <RouterLink to="/employee" class="nav-link" active-class="active">Employee Review</RouterLink>
              <button @click="logout" class="btn btn-logout">Logout</button>
            </template>
            <template v-else>
              <RouterLink to="/" class="nav-link" active-class="active">Login</RouterLink>
            </template>
          </div>
        </div>
      </div>
    </nav>
  </header>

  <!-- Global Snackbar -->
  <div v-if="snackbar.visible" :class="['snackbar', snackbar.type]">
    {{ snackbar.message }}
  </div>

  <RouterView @show-message="showMessage" />
</template>

<style scoped>
.container-fluid {
  padding: 0 2rem;
}

header {
  width: 100%;
  margin: 0;
  padding: 12px;
  text-align: center;
}

.logo {
  height: 100px;
  width: 100px;
  max-width: 90%;
  margin-right: 20px;
}

.navbar-brand {
  font-weight: bold;
  margin-left: 1px;
}

/* Logout button */
.btn-logout {
  margin-left: 1rem;
  padding: 0.4rem 0.8rem;
  background-color: #ef4444;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
}

.btn-logout:hover {
  background-color: #dc2626;
}

/* Snackbar */
.snackbar {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 1.5rem;
  border-radius: 6px;
  color: white;
  font-weight: 500;
  z-index: 1000;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  animation: slide-up 0.3s ease-out;
}

.snackbar.success {
  background-color: #10b981;
}

.snackbar.error {
  background-color: #ef4444;
}

@keyframes slide-up {
  from {
    transform: translateX(-50%) translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}
</style>
