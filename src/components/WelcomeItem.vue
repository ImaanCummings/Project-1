<script setup>
import payroll from "../data/payroll_data.json";
import employees from "../data/employee_info.json";
</script>


<template>
  <MainLayout>
    <h2 class="text-2xl font-bold mb-4">Payroll</h2>


    <div class="bg-white p-4 rounded shadow">
      <table class="w-full">
        <thead>
          <tr class="text-left border-b">
            <th class="p-2">Employee</th>
            <th class="p-2">Hours</th>
            <th class="p-2">Rate</th>
            <th class="p-2">Total</th>
          </tr>
        </thead>


        <tbody>
          <tr
            v-for="item in payroll"
            :key="item.employee_id"
            class="border-b"
          >
            <td class="p-2">
              {{
                employees.find(emp => emp.id === item.employee_id)?.name
              }}
            </td>
            <td class="p-2">{{ item.hours_worked }}</td>
            <td class="p-2">{{ item.rate }}</td>
            <td class="p-2">{{ item.total }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </MainLayout>
</template>



