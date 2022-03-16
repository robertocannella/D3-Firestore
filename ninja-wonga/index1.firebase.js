const form = document.querySelector('form');
const nameField = document.querySelector('#name');
const cost = document.querySelector('#cost');
const error = document.querySelector('#error');

form.addEventListener('submit', (e) => {

    e.preventDefault();

    if (nameField.value && cost.value) {
        const item = {
            name: nameField.value,
            cost: parseInt(cost.value)
        };
        db.collection('expenses').add(item).then((res) => {
            error.textContent = '';
            nameField.value = '';
            cost.value = '';
        })
    } else
        error.textContent = 'Please enter values before submitting';

})

