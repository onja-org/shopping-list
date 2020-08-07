const shoppingForm = document.querySelector('.shopping');
const list = document.querySelector('.list');

// we need an array to hold our state
let items = [];

const handleSubmit = e => {
	e.preventDefault(); // prevent the page from reloading
	const name = e.currentTarget.item.value;
	if (!name) return;
	const item = {
		name: name,
		id: Date.now(),
		complete: false,
	};
	// push it into our state
	items.push(item);
	console.info(`There are now ${items.length} item in your state`);
	e.target.reset();
	// we create our own event called "itemsUpdated"
	list.dispatchEvent(new CustomEvent('itemsUpdated'));
};

const displayItems = () => {
	const html = items
		.map(
			item =>
				`<li class="shopping-item">
                    <input 
                        value="${item.id}" 
                        ${item.complete ? 'checked' : ''}
                        type="checkbox">
                    <span class="itemName">${item.name}</span>
                    <button 
                        aria-label="Remove ${item.name}"
                        value="${item.id}"
                        >&times;</button>
                </li>`
		)
		.join('');
	list.innerHTML = html;
};

const mirrorToLocalStorage = () => {
	console.info('mirroring items to local storage');
	// convert the state (array of object) into a string
	const objectAsAString = JSON.stringify(items);
	// store this string into the local storage
	localStorage.setItem('items', objectAsAString);
};

const restoreFromLocalStorage = () => {
	console.info('Restoring from LS');
	const lsItems = JSON.parse(localStorage.getItem('items'));
	// check if there's something inside local storage
	if (lsItems) {
		// push has no limit for arguments,
		items.push(...lsItems);
		list.dispatchEvent(new CustomEvent('itemsUpdated'));
	}
};

const deleteItem = id => {
	console.log('deleting item', id);
	items = items.filter(item => item.id !== id);
	list.dispatchEvent(new CustomEvent('itemsUpdated'));
};

const markAsComplete = id => {
	console.log(id);
	const itemRef = items.find(item => item.id === id);
	itemRef.complete = !itemRef.complete;
	list.dispatchEvent(new CustomEvent('itemsUpdated'));
};

shoppingForm.addEventListener('submit', handleSubmit);
// we listen for our own event, and launch the function displayItems, when the event happens!
list.addEventListener('itemsUpdated', displayItems);
list.addEventListener('itemsUpdated', mirrorToLocalStorage);

list.addEventListener('click', function (e) {
	const id = Number(e.target.value);
	if (e.target.matches('button')) {
		deleteItem(id);
	}
	if (e.target.matches('input[type="checkbox"]')) {
		markAsComplete(id);
	}
});

restoreFromLocalStorage();

document.body.addEventListener('click', e => {
	console.log('currentTarget', e.currentTarget);
	console.log('target', e.target);
});
