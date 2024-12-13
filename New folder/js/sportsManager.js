// sportsManager.js
import { firebaseService } from './firebase.js';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc 
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

class SportsManager {
  constructor() {
    this.predefinedSports = [
      'running', 'cycling', 'swimming', 'weightlifting', 
      'hiking', 'yoga', 'basketball', 'tennis'
    ];
    this.sportsList = document.getElementById('sports-list');
    this.sportSelects = [
      document.getElementById('sport-select'),
      document.getElementById('sport-filter')
    ];
  }

  async getSports() {
    try {
      const user = firebaseService.getCurrentUser();
      if (!user) return [];
      
      const q = query(
        collection(firebaseService.getDb(), 'sports'), 
        where('userId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data().sportName);
    } catch (error) {
      console.error('Error fetching sports:', error);
      return [];
    }
  }

  async initializeSports() {
    try {
      const user = firebaseService.getCurrentUser();
      if (!user) throw new Error('No authenticated user');

      const existingSports = await this.getSports();
      
      // Add predefined sports that don't already exist
      for (const sport of this.predefinedSports) {
        if (!existingSports.includes(sport)) {
          await addDoc(collection(firebaseService.getDb(), 'sports'), {
            userId: user.uid,
            sportName: sport
          });
        }
      }

      await this.renderSports();
      await this.updateSportSelects();
    } catch (error) {
      console.error('Error initializing sports:', error);
    }
  }

  async addSport(sportName) {
    try {
      const user = firebaseService.getCurrentUser();
      if (!user) throw new Error('No authenticated user');
      
      const sports = await this.getSports();
      const normalizedSportName = sportName.toLowerCase().trim();
      
      if (!sports.includes(normalizedSportName)) {
        await addDoc(collection(firebaseService.getDb(), 'sports'), {
          userId: user.uid,
          sportName: normalizedSportName
        });
        await this.renderSports();
        await this.updateSportSelects();
        return true;
      } else {
        alert('This sport already exists!');
        return false;
      }
    } catch (error) {
      console.error('Error adding sport:', error);
      return false;
    }
  }

  async renderSports() {
    try {
      const sports = await this.getSports();
      this.sportsList.innerHTML = '';
      sports.forEach(sport => {
        const li = document.createElement('li');
        li.textContent = sport.charAt(0).toUpperCase() + sport.slice(1);
        this.sportsList.appendChild(li);
      });
    } catch (error) {
      console.error('Error rendering sports:', error);
    }
  }

  async updateSportSelects() {
    try {
      const sports = await this.getSports();

      this.sportSelects.forEach(select => {
        // Preserve the first option (default)
        const defaultOption = select.options[0];
        select.innerHTML = '';
        select.appendChild(defaultOption);

        // Add sport options
        sports.forEach(sport => {
          const option = document.createElement('option');
          option.value = sport;
          option.textContent = sport.charAt(0).toUpperCase() + sport.slice(1);
          select.appendChild(option);
        });
      });
    } catch (error) {
      console.error('Error updating sport selects:', error);
    }
  }
}

export const sportsManager = new SportsManager();