// grab DOM elements
const btns = document.querySelectorAll('button');
const form = document.querySelector('form');
const formActivity = document.querySelector('form span');
const input = document.querySelector('input');
const error = document.querySelectorAll('.error');

// Button Activity
var activity = 'cycling'; //default
btns.forEach(btn => {
    btn.addEventListener('click', event => {
        // get activity
        activity = event.target.dataset.activity;

        //  active class

        btns.forEach(element => {
            element.classList.remove('active'); //remove active class for all buttons
        });
        event.target.classList.add('active'); // set active class to current selected class

        // set the id of the input field
        input.setAttribute('id', activity);

        // set text content for activity
        formActivity.textContent = activity;

    })
})

// Form Submit

form.addEventListener('submit', e => {
    e.preventDefault();

    const distance = parseInt(input.value);
    if (distance) {
        db.collection('activities').add({
            distance, // ES6 shortcut
            activity,
            date: new Date().toString()
        }).then((e) => {
            error.textContent = '';
            input.value = '';

        })
    }
    else {
        error.textContent = 'Please enter a valid distance'
    }


})

