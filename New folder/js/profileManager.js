import { firebaseService } from './firebase.js';
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

class ProfileManager {
  constructor() {
    this.createPhotoModal();
  }

  /**
   * Creates a modal for displaying enlarged photos
   */
  createPhotoModal() {
    const modal = document.createElement('div');
    modal.id = 'photo-modal';
    modal.className = 'photo-modal';
    modal.innerHTML = `
      <div class="photo-modal-content">
        <span class="photo-modal-close">&times;</span>
        <img id="photo-modal-image" src="" alt="Enlarged photo">
      </div>
    `;
    document.body.appendChild(modal);

    // Close modal when clicking the close button
    const closeBtn = modal.querySelector('.photo-modal-close');
    closeBtn.onclick = () => this.closePhotoModal();

    // Close modal when clicking outside the image
    modal.onclick = (event) => {
      if (event.target === modal) {
        this.closePhotoModal();
      }
    };

    // Close modal with Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal.style.display === 'flex') {
        this.closePhotoModal();
      }
    });
  }

  /**
   * Close the photo modal
   */
  closePhotoModal() {
    const modal = document.getElementById('photo-modal');
    modal.style.display = 'none';
  }

  /**
   * Retrieves the current user's profile from Firestore
   * @returns {Promise<Object>} User profile data or empty object
   */
  async getProfile() {
    const user = firebaseService.getCurrentUser();
    if (!user) {
      console.warn('No authenticated user found');
      return {};
    }
    
    try {
      const userDoc = doc(firebaseService.getDb(), 'users', user.uid);
      const userSnapshot = await getDoc(userDoc);
      
      return userSnapshot.exists() 
        ? userSnapshot.data() 
        : {};
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw new Error('Profile retrieval failed');
    }
  }

  /**
   * Saves updated profile data to Firestore
   * @param {Object} profile - Profile data to save
   * @throws {Error} If no authenticated user or save fails
   */
  async saveProfile(profile) {
    const user = firebaseService.getCurrentUser();
    if (!user) {
      throw new Error('No authenticated user');
    }
    
    try {
      const userDocRef = doc(firebaseService.getDb(), 'users', user.uid);
      await updateDoc(userDocRef, { goal: profile.goal });
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Failed to save profile:', error);
      throw error;
    }
  }

  /**
   * Loads profile data into form fields
   * @throws {Error} If loading profile fails
   */
  async loadProfile() {
    try {
      const profile = await this.getProfile();
      
      // Load 'name' from the profile and set it in the 'username' field
      this.updateFormField('username', profile.name);  // Using 'name' from Firestore to populate 'username' field
      this.updateFormField('email', profile.email);
      this.updateFormField('goal', profile.goal);
    } catch (error) {
      console.error('Error loading profile:', error);
      throw error;
    }
  }

  /**
   * Safely updates form field value
   * @param {string} fieldId - ID of the HTML input element
   * @param {string} value - Value to set
   */
  updateFormField(fieldId, value) {
    const field = document.getElementById(fieldId);
    if (field) {
      field.value = value || '';
    } else {
      console.warn(`Form field with ID '${fieldId}' not found`);
    }
  }

  /**
   * Saves progress photos as Base64 strings in Firestore.
   * @param {Array<string>} photos - Array of Base64 photo strings
   */
  async saveProgressPhotos(photos) {
    const user = firebaseService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    
    try {
      const userDocRef = doc(firebaseService.getDb(), 'users', user.uid);
      await updateDoc(userDocRef, { progressPhotos: photos });
      console.log('Progress photos saved successfully');
    } catch (error) {
      console.error('Failed to save progress photos:', error);
      throw error;
    }
  }

  /**
   * Loads progress photos from Firestore and displays them.
   */
  async loadProgressPhotos() {
    const user = firebaseService.getCurrentUser();
    if (!user) {
      console.warn('No authenticated user to load progress photos');
      return;
    }

    try {
      const userDocRef = doc(firebaseService.getDb(), 'users', user.uid);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const { progressPhotos = [] } = userSnapshot.data();
        console.log('Loaded progress photos:', progressPhotos.length);
        
        if (progressPhotos.length > 0) {
          this.displayPhotoGallery(progressPhotos);
        } else {
          console.log('No progress photos found');
          const gallery = document.getElementById('photo-gallery');
          if (gallery) {
            gallery.innerHTML = '<p class="no-photos-message">No progress photos available.</p>';
          } else {
            console.warn('Photo gallery element not found');
          }
        }
      } else {
        console.log('User document does not exist');
      }
    } catch (error) {
      console.error('Failed to load progress photos:', error);
    }
  }

  /**
   * Displays the photo gallery on the page with enhanced styling and modal support
   * @param {Array<string>} photos - Array of Base64 photo strings
   */
  displayPhotoGallery(photos) {
    const gallery = document.getElementById('photo-gallery');
    if (!gallery) {
      console.error('Photo gallery element not found');
      return;
    }

    gallery.innerHTML = ''; // Clear previous photos

    if (photos.length === 0) {
      gallery.innerHTML = '<p class="no-photos-message">No progress photos available.</p>';
      return;
    }

    photos.forEach((photo, index) => {
      // Validate Base64 string
      if (!photo || !photo.startsWith('data:image')) {
        console.warn(`Invalid photo at index ${index}:`, photo);
        return;
      }

      const photoWrapper = document.createElement('div');
      photoWrapper.className = 'photo-wrapper';

      const img = document.createElement('img');
      img.src = photo;
      img.alt = `Progress photo ${index + 1}`;
      img.className = 'photo-preview';
      img.onclick = () => this.openPhotoModal(photo);
      img.onerror = () => {
        console.error(`Failed to load image at index ${index}`);
        img.style.display = 'none';
      };

      // Add delete button for each photo
      const deleteBtn = document.createElement('button');
      deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      deleteBtn.className = 'btn-delete';
      deleteBtn.onclick = () => this.deletePhoto(index, photos);

      photoWrapper.appendChild(img);
      photoWrapper.appendChild(deleteBtn);

      gallery.appendChild(photoWrapper);
    });

    console.log(`Displayed ${photos.length} photos`);
  }

  /**
   * Opens the photo modal with the enlarged image
   * @param {string} photoSrc - Base64 string of the photo
   */
  openPhotoModal(photoSrc) {
    const modal = document.getElementById('photo-modal');
    const modalImg = document.getElementById('photo-modal-image');
    
    modalImg.src = photoSrc;
    modal.style.display = 'flex';
  }

  /**
   * Deletes a specific photo from the gallery and updates Firestore.
   * @param {number} index - Index of the photo to delete
   * @param {Array<string>} photos - Array of Base64 photo strings
   */
  async deletePhoto(index, photos) {
    photos.splice(index, 1); // Remove the photo
    await this.saveProgressPhotos(photos); // Update Firestore
    this.displayPhotoGallery(photos); // Refresh gallery
  }
}

