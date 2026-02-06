<script setup>
import { ref, onMounted } from 'vue'
import employeeService from '@/services/employeeService'

const employees = ref([])
const loading = ref(false)
const error = ref('')

async function loadEmployees() {
  loading.value = true
  error.value = ''

  try {
    employees.value = await employeeService.getEmployees()
  } catch (err) {
    error.value = err
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadEmployees()
})
</script>

<template>
  <h1 class="heading">Employee Management</h1>

  <div v-if="loading">Loading employees...</div>
  <div v-if="error" style="color:red">{{ error }}</div>

  <div class="employee-catalogue">
    <div
      class="employee-card"
      v-for="employee in employees"
      :key="employee.employeeId"
    >
      <h3>{{ employee.name }}</h3>

      <p><strong>Position:</strong> {{ employee.position }}</p>

      <p><strong>Department:</strong> {{ employee.department }}</p>

      <p>
        <strong>Salary:</strong>
        R{{ Number(employee.salary || 0).toLocaleString() }}
      </p>

      <p>
        <strong>Employment History:</strong>
        {{ employee.employmentHistory }}
      </p>

      <p><strong>Contact:</strong> {{ employee.contact }}</p>
    </div>
  </div>
</template>

<style>
.heading {
  font-size: 1.875rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #333;
}

.employee-catalogue {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
    padding: 20px;
}
.employee-card {
    background-color: #04369967;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
    width: 600px;
}

h3 {
    margin-top: 0;
    color: #000000;
    font-weight: bolder;
}
</style>
