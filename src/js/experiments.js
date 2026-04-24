/* DOM Experiments */

/* ----- Experiment 1: Change text on the page ----- 
What: Changes site text to become the sites evil alter ego
Why: To practice changing text with text.Content
*/

const evilHeading = document.querySelector('.site-title');
evilHeading.textContent = 'What Pet Should I Rehome?';

const evilClass = document.querySelector('label[for="classSelect"]');
evilClass.textContent = 'CLASS';
const evilSpecies = document.querySelector('label[for="speciesSelect"]');
evilSpecies.textContent = 'STINKY SPECIES';
const evilBreed = document.querySelector('label[for="breedSelect"]');
evilBreed.textContent = 'BAD BREED';

const evilButton = document.querySelector('button');
evilButton.textContent = 'More Filters'; // oOo no menu icon, SCAARYY!

/* ----- Experiment 2: Toggle a class ----- 
What: Toggles the header background to red and adds a scary box shadow
Why: To practice adding and toggling classes with classList
*/

const evilHeader = document.querySelector('.site-header');
evilHeader.classList.add('evil-header');
//evilHeader.classList.toggle('evil-header');

/* ----- Experiment 3: Count elements ----- 
What: Counts the number of pet cards and filter groups on the page
Why: I originially wanted to add a counter for how many filters are selected at any given time, 
but it needs event listeners and would be better to edit app.js, so heres practice
*/

const cardCount = document.querySelectorAll('.pet-card');
console.log(`This page has ${cardCount.length} pet cards!`);

const breedCount = document.querySelectorAll('.filter-group');
console.log(
  `This page has ${breedCount.length} different animal filters to select from!`
);

/* ----- Experiment 4: Hide and Show ----- 
What: Hides the site title, then shows it again
Why: To practice adding and removing classes with classList, originally I wanted to use it to toggle my 
more filters drawer, but I would have to change its existing aria-hidden attribute and I won't 
touch that until I'm adding event listeners to make the drawer dissapear another way
*/

const siteTitle = document.querySelector('.site-title');
siteTitle.classList.add('hidden'); // disappears
siteTitle.classList.remove('hidden'); // comes back

/* ----- Experiment 5: Child Element ----- 
What: Changes the breed name of the first pet card to "Bad Dog"
Why: To practice using child element selectors
*/

const petInfo = document.querySelector('.pet-title-row');
const oldBreed = petInfo.querySelector('.pet-subtitle');

const newBreed = document.createElement('span');
newBreed.textContent = 'Bad Dog';

petInfo.replaceChild(newBreed, oldBreed);
