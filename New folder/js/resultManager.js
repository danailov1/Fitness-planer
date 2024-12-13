// resultManager.js
import { firebaseService } from './firebase.js';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { sportsManager } from './sportsManager.js';

//DOM Loader
document.addEventListener('DOMContentLoaded', () => {
  const sportSelect = document.getElementById('sport-select');
  const distanceGroup = document.getElementById('distance').closest('.form-group');
  const weightliftingExerciseGroup = document.getElementById('weightlifting-exercise-group');
  const weightliftingDetailsGroup = document.getElementById('weightlifting-details-group');

  // Create tennis-specific group
  const tennisDetailsGroup = document.createElement('div');
  tennisDetailsGroup.id = 'tennis-details-group';
  tennisDetailsGroup.innerHTML = `
      <div class="form-group">
            <br>
          <label for="tennis-game-status">Game Status</label>
          <select id="tennis-game-status" required>
              <option value="win">Win</option>
              <option value="loss">Loss</option>
          </select>
      </div>
      <div class="form-group">
          <label for="tennis-opponent-name">Opponent Name</label>
          <input type="text" id="tennis-opponent-name" placeholder="Enter opponent's name">
      </div>
      <div class="form-group">
          <label for="tennis-score">Match Score</label>
          <input type="text" id="tennis-score" placeholder="e.g., 6-4, 7-5">
      </div>
  `;

  // Create yoga-specific group
  const yogaDetailsGroup = document.createElement('div');
  yogaDetailsGroup.id = 'yoga-details-group';
  yogaDetailsGroup.innerHTML = `
      <div class="form-group">
      <br>
          <label for="yoga-breathing-focus">Breathing and Focus (1-10)</label>
          <input type="number" id="yoga-breathing-focus" min="1" max="10" placeholder="Rate your breathing and focus">
      </div>
      <div class="form-group">
          <label for="yoga-style">Yoga Style</label>
          <select id="yoga-style">
              <option value="">Select Yoga Style</option>
              <option value="hatha">Hatha</option>
              <option value="vinyasa">Vinyasa</option>
              <option value="ashtanga">Ashtanga</option>
              <option value="yin">Yin</option>
              <option value="power">Power Yoga</option>
              <option value="restorative">Restorative</option>
              <option value="other">Other</option>
          </select>
      </div>
  `;

  // Create basketball-specific group
  const basketballDetailsGroup = document.createElement('div');
  basketballDetailsGroup.id = 'basketball-details-group';
  basketballDetailsGroup.innerHTML = `
      <div class="form-group">
            <br>
          <label for="basketball-shots-taken">Shots Taken</label>
          <input type="number" id="basketball-shots-taken" placeholder="Total shots attempted">
      </div>
      <div class="form-group">
          <label for="basketball-shots-made">Shots Made</label>
          <input type="number" id="basketball-shots-made" placeholder="Total shots successful">
      </div>
      <div class="form-group">
          <label for="basketball-points">Points</label>
          <input type="number" id="basketball-points" placeholder="Total points scored">
      </div>
      <div class="form-group">
          <label for="basketball-assists">Assists</label>
          <input type="number" id="basketball-assists" placeholder="Total assists">
      </div>
      <div class="form-group">
          <label for="basketball-rebounds">Rebounds</label>
          <input type="number" id="basketball-rebounds" placeholder="Total rebounds">
      </div>
  `;

  // Insert the groups into the DOM
  sportSelect.parentNode.insertBefore(tennisDetailsGroup, sportSelect.nextSibling);
  sportSelect.parentNode.insertBefore(yogaDetailsGroup, tennisDetailsGroup.nextSibling);
  sportSelect.parentNode.insertBefore(basketballDetailsGroup, yogaDetailsGroup.nextSibling);

  // Event listener for sport selection
  sportSelect.addEventListener('change', (event) => {
      const selectedSport = event.target.value;

      // Hide/show fields based on sport selection
      if (selectedSport === 'weightlifting') {
          distanceGroup.style.display = 'none';
          weightliftingExerciseGroup.style.display = 'block';
          weightliftingDetailsGroup.style.display = 'block';
          tennisDetailsGroup.style.display = 'none';
          yogaDetailsGroup.style.display = 'none';
          basketballDetailsGroup.style.display = 'none';
      } else if (selectedSport === 'tennis') {
          distanceGroup.style.display = 'none';
          weightliftingExerciseGroup.style.display = 'none';
          weightliftingDetailsGroup.style.display = 'none';
          tennisDetailsGroup.style.display = 'block';
          yogaDetailsGroup.style.display = 'none';
          basketballDetailsGroup.style.display = 'none';
      } else if (selectedSport === 'yoga') {
          distanceGroup.style.display = 'none';
          weightliftingExerciseGroup.style.display = 'none';
          weightliftingDetailsGroup.style.display = 'none';
          tennisDetailsGroup.style.display = 'none';
          yogaDetailsGroup.style.display = 'block';
          basketballDetailsGroup.style.display = 'none';
      } else if (selectedSport === 'basketball') {
          distanceGroup.style.display = 'none';
          weightliftingExerciseGroup.style.display = 'none';
          weightliftingDetailsGroup.style.display = 'none';
          tennisDetailsGroup.style.display = 'none';
          yogaDetailsGroup.style.display = 'none';
          basketballDetailsGroup.style.display = 'block';
      } else {
          distanceGroup.style.display = 'block';
          weightliftingExerciseGroup.style.display = 'none';
          weightliftingDetailsGroup.style.display = 'none';
          tennisDetailsGroup.style.display = 'none';
          yogaDetailsGroup.style.display = 'none';
          basketballDetailsGroup.style.display = 'none';
      }
  });

  // Initialize form state on page load
  const initialSport = sportSelect.value;
  if (initialSport === 'weightlifting') {
      distanceGroup.style.display = 'none';
      weightliftingExerciseGroup.style.display = 'block';
      weightliftingDetailsGroup.style.display = 'block';
      tennisDetailsGroup.style.display = 'none';
      yogaDetailsGroup.style.display = 'none';
      basketballDetailsGroup.style.display = 'none';
  } else if (initialSport === 'tennis') {
      distanceGroup.style.display = 'none';
      weightliftingExerciseGroup.style.display = 'none';
      weightliftingDetailsGroup.style.display = 'none';
      tennisDetailsGroup.style.display = 'block';
      yogaDetailsGroup.style.display = 'none';
      basketballDetailsGroup.style.display = 'none';
  } else if (initialSport === 'yoga') {
      distanceGroup.style.display = 'none';
      weightliftingExerciseGroup.style.display = 'none';
      weightliftingDetailsGroup.style.display = 'none';
      tennisDetailsGroup.style.display = 'none';
      yogaDetailsGroup.style.display = 'block';
      basketballDetailsGroup.style.display = 'none';
  } else if (initialSport === 'basketball') {
      distanceGroup.style.display = 'none';
      weightliftingExerciseGroup.style.display = 'none';
      weightliftingDetailsGroup.style.display = 'none';
      tennisDetailsGroup.style.display = 'none';
      yogaDetailsGroup.style.display = 'none';
      basketballDetailsGroup.style.display = 'block';
  } else {
      distanceGroup.style.display = 'block';
      weightliftingExerciseGroup.style.display = 'none';
      weightliftingDetailsGroup.style.display = 'none';
      tennisDetailsGroup.style.display = 'none';
      yogaDetailsGroup.style.display = 'none';
      basketballDetailsGroup.style.display = 'none';
  }
});

