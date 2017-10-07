var style = require('./style/global-style.css')

import Demo from './demo/demo';

/*************************************************************/
/**          Global variables, elements and such            **/
/*************************************************************/

var windowHeight = window.innerHeight;

var html = document.querySelector('html');
var navContainer = document.querySelector('.navContainer');
var canvas = document.querySelector('#webgl-canvas');
var landing = document.querySelector('#landing');
var article = document.querySelector('article');

var form = document.querySelector('#emailForm');
var nameInput = document.querySelector('#nameInput');
var emailInput = document.querySelector('#emailInput');
var messageInput = document.querySelector('#messageInput');
var submitBtn = document.querySelector('#submitBtn');
var thankYouDiv = document.querySelector('#thankYou');

var resizableEls = [
	...document.getElementsByTagName('header'),
	...document.getElementsByTagName('section')
];

/**
 * Returns a function that is throttled at the given rate
 * @param  {Function} 	fn 			The function to throttle
 * @param  {Number}  	threshold 	Throttle interval, in ms
 * @return {Function}
 */
var throttle = function(fn, threshold = 250) {
	var last, timer;
	return function() {
		var args = arguments;
		var now = Date.now();
		if (last && now < last + threshold) {
			clearTimeout(timer);
			timer = setTimeout(() => {
				last = now;
				fn(...args);
			}, threshold);
		} else {
			last = now;
			fn(...args);
		}
	};
};

/**
 * Adjusts the position of the nav bar based on scroll to ensure
 * it stays anchored to the top of the page
 */
var adjustNavPosition = function() {
	if (html.scrollTop >= window.innerHeight) {
		navContainer.classList.add('lockedOnTop');
		landing.style.marginBottom = "35px";
	} else {
		navContainer.classList.remove('lockedOnTop');
		landing.style.marginBottom = "0px";
	}
};

/**
 * Adjusts the size of the canvas based on the size of the window,
 * then adjusts sizes of content elements so they fit the whole screen
 */
var adjustCanvasSize = function() {
	var landingRect = landing.getBoundingClientRect();
	canvas.width = landingRect.width;
	canvas.height = landingRect.height;
	Demo.resizeCanvas(landingRect.width, landingRect.height);

	resizableEls.forEach((el) => {
		el.style.minHeight = `${landingRect.height - 35}px`;
	});
};

// Validate functions

var validateNameInput = function() {
	nameInput.classList[(nameInput.value === '' ? 'add' : 'remove')]('invalid');
	return !nameInput.classList.contains('invalid');
};

var validateEmailInput = function() {
	emailInput.classList[(emailInput.value === '' ? 'add' : 'remove')]('invalid');
	return !emailInput.classList.contains('invalid');
};

var validateMessageInput = function() {
	messageInput.classList[(messageInput.value === '' ? 'add' : 'remove')]('invalid');
	return !messageInput.classList.contains('invalid');
};

var validateEmailForm = function() {
	var nameValid = validateNameInput();
	var emailValid = validateEmailInput();
	var messageValid = validateMessageInput();
	return nameValid && emailValid && messageValid;
};

/**
 * Submits the email form
 */
var submitEmailForm = function() {
	var http = new XMLHttpRequest();
    http.open('POST', 'http://localhost:3000/send', true);
    http.setRequestHeader('Content-type','application/json');
    var params = JSON.stringify({
    	name: nameInput.value,
    	email: emailInput.value,
    	message: messageInput.value
    });
    http.send(params);
};

/**
 * Handler for submit button clicked
 */
var onSubmit = function() {
	if (!validateEmailForm()) {
		return;
	}

	submitEmailForm();
	
	nameInput.classList.add('hidden');
	emailInput.classList.add('hidden');
	messageInput.classList.add('hidden');
	submitBtn.classList.add('hidden');

	thankYouDiv.classList.remove('hidden');
};

/**
 * Handler for window resize
 */
var onResize = function() {
	adjustCanvasSize();
	adjustNavPosition();
};

/*************************************************************/
/**                  Bind DOM handlers                      **/
/*************************************************************/

window.addEventListener('resize', onResize);
window.addEventListener('scroll', adjustNavPosition);

canvas.addEventListener('mousemove', throttle((evt) => {
	Demo.draw({x: evt.clientX, y: evt.clientY}, canvas);
}, 10));

submitBtn.addEventListener('click', onSubmit);
nameInput.addEventListener('keydown', () => setTimeout(validateNameInput, 0));
emailInput.addEventListener('keydown', () => setTimeout(validateEmailInput, 0));
messageInput.addEventListener('keydown', () => setTimeout(validateMessageInput, 0));

/*************************************************************/
/**                   Start things up                       **/
/*************************************************************/


adjustNavPosition();
adjustCanvasSize();

Demo.init(canvas);
Demo.draw({x: canvas.width / 2, y: canvas.height / 2}, canvas);

if (module.hot) {
	module.hot.accept();
}