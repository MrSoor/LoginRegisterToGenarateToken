const spendingsCtx = document.getElementById('spendingsChart').getContext('2d');
const spendingsChart = new Chart(spendingsCtx, {
    type: 'bar',
    data: {
        labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Dec'],
        datasets: [{
            label: 'Spendings',
            data: [100, 150, 200, 250, 300, 350],
            backgroundColor: ['#6B46C1', '#6B46C1', '#6B46C1', '#6B46C1', '#6B46C1', '#6B46C1'],
            borderColor: ['#6B46C1', '#6B46C1', '#6B46C1', '#6B46C1', '#6B46C1', '#6B46C1'],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

const consumptionCtx = document.getElementById('consumptionChart').getContext('2d');
const consumptionChart = new Chart(consumptionCtx, {
    type: 'bar',
    data: {
        labels: ['Lorem', 'Lorem', 'Lorem'],
        datasets: [{
            label: 'Consumption',
            data: [50, 100, 150],
            backgroundColor: ['#6B46C1', '#6B46C1', '#6B46C1'],
            borderColor: ['#6B46C1', '#6B46C1', '#6B46C1'],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});