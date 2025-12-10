<script setup>
import { RouterLink, RouterView } from 'vue-router'
import logo from './assets/Canva Design.png'

const logoSrc = logo
</script>

<template>
  <header>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
         <img alt="Logo" class="logo" :src="logoSrc"> 
        <a class="navbar-brand" href="#">ModernTech Solutions</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div class="navbar-nav">
            <RouterLink to="/" class="nav-link" active-class="active">Home</RouterLink>
            <RouterLink to="/timeOff" class="nav-link" active-class="active">Time Off & Attendance</RouterLink>
            <RouterLink to="/payroll" class="nav-link" active-class="active">Payroll Processor</RouterLink>
            <RouterLink to="/management" class="nav-link" active-class="active">Employee Management</RouterLink>
            <RouterLink to="/employee" class="nav-link" active-class="active">Employee Review</RouterLink>
          </div>
        </div>
     </div> 
   </nav>
  </header>

  <RouterView />
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


.logo{
 height: 100px;
 width: 100px;
 max-width: 90%;
 margin-right: 20px;

    
}

.navbar-brand {
  font-weight: bold;
  margin-left: 1px;
} 

</style>