//Result Manager
class ResultManager {
  constructor() {
    this.resultsBody = document.getElementById('results-body');
    this.dashboardStats = {
      totalResults: document.querySelector('.total-results .stat-number'),
      recentSport: document.querySelector('.recent-sport .stat-text'),
      bestPerformance: document.querySelector('.best-performance .stat-text')
    };
  }

  async getResults() {
    try {
      const user = firebaseService.getCurrentUser();
      if (!user) return [];
      
      const q = query(
        collection(firebaseService.getDb(), 'results'), 
        where('userId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching results:', error);
      return [];
    }
  }

  async addResult(result) {
    try {
      const user = firebaseService.getCurrentUser();
      if (!user) throw new Error('No authenticated user');
      
      let resultWithUserId;
      
      // tennis results
      if (result.sport === 'tennis') {
        const tennisGameStatus = document.getElementById('tennis-game-status').value;
        const tennisOpponentName = document.getElementById('tennis-opponent-name').value;
        const tennisSCore = document.getElementById('tennis-score').value;
  
        if (!tennisGameStatus) {
          alert('Please select a game status');
          return null;
        }
  
        const tennisDetails = {
          gameStatus: tennisGameStatus,
          opponentName: tennisOpponentName,
          score: tennisSCore
        };
  
        resultWithUserId = {
          ...result,
          userId: user.uid,
          tennisDetails: tennisDetails
        };
      } 
        //weightlifting results
      else if(result.sport === 'weightlifting'){
        const weightliftingExercise = document.getElementById('weightlifting-exercise-search').value;
        const weightliftingWeight = document.getElementById('weightlifting-weight').value;
        const weightliftingReps = document.getElementById('weightlifting-reps').value;
        const weightliftingSets = document.getElementById('weightlifting-sets').value;
  
        // Validateion
        if (!weightliftingExercise) {
          alert('Please select an exercise for weightlifting');
          return null;
        }
  
        if (!weightliftingWeight || isNaN(parseFloat(weightliftingWeight)) || parseFloat(weightliftingWeight) <= 0) {
          alert('Please enter a valid weight');
          return null;
        }
  
        if (!weightliftingReps || isNaN(parseInt(weightliftingReps)) || parseInt(weightliftingReps) <= 0) {
          alert('Please enter a valid number of repetitions');
          return null;
        }
  
        if (!weightliftingSets || isNaN(parseInt(weightliftingSets)) || parseInt(weightliftingSets) <= 0) {
          alert('Please enter a valid number of sets');
          return null;
        }
  
        const weightliftingDetails = {
          exercise: weightliftingExercise,
          weight: parseFloat(weightliftingWeight),
          reps: parseInt(weightliftingReps),
          sets: parseInt(weightliftingSets)
        };
  
        // Check for additional exercises
        const additionalExercises = [];
        const additionalExerciseElements = document.querySelectorAll('.additional-exercise-group');
        
        additionalExerciseElements.forEach(group => {
          const exerciseName = group.querySelector('.additional-exercise-name').value;
          const exerciseWeight = group.querySelector('.additional-exercise-weight').value;
          const exerciseReps = group.querySelector('.additional-exercise-reps').value;
          const exerciseSets = group.querySelector('.additional-exercise-sets').value;
  
          // Only add if exercise name is provided
          if (exerciseName) {
            if (!exerciseWeight || isNaN(parseFloat(exerciseWeight)) || parseFloat(exerciseWeight) < 0) {
              alert(`Please enter a valid weight for ${exerciseName}`);
              return;
            }
  
            if (!exerciseReps || isNaN(parseInt(exerciseReps)) || parseInt(exerciseReps) <= 0) {
              alert(`Please enter a valid number of repetitions for ${exerciseName}`);
              return;
            }
  
            if (!exerciseSets || isNaN(parseInt(exerciseSets)) || parseInt(exerciseSets) <= 0) {
              alert(`Please enter a valid number of sets for ${exerciseName}`);
              return;
            }
  
            additionalExercises.push({
              exercise: exerciseName,
              weight: parseFloat(exerciseWeight),
              reps: parseInt(exerciseReps),
              sets: parseInt(exerciseSets)
            });
          }
        });
  
        resultWithUserId = {
          ...result,
          userId: user.uid,
          weightliftingDetails: weightliftingDetails,
          additionalExercises: additionalExercises
        };
      } else {
        resultWithUserId = {
          ...result,
          userId: user.uid
        };
      }


   // Yoga-specific handling
    if (result.sport === 'yoga') {
      const yogaBreathingFocus = document.getElementById('yoga-breathing-focus').value;
      const yogaStyle = document.getElementById('yoga-style').value;

      // Validation
      if (!yogaBreathingFocus || isNaN(parseInt(yogaBreathingFocus)) || 
          parseInt(yogaBreathingFocus) < 1 || parseInt(yogaBreathingFocus) > 10) {
        alert('Please enter a valid breathing and focus rating (1-10)');
        return null;
      }

      const yogaDetails = {
        breathingFocus: parseInt(yogaBreathingFocus),
        style: yogaStyle
      };

      resultWithUserId = {
        ...result,
        userId: user.uid,
        yogaDetails: yogaDetails
      };
    } 

      //basketball
    if (result.sport === 'basketball') {
      const basketballShotsTaken = document.getElementById('basketball-shots-taken').value;
      const basketballShotsMade = document.getElementById('basketball-shots-made').value;
      const basketballPoints = document.getElementById('basketball-points').value;
      const basketballAssists = document.getElementById('basketball-assists').value;
      const basketballRebounds = document.getElementById('basketball-rebounds').value;
  
      const basketballDetails = {
          shotsTaken: parseInt(basketballShotsTaken || 0),
          shotsMade: parseInt(basketballShotsMade || 0),
          points: parseInt(basketballPoints || 0),
          assists: parseInt(basketballAssists || 0),
          rebounds: parseInt(basketballRebounds || 0)
      };
  
      resultWithUserId = {
          ...result,
          userId: user.uid,
          basketballDetails: basketballDetails
      };
  }
      
      // Remove any undefined fields
      const cleanResult = JSON.parse(JSON.stringify(resultWithUserId));
      
      const docRef = await addDoc(
        collection(firebaseService.getDb(), 'results'), 
        cleanResult
      );
      await this.renderResults();
      await this.updateDashboard();
      return docRef.id;
    } catch (error) {
      console.error('Error adding result:', error);
      alert('Failed to add result. Please check your input.');
      return null;
    }
  }

  async updateResult(id, updatedResult) {
    try {
      const resultRef = doc(firebaseService.getDb(), 'results', id);
      await updateDoc(resultRef, updatedResult);
      await this.renderResults();
      await this.updateDashboard();
    } catch (error) {
      console.error('Error updating result:', error);
    }
  }

  async deleteResult(id) {
    try {
      await deleteDoc(doc(firebaseService.getDb(), 'results', id));
      await this.renderResults();
      await this.updateDashboard();
    } catch (error) {
      console.error('Error deleting result:', error);
    }
  }

  // Modify the renderResults method to handle tennis results
async renderResults(filteredResults = null) {
  try {
      const results = filteredResults || await this.getResults();
      this.resultsBody.innerHTML = '';

      results.forEach(result => {
          const row = document.createElement('tr');
          
          // tennis
          if (result.sport === 'tennis') {
              const details = result.tennisDetails;

              row.innerHTML = `
                  <td>${result.date}</td>
                  <td>Tennis</td>
                  <td>${details.opponentName}</td>
                  <td>${details.gameStatus.charAt(0).toUpperCase() + details.gameStatus.slice(1)} (${details.score || 'No Score'})</td>
                  <td>
                      <button class="edit-result" data-id="${result.id}">Edit</button>
                      <button class="delete-result" data-id="${result.id}">Delete</button>
                  </td>
              `;
          }

          // weightlifitng
          else  if (result.sport === 'weightlifting') {
            
                const details = result.weightliftingDetails;
                const additionalExercises = result.additionalExercises || [];
  
                //display for weightlifting workouts
                let exerciseDetails = `${details.exercise}: ${details.weight} kg, ${details.reps} reps, ${details.sets} sets`;
                
                // Add additional exercises if present
                if (additionalExercises.length > 0) {
                  exerciseDetails += ` | Additional Exercises: ` + 
                    additionalExercises.map(ex => 
                      `${ex.exercise} (${ex.weight} kg, ${ex.reps} reps, ${ex.sets} sets)`
                    ).join(', ');
                }
  
                row.innerHTML = `
                    <td>${result.date}</td>
                    <td>Weightlifting</td>
                    <td colspan="2">${exerciseDetails}</td>
                    <td>
                        <button class="edit-result" data-id="${result.id}">Edit</button>
                        <button class="delete-result" data-id="${result.id}">Delete</button>
                    </td>
                `;
            } else {
                //  other sports
                row.innerHTML = `
                    <td>${result.date}</td>
                    <td>${result.sport}</td>
                    <td>${result.duration} min</td>
                    <td>${result.distance || 'N/A'} km</td>
                    <td>
                        <button class="edit-result" data-id="${result.id}">Edit</button>
                        <button class="delete-result" data-id="${result.id}">Delete</button>
                    </td>
                `;
            }
            this.resultsBody.appendChild(row);

              //basketball
            if (result.sport === 'basketball') {
              const details = result.basketballDetails;
          
              row.innerHTML = `
                  <td>${result.date}</td>
                  <td>Basketball</td>
                    <td>${result.duration} min</td>
                  <td>Points: ${details.points}, Shots: ${details.shotsMade}/${details.shotsTaken}, Assists: ${details.assists}, Rebounds: ${details.rebounds}</td>
                  <td>
                      <button class="edit-result" data-id="${result.id}">Edit</button>
                      <button class="delete-result" data-id="${result.id}">Delete</button>
                  </td>
              `;
          }

            // Yoga-specific rendering
            if (result.sport === 'yoga') {
              const details = result.yogaDetails;

              row.innerHTML = `
                <td>${result.date}</td>
                <td>Yoga</td>
                <td>${result.duration} min</td>
                <td>Breathing Focus: ${details.breathingFocus}
                <td>
                  <button class="edit-result" data-id="${result.id}">Edit</button>
                  <button class="delete-result" data-id="${result.id}">Delete</button>
                </td>
              `;
            }
              });
  
        // Add event listeners for edit and delete buttons
        this.addResultEventListeners();
    } catch (error) {
        console.error('Error rendering results:', error);
    }
  }
  addResultEventListeners() {
    document.querySelectorAll('.edit-result').forEach(button => {
      button.addEventListener('click', this.handleEditResult.bind(this));
    });

    document.querySelectorAll('.delete-result').forEach(button => {
      button.addEventListener('click', this.handleDeleteResult.bind(this));
    });
  }

  async handleEditResult(event) {
    const resultId = event.target.dataset.id;
    const results = await this.getResults();
    const result = results.find(r => r.id === resultId);
    
    if (result) {
      const editModal = document.getElementById('edit-result-modal');
      const editForm = document.getElementById('edit-result-form');
      
      // Generalized input validation function
      const validateInput = (value, type, options = {}) => {
        const { 
          required = false, 
          minValue = -Infinity, 
          maxValue = Infinity, 
          minLength = 0,
          maxLength = Infinity 
        } = options;
  
        // Trim string values
        const trimmedValue = typeof value === 'string' ? value.trim() : value;
  
        // Check if required and empty
        if (required && (trimmedValue === '' || trimmedValue === null || trimmedValue === undefined)) {
          throw new Error('This field is required');
        }
  
        switch(type) {
          case 'string':
            if (trimmedValue.length < minLength) {
              throw new Error(`Minimum length is ${minLength} characters`);
            }
            if (trimmedValue.length > maxLength) {
              throw new Error(`Maximum length is ${maxLength} characters`);
            }
            return trimmedValue;
  
          case 'number':
            const numValue = typeof trimmedValue === 'string' 
              ? (type === 'int' ? parseInt(trimmedValue) : parseFloat(trimmedValue))
              : trimmedValue;
  
            if (isNaN(numValue)) {
              throw new Error('Please enter a valid number');
            }
            if (numValue < minValue) {
              throw new Error(`Minimum value is ${minValue}`);
            }
            if (numValue > maxValue) {
              throw new Error(`Maximum value is ${maxValue}`);
            }
            return numValue;
  
          case 'select':
            if (options.allowedValues && !options.allowedValues.includes(trimmedValue)) {
              throw new Error('Invalid selection');
            }
            return trimmedValue;
  
          default:
            return trimmedValue;
        }
      };
  
      // Generalized form submission handler
      const handleFormSubmission = async (e) => {
        e.preventDefault();
        
        try {
          // Create a dynamic validation map based on sport
          const validationMap = {
            weightlifting: {
              exercise: { type: 'string', required: true, minLength: 2, maxLength: 50 },
              weight: { type: 'number', required: true, minValue: 0, maxValue: 500 },
              reps: { type: 'number', required: true, minValue: 1, maxValue: 100 },
              sets: { type: 'number', required: true, minValue: 1, maxValue: 20 }
            },
            tennis: {
              gameStatus: { 
                type: 'select', 
                required: true, 
                allowedValues: ['win', 'loss'] 
              },
              opponentName: { type: 'string', maxLength: 50 },
              score: { type: 'string', maxLength: 20 }
            },
            yoga: {
              breathingFocus: { type: 'number', required: true, minValue: 1, maxValue: 10 },
              style: { 
                type: 'select', 
                required: true, 
                allowedValues: ['hatha', 'vinyasa', 'ashtanga', 'yin', 'power', 'restorative', 'other'] 
              }
            },
            basketball: {
              shotsTaken: { type: 'number', minValue: 0, maxValue: 100 },
              shotsMade: { type: 'number', minValue: 0, maxValue: 100 },
              points: { type: 'number', minValue: 0, maxValue: 100 },
              assists: { type: 'number', minValue: 0, maxValue: 50 },
              rebounds: { type: 'number', minValue: 0, maxValue: 50 }
            }
          };
  
          // Get the specific validation rules for this sport
          const sportValidationRules = validationMap[result.sport] || {};
  
          // Create the updated result object
          const updatedResult = {
            sport: validateInput(
              document.getElementById('edit-sport').value, 
              'string', 
              { required: true }
            ),
            date: validateInput(
              document.getElementById('edit-date').value, 
              'string', 
              { required: true }
            )
          };
  
          // Validate and add sport-specific details
          if (result.sport === 'weightlifting') {
            updatedResult.weightliftingDetails = {
              exercise: validateInput(
                document.getElementById('edit-exercise').value, 
                'string', 
                sportValidationRules.exercise
              ),
              weight: validateInput(
                document.getElementById('edit-weight').value, 
                'number', 
                sportValidationRules.weight
              ),
              reps: validateInput(
                document.getElementById('edit-reps').value, 
                'number', 
                sportValidationRules.reps
              ),
              sets: validateInput(
                document.getElementById('edit-sets').value, 
                'number', 
                sportValidationRules.sets
              )
            };
          } else if (result.sport === 'tennis') {
            updatedResult.tennisDetails = {
              gameStatus: validateInput(
                document.getElementById('edit-game-status').value, 
                'select', 
                sportValidationRules.gameStatus
              ),
              opponentName: validateInput(
                document.getElementById('edit-opponent-name').value, 
                'string', 
                sportValidationRules.opponentName
              ),
              score: validateInput(
                document.getElementById('edit-score').value, 
                'string', 
                sportValidationRules.score
              )
            };
          } else if (result.sport === 'yoga') {
            updatedResult.yogaDetails = {
              breathingFocus: validateInput(
                document.getElementById('edit-breathing-focus').value, 
                'number', 
                sportValidationRules.breathingFocus
              ),
              style: validateInput(
                document.getElementById('edit-yoga-style').value, 
                'select', 
                sportValidationRules.style
              )
            };
          } else if (result.sport === 'basketball') {
            updatedResult.basketballDetails = {
              shotsTaken: validateInput(
                document.getElementById('edit-shots-taken').value, 
                'number', 
                sportValidationRules.shotsTaken
              ),
              shotsMade: validateInput(
                document.getElementById('edit-shots-made').value, 
                'number', 
                sportValidationRules.shotsMade
              ),
              points: validateInput(
                document.getElementById('edit-points').value, 
                'number', 
                sportValidationRules.points
              ),
              assists: validateInput(
                document.getElementById('edit-assists').value, 
                'number', 
                sportValidationRules.assists
              ),
              rebounds: validateInput(
                document.getElementById('edit-rebounds').value, 
                'number', 
                sportValidationRules.rebounds
              )
            };
          }
  
          // Optional notes field
          updatedResult.notes = document.getElementById('edit-notes').value;
  
          // Attempt to update the result
          await this.updateResult(resultId, updatedResult);
          
          // Success feedback
          alert('Result updated successfully');
          editModal.style.display = 'none';
  
        } catch (error) {
          // Error handling
          console.error('Error updating result:', error);
          alert(`Update failed: ${error.message}`);
        }
      };
  
      // Attach the submission handler
      editForm.onsubmit = handleFormSubmission;
  
      //user's sports
      const sports = await sportsManager.getSports();
      
      // Create sport option
      const sportOptions = sports.map(sport => 
        `<option value="${sport}" ${result.sport === sport ? 'selected' : ''}>${sport.charAt(0).toUpperCase() + sport.slice(1)}</option>`
      ).join('');
      
      //edit form based on sport type
      if (result.sport === 'weightlifting') {
        //weightlifting edit form logig
        editForm.innerHTML = `
          <div class="form-group">
            <label for="edit-sport">Sport</label>
            <select id="edit-sport" required>
              ${sportOptions}
            </select>
          </div>
          <div class="form-group">
            <label for="edit-date">Date</label>
            <input type="date" id="edit-date" value="${result.date}" required>
          </div>
          <div class="form-group">
            <label for="edit-exercise">Exercise</label>
            <input type="text" id="edit-exercise" value="${result.weightliftingDetails.exercise}" required>
          </div>
          <div class="form-group">
            <label for="edit-weight">Weight (kg)</label>
            <input type="number" step="0.5" id="edit-weight" value="${result.weightliftingDetails.weight}" required>
          </div>
          <div class="form-group">
            <label for="edit-reps">Repetitions</label>
            <input type="number" id="edit-reps" value="${result.weightliftingDetails.reps}" required>
          </div>
          <div class="form-group">
            <label for="edit-sets">Sets</label>
            <input type="number" id="edit-sets" value="${result.weightliftingDetails.sets}" required>
          </div>
          <div class="form-group">
            <label for="edit-notes">Notes</label>
            <textarea id="edit-notes">${result.notes || ''}</textarea>
          </div>
          <button type="submit" class="btn-primary">Update Result</button>
        `;
        
        // Show modal
        editModal.style.display = 'block';
        
        // Handle form submission for weightlifting
        editForm.onsubmit = async (e) => {
          e.preventDefault();
          const updatedResult = {
            sport: document.getElementById('edit-sport').value,
            date: document.getElementById('edit-date').value,
            weightliftingDetails: {
              exercise: document.getElementById('edit-exercise').value,
              weight: parseFloat(document.getElementById('edit-weight').value),
              reps: parseInt(document.getElementById('edit-reps').value),
              sets: parseInt(document.getElementById('edit-sets').value)
            },
            notes: document.getElementById('edit-notes').value
          };
          
          await this.updateResult(resultId, updatedResult);
          editModal.style.display = 'none';
        };
      } else if (result.sport === 'tennis') {
        // Tennis-specific edit form
        editForm.innerHTML = `
          <div class="form-group">
            <label for="edit-sport">Sport</label>
            <select id="edit-sport" required>
              ${sportOptions}
            </select>
          </div>
          <div class="form-group">
            <label for="edit-date">Date</label>
            <input type="date" id="edit-date" value="${result.date}" required>
          </div>
          <div class="form-group">
            <label for="edit-game-status">Game Status</label>
            <select id="edit-game-status" required>
              <option value="win" ${result.tennisDetails.gameStatus === 'win' ? 'selected' : ''}>Win</option>
              <option value="loss" ${result.tennisDetails.gameStatus === 'loss' ? 'selected' : ''}>Loss</option>
            </select>
          </div>
          <div class="form-group">
            <label for="edit-opponent-name">Opponent Name</label>
            <input type="text" id="edit-opponent-name" value="${result.tennisDetails.opponentName || ''}">
          </div>
          <div class="form-group">
            <label for="edit-score">Match Score</label>
            <input type="text" id="edit-score" value="${result.tennisDetails.score || ''}">
          </div>
          <div class="form-group">
            <label for="edit-notes">Notes</label>
            <textarea id="edit-notes">${result.notes || ''}</textarea>
          </div>
          <button type="submit" class="btn-primary">Update Result</button>
        `;
        
        // Show modal
        editModal.style.display = 'block';
        
        // Handle form submission for tennis
        editForm.onsubmit = async (e) => {
          e.preventDefault();
          const updatedResult = {
            sport: document.getElementById('edit-sport').value,
            date: document.getElementById('edit-date').value,
            tennisDetails: {
              gameStatus: document.getElementById('edit-game-status').value,
              opponentName: document.getElementById('edit-opponent-name').value,
              score: document.getElementById('edit-score').value
            },
            notes: document.getElementById('edit-notes').value
          };
          
          await this.updateResult(resultId, updatedResult);
          editModal.style.display = 'none';
        };
      } else {
        // Default sport edit form
        editForm.innerHTML = `
          <div class="form-group">
            <label for="edit-sport">Sport</label>
            <select id="edit-sport" required>
              ${sportOptions}
            </select>
          </div>
          <div class="form-group">
            <label for="edit-date">Date</label>
            <input type="date" id="edit-date" value="${result.date}" required>
          </div>
          <div class="form-group">
            <label for="edit-duration">Duration (minutes)</label>
            <input type="number" id="edit-duration" value="${result.duration}" required>
          </div>
          <div class="form-group">
            <label for="edit-distance">Distance (km)</label>
            <input type="number" step="0.01" id="edit-distance" value="${result.distance || ''}">
          </div>
          <div class="form-group">
            <label for="edit-notes">Notes</label>
            <textarea id="edit-notes">${result.notes || ''}</textarea>
          </div>
          <button type="submit" class="btn-primary">Update Result</button>
        `;
        
        // Show modal
        editModal.style.display = 'block';
        
        // Handle form submission for default sports
        editForm.onsubmit = async (e) => {
          e.preventDefault();
          const updatedResult = {
            sport: document.getElementById('edit-sport').value,
            date: document.getElementById('edit-date').value,
            duration: document.getElementById('edit-duration').value,
            distance: document.getElementById('edit-distance').value,
            notes: document.getElementById('edit-notes').value
          };
          
          await this.updateResult(resultId, updatedResult);
          editModal.style.display = 'none';
        };

        if (result.sport === 'yoga') {
          editForm.innerHTML = `
            <div class="form-group">
              <label for="edit-sport">Sport</label>
              <select id="edit-sport" required>
                ${sportOptions}
              </select>
            </div>
            <div class="form-group">
              <label for="edit-date">Date</label>
              <input type="date" id="edit-date" value="${result.date}" required>
            </div>
            <div class="form-group">
              <label for="edit-breathing-focus">Breathing and Focus (1-10)</label>
              <input type="number" id="edit-breathing-focus" min="1" max="10" value="${result.yogaDetails.breathingFocus}" required>
            </div>
            <div class="form-group">
              <label for="edit-duration">Duration (minutes)</label>
              <input type="number" id="edit-duration" value="${result.yogaDetails.duration}" required>
            </div>
            <div class="form-group">
              <label for="edit-yoga-style">Yoga Style</label>
              <select id="edit-yoga-style">
                <option value="">Select Yoga Style</option>
                <option value="hatha" ${result.yogaDetails.style === 'hatha' ? 'selected' : ''}>Hatha</option>
                <option value="vinyasa" ${result.yogaDetails.style === 'vinyasa' ? 'selected' : ''}>Vinyasa</option>
                <option value="ashtanga" ${result.yogaDetails.style === 'ashtanga' ? 'selected' : ''}>Ashtanga</option>
                <option value="yin" ${result.yogaDetails.style === 'yin' ? 'selected' : ''}>Yin</option>
                <option value="power" ${result.yogaDetails.style === 'power' ? 'selected' : ''}>Power Yoga</option>
                <option value="restorative" ${result.yogaDetails.style === 'restorative' ? 'selected' : ''}>Restorative</option>
                <option value="other" ${result.yogaDetails.style === 'other' ? 'selected' : ''}>Other</option>
              </select>
            </div>
            <div class="form-group">
              <label for="edit-notes">Notes</label>
              <textarea id="edit-notes">${result.notes || ''}</textarea>
            </div>
            <button type="submit" class="btn-primary">Update Result</button>
          `;
          
          // Show modal
          editModal.style.display = 'block';
          
          // Handle form submission for yoga
          editForm.onsubmit = async (e) => {
            e.preventDefault();
            const updatedResult = {
              sport: document.getElementById('edit-sport').value,
              date: document.getElementById('edit-date').value,
              yogaDetails: {
                breathingFocus: parseInt(document.getElementById('edit-breathing-focus').value),
                duration: parseInt(document.getElementById('edit-duration').value),
                style: document.getElementById('edit-yoga-style').value
              },
              notes: document.getElementById('edit-notes').value
            };
            
            await this.updateResult(resultId, updatedResult);
            editModal.style.display = 'none';
          };
        }
        else if (result.sport === 'basketball') {
          editForm.innerHTML = `
              <div class="form-group">
                  <label for="edit-sport">Sport</label>
                  <select id="edit-sport" required>
                      ${sportOptions}
                  </select>
              </div>
              <div class="form-group">
                  <label for="edit-date">Date</label>
                  <input type="date" id="edit-date" value="${result.date}" required>
              </div>
              <div class="form-group">
                  <label for="edit-duration">Duration (minutes)</label>
                  <input type="number" id="edit-duration" value="${result.basketballDetails.duration}" required>
              </div>
              <div class="form-group">
                  <label for="edit-shots-taken">Shots Taken</label>
                  <input type="number" id="edit-shots-taken" value="${result.basketballDetails.shotsTaken}">
              </div>
              <div class="form-group">
                  <label for="edit-shots-made">Shots Made</label>
                  <input type="number" id="edit-shots-made" value="${result.basketballDetails.shotsMade}">
              </div>
              <div class="form-group">
                  <label for="edit-points">Points</label>
                  <input type="number" id="edit-points" value="${result.basketballDetails.points}">
              </div>
              <div class="form-group">
                  <label for="edit-assists">Assists</label>
                  <input type="number" id="edit-assists" value="${result.basketballDetails.assists}">
              </div>
              <div class="form-group">
                  <label for="edit-rebounds">Rebounds</label>
                  <input type="number" id="edit-rebounds" value="${result.basketballDetails.rebounds}">
              </div>
              <div class="form-group">
                  <label for="edit-notes">Notes</label>
                  <textarea id="edit-notes">${result.notes || ''}</textarea>
              </div>
              <button type="submit" class="btn-primary">Update Result</button>
          `;
          
          // Show modal
          editModal.style.display = 'block';
          
          // Handle form submission for basketball
          editForm.onsubmit = async (e) => {
              e.preventDefault();
              const updatedResult = {
                  sport: document.getElementById('edit-sport').value,
                  date: document.getElementById('edit-date').value,
                  basketballDetails: {
                      duration: parseInt(document.getElementById('edit-duration').value),
                      shotsTaken: parseInt(document.getElementById('edit-shots-taken').value),
                      shotsMade: parseInt(document.getElementById('edit-shots-made').value),
                      points: parseInt(document.getElementById('edit-points').value),
                      assists: parseInt(document.getElementById('edit-assists').value),
                      rebounds: parseInt(document.getElementById('edit-rebounds').value)
                  },
                  notes: document.getElementById('edit-notes').value
              };
              
              await this.updateResult(resultId, updatedResult);
              editModal.style.display = 'none';
          };
      }
      }
      // Close modal functionality
      document.querySelector('.close-modal').onclick = () => {
        editModal.style.display = 'none';
      };
    }
  }

  async handleDeleteResult(event) {
    const resultId = event.target.dataset.id;
    if (confirm('Are you sure you want to delete this result?')) {
      await this.deleteResult(resultId);
    }
  }
  async updateDashboard() {
    try {
        const results = await this.getResults();

        // Total Results
        this.dashboardStats.totalResults.textContent = results.length;

        // Most Recent Sport
        if (results.length > 0) {
            const latestResult = results[results.length - 1];
            this.dashboardStats.recentSport.textContent = latestResult.sport;

            // Determine Best Performance
            let bestResult = null;

            for (const result of results) {
                const { sport } = result;

                if (sport === 'running' || sport === 'cycling') {
                    const performance = parseFloat(result.distance || 0);
                    if (!bestResult || performance > bestResult.performance) {
                        bestResult = { sport, performance, detail: `${performance} km` };
                    }
                } else if (sport === 'weightlifting') {
                    const { weightliftingDetails } = result;
                    const performance = weightliftingDetails.weight * weightliftingDetails.reps * weightliftingDetails.sets;
                    if (!bestResult || performance > bestResult.performance) {
                        bestResult = { sport, performance, detail: `${performance} total kg lifted` };
                    }
                } else if (sport === 'basketball') {
                    const { basketballDetails } = result;
                    const performance = basketballDetails.points;
                    if (!bestResult || performance > bestResult.performance) {
                        bestResult = { sport, performance, detail: `${performance} points` };
                    }
                } else if (sport === 'yoga') {
                    const { yogaDetails } = result;
                    const performance = yogaDetails.breathingFocus;
                    if (!bestResult || performance > bestResult.performance) {
                        bestResult = { sport, performance, detail: `Breathing Focus: ${performance}/10` };
                    }
                } else if (sport === 'tennis') {
                    const { tennisDetails } = result;
                    const performance = tennisDetails.gameStatus === 'win' ? 1 : 0;
                    if (!bestResult || performance > bestResult.performance) {
                        bestResult = { sport, performance, detail: `${tennisDetails.score || 'No Score'} (${tennisDetails.gameStatus})` };
                    }
                }
            }

            // Update the dashboard with the best performance
            if (bestResult) {
                this.dashboardStats.bestPerformance.textContent = `${bestResult.sport} - ${bestResult.detail}`;
            }
        }
    } catch (error) {
        console.error('Error updating dashboard:', error);
    }
}


}


// Fetch exercises dynamically from the raw JSON file API
async function fetchExercises() {
  try {
      const response = await fetch('https://raw.githubusercontent.com/danailov1/Json-Emoji/refs/heads/main/excises.json');
      if (!response.ok) throw new Error('Failed to fetch exercises');
      const data = await response.json();
      return data.exercises; // Assuming the JSON format has an "exercises" array
  } catch (error) {
      console.error('Error fetching exercises:', error);
      return [];
  }
}

// Initialize and fetch exercises globally
let exercises = []; // Store fetched exercises globally
let addExerciseButton = null;
let dynamicExerciseGroups = [];

async function initializeExercises() {
  exercises = await fetchExercises();
  setupExerciseSearch('weightlifting-exercise-search', 'weightlifting-exercise-results');
}

// Setup exercise search for a specific input and results list
function setupExerciseSearch(inputId, resultsId) {
  const searchInput = document.getElementById(inputId);
  const resultsList = document.getElementById(resultsId);

  searchInput.addEventListener('input', () => {
      const searchValue = searchInput.value.toLowerCase();
      filterExercisesForInput(searchValue, resultsList);
  });

  // Hide dropdown when clicking outside
  document.addEventListener('click', (event) => {
      if (!searchInput.contains(event.target) && !resultsList.contains(event.target)) {
          resultsList.style.display = 'none';
      }
  });
}

// Filter exercises based on input
function filterExercisesForInput(searchValue, resultsList) {
  resultsList.innerHTML = ''; // Clear previous results

  if (!searchValue.trim()) {
      resultsList.style.display = 'none'; // Hide dropdown if search is empty
      return;
  }

  const filtered = exercises.filter(exercise =>
      exercise.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  filtered.forEach(exercise => {
      const listItem = document.createElement('li');
      listItem.textContent = exercise.name;
      listItem.dataset.value = exercise.id;
      listItem.addEventListener('click', () => {
          // Select the exercise and clear results
          const inputField = resultsList.previousElementSibling;
          inputField.value = exercise.name;
          resultsList.style.display = 'none';
      });
      resultsList.appendChild(listItem);
  });

  resultsList.style.display = filtered.length > 0 ? 'block' : 'none';
}

// Add new exercise fields dynamically
function addExerciseFields() {
  const additionalExercisesContainer = document.createElement('div');
  additionalExercisesContainer.className = 'additional-exercise-group';

  additionalExercisesContainer.innerHTML = `
      <div class="exercise-delete-wrapper">
          <div class="form-group">
              <label>Additional Exercise Name</label>
              <input 
                  type="text" 
                  class="additional-exercise-name" 
                  placeholder="Search or type exercise name" 
              />
              <ul class="additional-exercise-dropdown dropdown-list">
                  <!-- Dropdown results will appear here -->
              </ul>
          </div>
          <div class="form-group">
              <label>Weight (kg)</label>
              <input type="number" step="0.5" min="0" class="additional-exercise-weight" />
          </div>
          <div class="form-group">
              <label>Repetitions</label>
              <input type="number" min="1" class="additional-exercise-reps" />
          </div>
          <div class="form-group">
              <label>Sets</label>
              <input type="number" min="1" class="additional-exercise-sets" />
          </div>
          <button type="button" class="btn-delete-exercise">Delete Exercise</button>
      </div>
  `;

  // Get the weightlifting details group
  const weightliftingDetailsGroup = document.getElementById('weightlifting-details-group');
  
  // Add the new exercise group after the existing weightlifting details
  weightliftingDetailsGroup.parentNode.insertBefore(
      additionalExercisesContainer, 
      weightliftingDetailsGroup.nextSibling
  );

  // Track the dynamic exercise groups
  dynamicExerciseGroups.push(additionalExercisesContainer);

  // Add search functionality to the new exercise input
  const newSearchInput = additionalExercisesContainer.querySelector('.additional-exercise-name');
  const newResultsList = additionalExercisesContainer.querySelector('.additional-exercise-dropdown');
  const deleteButton = additionalExercisesContainer.querySelector('.btn-delete-exercise');

  newSearchInput.addEventListener('input', () => {
      const searchValue = newSearchInput.value.toLowerCase();
      filterExercisesForInput(searchValue, newResultsList);
  });

  // Hide dropdown when clicking outside
  document.addEventListener('click', (event) => {
      if (!newSearchInput.contains(event.target) && !newResultsList.contains(event.target)) {
          newResultsList.style.display = 'none';
      }
  });

  // Add delete functionality
  deleteButton.addEventListener('click', () => {
      additionalExercisesContainer.remove();
      
      // Remove from tracked groups
      const index = dynamicExerciseGroups.indexOf(additionalExercisesContainer);
      if (index > -1) {
          dynamicExerciseGroups.splice(index, 1);
      }

      // Update delete buttons visibility for remaining groups
      updateDeleteButtonsVisibility();
  });

  // Show delete button
  deleteButton.style.display = 'block';

  // Update delete buttons visibility
  updateDeleteButtonsVisibility();
}

// Update visibility of delete buttons based on number of additional exercise groups
function updateDeleteButtonsVisibility() {
  const deleteButtons = document.querySelectorAll('.btn-delete-exercise');
  
  // If it's the first additional exercise, show the delete button
  deleteButtons.forEach(button => {
      button.style.display = 'block';
  });
}

// Remove dynamically added exercise fields
function removeDynamicExerciseFields() {
  dynamicExerciseGroups.forEach(group => {
      group.remove();
  });
  dynamicExerciseGroups = [];

  // Remove the add exercise button if it exists
  if (addExerciseButton && addExerciseButton.parentNode) {
      addExerciseButton.remove();
      addExerciseButton = null;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await initializeExercises();

  const sportSelect = document.getElementById('sport-select');
  const weightliftingExerciseGroup = document.getElementById('weightlifting-exercise-group');
  const weightliftingDetailsGroup = document.getElementById('weightlifting-details-group');

  // Create the "Add Exercise" button
  addExerciseButton = document.createElement('button');
  addExerciseButton.type = 'button';
  addExerciseButton.textContent = 'Add Another Exercise';
  addExerciseButton.className = 'btn-secondary';
  addExerciseButton.style.display = 'none';  // Initially hidden

  // Insert the "Add Exercise" button after the weightlifting details group
  weightliftingDetailsGroup.parentNode.insertBefore(
      addExerciseButton, 
      weightliftingDetailsGroup.nextSibling
  );

  // Add click event to the button
  addExerciseButton.addEventListener('click', addExerciseFields);

  // Listen for sport selection changes
  sportSelect.addEventListener('change', (event) => {
      const selectedSport = event.target.value;

      if (selectedSport === 'weightlifting') {
          // Show weightlifting-specific groups
          weightliftingExerciseGroup.style.display = 'block';
          weightliftingDetailsGroup.style.display = 'block';
          
          // Show the "Add Exercise" button
          addExerciseButton.style.display = 'block';
          
          // Setup search for default exercise
          setupExerciseSearch('weightlifting-exercise-search', 'weightlifting-exercise-results');
      } else {
          // Hide weightlifting-specific groups
          weightliftingExerciseGroup.style.display = 'none';
          weightliftingDetailsGroup.style.display = 'none';
          
          // Hide the "Add Exercise" button
          addExerciseButton.style.display = 'none';
          
          // Remove any dynamically added exercise fields
          removeDynamicExerciseFields();
      }
  });
});

export const resultManager = new ResultManager();