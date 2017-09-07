var style = require('./style/global-style.css')

import Demo from './demo/demo';

/*************************************************************/
/**          Global variables, elements and such            **/
/*************************************************************/

var windowHeight = window.innerHeight;

var body = document.querySelector('body');
var navContainer = document.querySelector('.navContainer');
var canvas = document.querySelector('#webgl-canvas');
var landing = document.querySelector('#landing');
var article = document.querySelector('article');

var resizableEls = [
	...document.getElementsByTagName('header'),
	...document.getElementsByTagName('section')
];

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
	if (body.scrollTop >= window.innerHeight) {
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

/**
 * Handler for window resize
 */
var onResize = function() {
	adjustCanvasSize();
	adjustNavPosition();
};

/*************************************************************/
/**           Bind resize and scroll handlers               **/
/*************************************************************/

window.addEventListener('resize', onResize);
window.addEventListener('scroll', adjustNavPosition);

canvas.addEventListener('mousemove', throttle((evt) => {
	var x = 2 * evt.clientX / canvas.width - 1;
	var y = 2 * evt.clientY / canvas.height - 1;
	Demo.draw(x, y);
}, 100));

/*************************************************************/
/**                   Start things up                       **/
/*************************************************************/

Demo.init(canvas);

adjustNavPosition();
adjustCanvasSize();

//Demo.draw();

if (module.hot) {
	module.hot.accept();
}