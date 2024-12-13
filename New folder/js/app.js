// app.js
import { firebaseService } from './firebase.js';
import { sportsManager } from './sportsManager.js';
import { resultManager } from './resultManager.js';
import { profileManager } from './profileManager.js';
import { 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
class App {
  constructor() {
    this.initEventListeners();
    this.setupAuthListener();
  }

  initEventListeners() {
    const resultForm = document.getElementById('result-form');
    const addSportForm = document.getElementById('add-sport-form');
    const sportFilter = document.getElementById('sport-filter');
    const dateFilter = document.getElementById('date-filter');
    const profileForm = document.getElementById('profile-form');
    const navItems = document.querySelectorAll('.nav-item');

    // Navigation Handler
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const sectionId = item.getAttribute('data-section');
        
        navItems.forEach(n => n.classList.remove('active'));
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        
        item.classList.add('active');
        document.getElementById(sectionId).classList.add('active');
      });
    });

    // Result Form Submission
    resultForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const result = {
        sport: document.getElementById('sport-select').value,
        date: document.getElementById('date').value,
        duration: document.getElementById('duration').value,
        distance: document.getElementById('distance').value,
        notes: document.getElementById('notes').value
      };
      await resultManager.addResult(result);
      resultForm.reset();
    });

    // Sports Management
    const newSportInput = document.getElementById('new-sport-name');
    addSportForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const sportName = newSportInput.value.trim();
      if (sportName) {
        const added = await sportsManager.addSport(sportName);
        if (added) {
          newSportInput.value = ''; // Clear input on successful addition
        }
      }
    });

    // Filtering Results
    sportFilter.addEventListener('change', this.filterResults.bind(this));
    dateFilter.addEventListener('change', this.filterResults.bind(this));

    // Profile Form Submission
    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const profile = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        goal: document.getElementById('goal').value
      };
      await profileManager.saveProfile(profile);
      alert('Profile Updated Successfully!');
    });
    
  }

  async filterResults() {
    const sportFilter = document.getElementById('sport-filter');
    const dateFilter = document.getElementById('date-filter');
    
    const selectedSport = sportFilter.value;
    const selectedDate = dateFilter.value;
    
    let results = await resultManager.getResults();
    
    if (selectedSport) {
      results = results.filter(result => result.sport === selectedSport);
    }
    
    if (selectedDate) {
      results = results.filter(result => result.date === selectedDate);
    }
    
    await resultManager.renderResults(results);
  }

  setupAuthListener() {
    onAuthStateChanged(firebaseService.getAuth(), async (user) => {
      if (user) {
        // User is signed in
        await resultManager.renderResults();
        await resultManager.updateDashboard();
        
        // Initialize sports with predefined list
        await sportsManager.initializeSports();
        
        await profileManager.loadProfile();
        await profileManager.loadProgressPhotos(); // Add this line to load progress photos

      } else {
        // User is signed out
        window.location.href = 'login.html';
      }
    });
  }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  new App();
});



export default App;