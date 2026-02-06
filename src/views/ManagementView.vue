<script setup>
import { ref, onMounted } from 'vue';
import employeeData from '../data/employee_info.json';
import { api } from '../services/api';

const employees = ref([]);

onMounted(async () => {
  try {
    const data = await api.getEmployees();
    employees.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to load employees from API:', error);
    employees.value = employeeData.employeeInformation ?? [];
  }
});
</script>

<template>
    <h1 class="heading"> Employee Management</h1>
    <div class="employee-catalogue">
        <div class="employee-card" v-for="employee in employees" :key="employee.employee_id ?? employee.employeeId">
            <h3>{{ employee.name }}</h3>
            <p><strong>Position:</strong> {{ employee.position }}</p>
            <p><strong>Department:</strong> {{ employee.department }}</p>
            <p><strong>Salary:</strong> R{{ Number(employee.salary ?? 0).toLocaleString() }}</p>
            <p><strong>Employment History:</strong> {{ employee.employment_history ?? employee.employmentHistory }}</p>
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
