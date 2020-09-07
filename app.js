let messageDiv = document.querySelector('.message');
let countdown__wrapper = document.querySelector('.countdown__wrapper');

// Create Eventcounter class
class Event {
	constructor(event_name, event_time) {
		this.event_name = event_name;
		this.event_time = event_time;
	}
}

//classes
//User interface
class UI {
	displayEvents(myevent) {
		const due_time = myevent.event_time;
		const name = myevent.event_name;
		const div = document.createElement('div');
		div.className = 'countdown__card';

		//update the countdown every 1 second
		const updateTimeInterval = setInterval(countdown, 1000);
		function countdown() {
			// const time = updateCounter(event_date); // function to get the updated time
			const { totalMilliseconds, days, hours, mins, secs } = updateCounter(due_time); //destructuring of object
			div.innerHTML = addToDiv(days, hours, mins, secs, name, due_time);

			if (totalMilliseconds <= 0) {
				div.classList.add('expired');
				div.innerHTML = addToDiv(0, 0, 0, 0, name, due_time);
				clearInterval(updateTimeInterval);
			}
		}
		countdown();
		countdown__wrapper.appendChild(div);
	}

	setMessage(msg, color) {
		messageDiv.textContent = msg;
		messageDiv.style.color = color;
		messageDiv.style.textAlign = 'center';

		setTimeout(() => {
			messageDiv.textContent = '';
		}, 3000);
	}
	clearUserInput() {
		document.getElementById('event_name').value = '';
		document.getElementById('event_date').value = '';
	}
	deleteEventFromUI(eventCard) {
		eventCard.remove();
	}
}

//localstorage class
class Storage {
	static getEventfromLS() {
		//pull all events from local storage
		const events = JSON.parse(localStorage.getItem('events')) || [];
		return events;
	}
	static addToLS(myevent) {
		//pull events from the LS, push the new event and reset the LS
		let events = Storage.getEventfromLS();
		events.push(myevent);
		localStorage.setItem('events', JSON.stringify(events));
	}
	static addEventToUi() {
		//pull events from the local storage and display to users
		let events = Storage.getEventfromLS();
		events.forEach((event) => {
			ui.displayEvents(event);
		});
	}
	static deleteEventFromLS(eventNameToDelete) {
		let events = Storage.getEventfromLS();
		events.forEach((event, index) => {
			if (event.event_name === eventNameToDelete) {
				events.splice(index, 1); // delete the event
			}
		});
		//reset the localstorage
		localStorage.setItem('events', JSON.stringify(events));
	}
}

//Event Listiners

//pull events from local storage and disply as soon as the dom is loaded
document.addEventListener('DOMContentLoaded', () => {
	Storage.addEventToUi();
});
// initialize the user interface class
const ui = new UI();

// on submitig the event form
const form = document.getElementById('form__group');
form.addEventListener('submit', (e) => {
	e.preventDefault();

	let event_name = document.getElementById('event_name').value;
	let event_date = document.getElementById('event_date').value;

	//error checking if the form is filled or empty
	if (event_name == '' || event_date == '') {
		ui.setMessage('Please fill in the complete information', 'red');
	} else {
		let myevent = new Event(event_name, event_date);

		ui.displayEvents(myevent);

		Storage.addToLS(myevent);

		ui.setMessage('Your event has been added successfully', 'green');
		ui.clearUserInput();
	}
});

//add eventlistener to the card and use event delegation to delete an event counter,
// the deletion will be based on eventcounter name.

countdown__wrapper.addEventListener('click', (e) => {
	// console.log(e.target);
	if (e.target.classList.contains('delete__card')) {
		let elementToDelete = e.target.parentElement;
		if (confirm('Do you want to delete this eventcounter?')) {
			ui.deleteEventFromUI(elementToDelete.parentElement); // delete the eventcounter from the user interface
			Storage.deleteEventFromLS(elementToDelete.nextElementSibling.textContent); //remove from the localstorage targeting the event_name
			ui.setMessage('Event deleted successfully', 'green');
		}

		// console.log(e.target.parentElement.parentElement.nextElementSibling.textContent);
	}
});

//Functions

//Add the countdown time to the countdown card
function addToDiv(days, hours, mins, secs, name, due_date) {
	return `<a href="#">
        <i aria-hidden="true" class="far fa-times-circle delete__card"></i>
      </a>
			<h2 class="name">${name}</h2>
			<span class = "expiry__date">Expired</span>
      <div class="countdown__timmer">
        <div class="countdown__el">
          <p class="text-lg" id=days>${days}</p>
          <span>Days</span>
        </div>
        <div class="countdown__el">
          <p class="text-lg" id="hours">${format(hours)}</p>
          <span>Hours</span>
        </div>
        <div class="countdown__el">
          <p class="text-lg" id="mins">${format(mins)}</p>
          <span>Mins</span>
        </div>
        <div class="countdown__el">
          <p class="text-lg" id="seconds">${format(secs)}</p>
          <span>Seconds</span>
        </div>
			</div>
			<span class="due__date">Due Date and time: ${due_date.slice(0, 10)} ${due_date.slice(11)}</span>
		`;
}
//get the countdown time every second
function updateCounter(date) {
	const totalMilliseconds = Date.parse(date) - Date.parse(new Date());
	const totalSeconds = totalMilliseconds / 1000;
	const secs = Math.floor(totalSeconds % 60);
	const mins = Math.floor((totalSeconds / 60) % 60);
	const hours = Math.floor((totalSeconds / 3600) % 24);
	const days = Math.floor(totalSeconds / 3600 / 24);

	return {
		totalMilliseconds,
		days,
		hours,
		mins,
		secs
	};
}

function format(time) {
	return time < 10 ? `0${time}` : time;
}

// service worker
// if ('serviceWorker' in navigator) {
// 	navigator.serviceWorker
// 		.register('/sw.js')
// 		.then((res) => console.log('Service worker registered', res.scope))
// 		.catch((err) => console.log('Service worker registeration unsucessful'));
// }
