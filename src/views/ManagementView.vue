<script setup>
import { ref } from 'vue';  
import employeeData from '../data/employee_info.json';

const employees = ref(employeeData.employeeInformation);
</script>

<template>
    <div class="employee-catalogue">
        <div class="employee-card" v-for="employee in employees" :key="employee.employeeId">
            <h3>{{ employee.name }}</h3>
            <p><strong>Position:</strong> {{ employee.position }}</p>
            <p><strong>Department:</strong> {{ employee.department }}</p>
            <p><strong>Salary:</strong> R{{ employee.salary.toLocaleString() }}</p>
            <p><strong>Employment History:</strong> {{ employee.employmentHistory }}</p>
            <p><strong>Contact:</strong> {{ employee.contact }}</p>
        </div>
    </div>
</template>

<style>
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