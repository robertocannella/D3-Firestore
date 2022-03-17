// grab DOM elements
const btns = document.querySelectorAll('button');
const forms = document.querySelectorAll('form');
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