// Handle file upload and save
document.getElementById('save-photos').addEventListener('click', async () => {
  const fileInput = document.getElementById('progress-photos');
  const files = fileInput.files;

  if (!files.length) {
    alert('Please select at least one photo');
    return;
  }

  const photos = [];
  for (const file of files) {
    const reader = new FileReader();
    reader.onload = async (event) => {
      photos.push(event.target.result); // Base64 string
      if (photos.length === files.length) {
        const user = firebaseService.getCurrentUser();
        const userDocRef = doc(firebaseService.getDb(), 'users', user.uid);
        const userSnapshot = await getDoc(userDocRef);
        let existingPhotos = [];

        if (userSnapshot.exists() && userSnapshot.data().progressPhotos) {
          existingPhotos = userSnapshot.data().progressPhotos;
        }

        const updatedPhotos = [...existingPhotos, ...photos];
        await profileManager.saveProgressPhotos(updatedPhotos);
        profileManager.displayPhotoGallery(updatedPhotos); // Show the photos
        fileInput.value = ''; // Reset input
      }
    };
    reader.readAsDataURL(file);
  }
});

// Initialize profile and photos
document.addEventListener('DOMContentLoaded', async () => {
  await profileManager.loadProfile();  // Load profile data
  await profileManager.loadProgressPhotos();  // Load photos from Firestore
});

// Add enhanced styling
const style = document.createElement('style');
style.textContent = `
    #photo-gallery {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        justify-content: center;
        padding: 20px;
        background-color: #f4f4f4;
        border-radius: 12px;
    }

    .no-photos-message {
        width: 100%;
        text-align: center;
        color: #666;
        font-style: italic;
    }

    .photo-wrapper {
        position: relative;
        transition: transform 0.3s ease;
    }

    .photo-wrapper:hover {
        transform: scale(1.05);
    }

    .photo-preview {
        width: 200px;
        height: 200px;
        object-fit: cover;
        border-radius: 12px;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        transition: box-shadow 0.3s ease;
    }

    .photo-preview:hover {
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }

    .btn-delete {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(255, 0, 0, 0.8);
        color: white;
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        cursor: pointer;
        transition: background 0.3s ease;
    }

    .btn-delete:hover {
        background: rgba(255, 0, 0, 1);
    }

    .photo-modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.9);
        align-items: center;
        justify-content: center;
    }

    .photo-modal-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
    }

    .photo-modal-content img {
        width: 100%;
        height: auto;
        max-height: 90vh;
        object-fit: contain;
    }

    .photo-modal-close {
        position: absolute;
        top: -40px;
        right: 0;
        color: white;
        font-size: 40px;
        font-weight: bold;
        cursor: pointer;
    }

    .photo-modal-close:hover {
        color: #bbb;
    }
`;
document.head.appendChild(style);

export const profileManager = new ProfileManager();