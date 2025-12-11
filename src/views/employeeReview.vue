<script setup>
    import { ref, computed } from 'vue';

    const form = ref({
        employeeName: '',
        reviewText: ''
    });

    const reviews = ref([
        {
            id: 1,
            employeeName: 'Sibongile Nkosi',
            reviewText: 'Excellent performer, consistently meets deadlines and shows strong leadership skills.'
        },
        {
            id: 2,
            employeeName: 'Lungile Moyo',
            reviewText: 'Good technical skills, collaborates well with team members. Areas for improvement in documentation.'
        },
        {
            id: 3,
            employeeName: 'Thabo Molefe',
            reviewText: 'Reliable team member with solid work ethic. Shows initiative in problem-solving.'
        },
        {
            id: 4,
            employeeName: 'Keshav Naidoo',
            reviewText: 'Outstanding communication skills. Very receptive to feedback and continuous improvement.'
        },
        {
            id: 5,
            employeeName: 'Zanele Khumalo',
            reviewText: 'Strong analytical capabilities. Could benefit from more assertiveness in team meetings.'
        }
    ]);

    const employeeNames = [
        'Sibongile Nkosi',
        'Lungile Moyo',
        'Thabo Molefe',
        'Keshav Naidoo',
        'Zanele Khumalo',
        'Sipho Zulu',
        'Naledi Moeketsi',
        'Farai Gumbo',
        'Karabo Dlamini',
        'Fatima Patel'
    ];

    const nextId = () => {
        return Math.max(...reviews.value.map(r => r.id), 0) + 1;
    }

    const isFormValid = computed(() => {
        return form.value.employeeName.trim() !== '' && form.value.reviewText.trim() !== '';
    });

    const addReview = () => {
        if (!isFormValid.value) return
        const id = nextId();
        reviews.value.push({
            id,
            employeeName: form.value.employeeName,
            reviewText: form.value.reviewText
        });
        form.value.employeeName = '';
        form.value.reviewText = '';
    };
</script>

<template>
    <div class="form-container">
        <div class="form-box">
            <h1 class="heading">Employee Review</h1>
            <div class="mb-3">
                <label for="employeeName" class="form-label">Select Employee Name</label>
                <select v-model="form.employeeName" id="employeeName" class="form-select"> 
                    <option value="">Select</option>
                    <option value="Sibongile Nkosi">Sibongile Nkosi</option>
                    <option value="Lungile Moyo">Lungile Moyo</option>
                    <option value="Thabo Molefe">Thabo Molefe</option>
                    <option value="Keshav Naidoo">Keshav Naidoo</option>
                    <option value="Zanele Khumalo">Zanele Khumalo</option>
                    <option value="Sipho Zulu">Sipho Zulu</option>
                    <option value="Naledi Moeketsi">Naledi Moeketsi</option>
                    <option value="Farai Gumbo">Farai Gumbo</option>
                    <option value="Karabo Dlamini">Karabo Dlamini</option>
                    <option value="Fatima Patel">Fatima Patel</option>
                </select>
            </div>

            <div class="mb-3">
                <label for="reviewTextarea" class="form-label">Review</label>
                <textarea v-model="form.reviewText" id="reviewTextarea" class="form-control" rows="3"></textarea>
            </div>

            <button @click="addReview" class="btn btn-primary">Submit Review</button>
        </div>
    </div>

    <div class="review-table">
        <table class="table table-bordered border-primary">
            <thead>
                <tr>
                    <th>Employee Name</th>
                    <th>Review</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="review in reviews" :key="review.id"> 

                    <td>{{ review.employeeName }}</td>
                    <td>{{ review.reviewText }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.heading {
  font-size: 1.875rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
}

.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.form-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
}

.mb-3 {
  margin-bottom: 1.5rem;
}

.form-label {
  font-weight: bold;
  color: #000000;
  display: block;
  margin-bottom: 0.5rem;
}

.form-select,
.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-select:focus,
.form-control:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 4px rgba(37, 99, 235, 0.3);
}

.btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.btn:hover {
  background-color: #1d4ed8;
}

.review-table {
  max-width: 900px;
  margin: 3rem auto;
  padding: 0 2rem;
}

.table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table thead {
  background-color: #f3f4f6;
}

.table th,
.table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.table th {
  font-weight: bold;
  color: #333;
  border: 1px solid #dee2e6;
}

.table td {
  border: 1px solid #dee2e6;
}

.table tbody tr:hover {
  background-color: #f9fafb;
}

.table-bordered {
  border: 1px solid #dee2e6;
}

.border-primary {
  border-color: #2563eb !important;
}
</style>