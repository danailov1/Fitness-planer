// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { firebaseConfig } from './config.js';

class FirebaseService {
  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);
    this.auth = getAuth(this.app);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  getDb() {
    return this.db;
  }

  getAuth() {
    return this.auth;
  }
}

export const firebaseService = new FirebaseService();