class CGFQuizApp {
    constructor() {
        this.questions = [];
        this.results = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.startTime = null;
        this.endTime = null;
        this.selectedCategory = 'all';
        this.filteredQuestions = [];
        this.quizStarted = false;
        
        this.init();
    }

    async init() {
        console.log('🚀 Initializing CGF Quiz App...');
        
        // Load data
        await this.loadQuestions();
        await this.loadResults();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initialize interfaces
        this.setupQuizInterface();
        this.loadAdminDashboard();
        
        // Update sync status
        this.updateSyncStatus('✅', 'Ready');
        
        console.log('✅ CGF Quiz App initialized successfully!');
    }

    setupEventListeners() {
        // Navigation
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetInterface = e.target.getAttribute('data-interface');
                this.switchInterface(targetInterface);
            });
        });

        // Quiz controls
        const startQuizBtn = document.getElementById('startQuizBtn');
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const submitBtn = document.getElementById('submitBtn');
        const retakeBtn = document.getElementById('retakeBtn');
        const viewHistoryBtn = document.getElementById('viewHistoryBtn');
        const addQuestionBtn = document.getElementById('addQuestionBtn');
        const exportBtn = document.getElementById('exportBtn');
        const importBtn = document.getElementById('importBtn');
        const clearAllBtn = document.getElementById('clearAllBtn');

        if (startQuizBtn) startQuizBtn.addEventListener('click', () => this.startQuiz());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextQuestion());
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevQuestion());
        if (submitBtn) submitBtn.addEventListener('click', () => this.submitQuiz());
        if (retakeBtn) retakeBtn.addEventListener('click', () => this.retakeQuiz());
        if (viewHistoryBtn) viewHistoryBtn.addEventListener('click', () => this.viewHistory());
        if (addQuestionBtn) addQuestionBtn.addEventListener('click', () => this.addQuestion());
        if (exportBtn) exportBtn.addEventListener('click', () => this.exportQuestions());
        if (importBtn) importBtn.addEventListener('click', () => this.importQuestions());
        if (clearAllBtn) clearAllBtn.addEventListener('click', () => this.clearAllData());
    }

    switchInterface(interfaceName) {
        // Hide all interfaces
        const interfaces = document.querySelectorAll('.interface');
        interfaces.forEach(iface => {
            iface.classList.remove('active');
        });
        
        // Show target interface
        const targetInterface = document.getElementById(interfaceName);
        if (targetInterface) {
            targetInterface.classList.add('active');
        }
        
        // Update navigation
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-interface') === interfaceName) {
                btn.classList.add('active');
            }
        });

        // Load interface-specific data
        if (interfaceName === 'admin-interface') {
            this.loadAdminDashboard();
        } else if (interfaceName === 'results-interface') {
            this.displayLatestResult();
        } else if (interfaceName === 'quiz-interface') {
            this.setupQuizInterface();
        }
    }

    async loadQuestions() {
        try {
            const stored = localStorage.getItem('cgf-quiz-questions');
            if (stored) {
                this.questions = JSON.parse(stored);
            } else {
                // Default questions with categories
                this.questions = this.getDefaultQuestions();
                await this.saveQuestions();
            }
            console.log(`📚 Loaded ${this.questions.length} questions`);
        } catch (error) {
            console.error('❌ Error loading questions:', error);
            this.questions = this.getDefaultQuestions();
        }
    }

    async loadResults() {
        try {
            const stored = localStorage.getItem('cgf-quiz-results');
            this.results = stored ? JSON.parse(stored) : [];
            console.log(`📊 Loaded ${this.results.length} results`);
        } catch (error) {
            console.error('❌ Error loading results:', error);
            this.results = [];
        }
    }

    async saveQuestions() {
        try {
            localStorage.setItem('cgf-quiz-questions', JSON.stringify(this.questions));
            console.log('💾 Questions saved locally');
        } catch (error) {
            console.error('❌ Error saving questions:', error);
        }
    }

    async saveResults() {
        try {
            localStorage.setItem('cgf-quiz-results', JSON.stringify(this.results));
            console.log('💾 Results saved locally');
        } catch (error) {
            console.error('❌ Error saving results:', error);
        }
    }

    getCategories() {
        const categories = new Set();
        this.questions.forEach(q => {
            if (q.category) categories.add(q.category);
        });
        return ['all', ...Array.from(categories).sort()];
    }

    filterQuestionsByCategory(category) {
        if (category === 'all') {
            return [...this.questions];
        }
        return this.questions.filter(q => q.category === category);
    }

    getDefaultQuestions() {
        return [
            {
                id: 1,
                text: "When should hardware failures be logged for repair?",
                answers: [
                    "Only during business hours",
                    "Immediately upon discovery",
                    "Within 24 hours",
                    "At the end of the week"
                ],
                correct: 1,
                category: "Site Repairs"
            },
            {
                id: 2,
                text: "Who creates the repair ticket and assigns it to the site DSM?",
                answers: [
                    "DCO team",
                    "DCEO team", 
                    "CGF supervisor",
                    "Security Integrator"
                ],
                correct: 2,
                category: "Site Repairs"
            },
            {
                id: 3,
                text: "What type of issues should be directed to DCO via SIM ticket?",
                answers: [
                    "Door Hardware issues",
                    "Security Hardware issues",
                    "Network Video Recorder (NVR) issues",
                    "Card reader issues"
                ],
                correct: 2,
                category: "Site Repairs"
            },
            {
                id: 4,
                text: "What should you look for when reviewing CGF activity on CCTV?",
                answers: [
                    "Guards remain awake and vigilant",
                    "Camera functionality",
                    "Discrepancies in specific areas",
                    "All of the above"
                ],
                correct: 3,
                category: "CGF Management"
            },
            {
                id: 5,
                text: "How often should DSMs meet with CGF Account Manager/Supervisor?",
                answers: [
                    "Monthly only",
                    "Quarterly",
                    "Regularly in both formal and informal meetings",
                    "Only when issues arise"
                ],
                correct: 2,
                category: "CGF Management"
            },
            {
                id: 6,
                text: "What does CICO stand for?",
                answers: [
                    "Check In Check Out",
                    "Clean In Clean Out", 
                    "Control In Control Out",
                    "Carry In Carry Out"
                ],
                correct: 1,
                category: "Red Zone Security"
            },
            {
                id: 7,
                text: "What is required for equipment to enter the Red Zone?",
                answers: [
                    "Manager approval only",
                    "Tool Identification Number (TIN)",
                    "Security badge",
                    "Written permission"
                ],
                correct: 1,
                category: "Red Zone Security"
            },
            {
                id: 8,
                text: "How long must CCTV footage be retained before deletion from tickets?",
                answers: [
                    "24 hours",
                    "48 hours",
                    "72 hours",
                    "1 week"
                ],
                correct: 2,
                category: "CGF Management"
            },
            {
                id: 9,
                text: "What severity level should be assigned if a camera goes offline and it's the only camera in a critical room?",
                answers: [
                    "Sev1",
                    "Sev2",
                    "Sev3",
                    "Sev4"
                ],
                correct: 0,
                category: "Site Repairs"
            },
            {
                id: 10,
                text: "Who owns Emergency Response Plans (ERPs)?",
                answers: [
                    "Data Center Security team",
                    "Global safety team",
                    "CGF teams",
                    "Regional security teams"
                ],
                correct: 0,
                category: "Emergency Response"
            }
        ];
    }

    setupQuizInterface() {
        this.quizStarted = false;
        
        // Populate category selector
        const categorySelect = document.getElementById('quizCategorySelect');
        if (categorySelect) {
            const categories = this.getCategories();
            categorySelect.innerHTML = '';
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat === 'all' ? 'All Categories' : cat;
                categorySelect.appendChild(option);
            });
        }

        // Reset question display
        const questionText = document.getElementById('questionText');
        if (questionText) {
            questionText.textContent = 'Select a category and click "Start Quiz" to begin...';
        }

        const answersContainer = document.getElementById('answersContainer');
        if (answersContainer) {
            answersContainer.innerHTML = '';
        }

        // Hide navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');
        
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (submitBtn) submitBtn.style.display = 'none';
    }

    startQuiz() {
        const categorySelect = document.getElementById('quizCategorySelect');
        if (categorySelect) {
            this.selectedCategory = categorySelect.value;
        }

        this.filteredQuestions = this.filterQuestionsByCategory(this.selectedCategory);
        
        if (this.filteredQuestions.length === 0) {
            this.showMessage('No questions available in this category.', 'error');
            return;
        }

        this.quizStarted = true;
        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(this.filteredQuestions.length).fill(null);
        this.startTime = new Date();
        this.endTime = null;

        // Hide category selector
        const categorySelector = document.querySelector('.category-selector');
        if (categorySelector) {
            categorySelector.style.display = 'none';
        }

        // Show navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) prevBtn.style.display = 'inline-block';
        if (nextBtn) nextBtn.style.display = 'inline-block';

        this.displayQuestion();
        this.updateProgress();
        this.updateNavigationButtons();

        const totalQuestionsEl = document.getElementById('totalQuestions');
        if (totalQuestionsEl) {
            totalQuestionsEl.textContent = this.filteredQuestions.length;
        }

        this.showMessage(`Quiz started! ${this.filteredQuestions.length} questions in ${this.selectedCategory === 'all' ? 'all categories' : this.selectedCategory}`, 'info');
    }

    displayQuestion() {
        if (this.filteredQuestions.length === 0 || !this.quizStarted) return;

        const question = this.filteredQuestions[this.currentQuestionIndex];
        const questionTextEl = document.getElementById('questionText');
        const currentQuestionEl = document.getElementById('currentQuestion');
        
        if (questionTextEl) {
            questionTextEl.textContent = `[${question.category}] ${question.text}`;
        }
        if (currentQuestionEl) {
            currentQuestionEl.textContent = this.currentQuestionIndex + 1;
        }

        const answersContainer = document.getElementById('answersContainer');
        if (!answersContainer) return;
        
        answersContainer.innerHTML = '';

        question.answers.forEach((answer, index) => {
            const answerDiv = document.createElement('div');
            answerDiv.className = 'answer-option';
            answerDiv.textContent = answer;
            
            if (this.userAnswers[this.currentQuestionIndex] === index) {
                answerDiv.classList.add('selected');
            }

            answerDiv.addEventListener('click', () => {
                // Remove selection from other answers
                const allOptions = answersContainer.querySelectorAll('.answer-option');
                allOptions.forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Select this answer
                answerDiv.classList.add('selected');
                this.userAnswers[this.currentQuestionIndex] = index;
                
                this.updateNavigationButtons();
            });

            answersContainer.appendChild(answerDiv);
        });
    }

    updateProgress() {
        const progressFill = document.getElementById('progressFill');
        if (progressFill && this.filteredQuestions.length > 0) {
            const progress = ((this.currentQuestionIndex + 1) / this.filteredQuestions.length) * 100;
            progressFill.style.width = `${progress}%`;
        }
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');

        if (prevBtn) {
            prevBtn.disabled = this.currentQuestionIndex === 0;
        }
        
        if (this.currentQuestionIndex === this.filteredQuestions.length - 1) {
            if (nextBtn) nextBtn.style.display = 'none';
            if (submitBtn) submitBtn.style.display = 'inline-block';
        } else {
            if (nextBtn) nextBtn.style.display = 'inline-block';
            if (submitBtn) submitBtn.style.display = 'none';
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.filteredQuestions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
            this.updateProgress();
            this.updateNavigationButtons();
        }
    }

    prevQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayQuestion();
            this.updateProgress();
            this.updateNavigationButtons();
        }
    }

    async submitQuiz() {
        this.endTime = new Date();
        
        // Calculate score
        let correctAnswers = 0;
        this.filteredQuestions.forEach((question, index) => {
            if (this.userAnswers[index] === question.correct) {
                correctAnswers++;
            }
        });

        const score = correctAnswers;
        const totalQuestions = this.filteredQuestions.length;
        const percentage = Math.round((score / totalQuestions) * 100);
        const duration = this.endTime - this.startTime;

        // Save result
        const result = {
            id: Date.now(),
            date: new Date().toISOString(),
            score: score,
            total: totalQuestions,
            percentage: percentage,
            duration: duration,
            category: this.selectedCategory,
            answers: [...this.userAnswers],
            questions: [...this.filteredQuestions]
        };

        this.results.push(result);
        await this.saveResults();

        // Show results
        this.displayResult(result);
        this.displayQuestionReview(result);
        this.switchInterface('results-interface');
        
        this.showMessage(`Quiz completed! Score: ${score}/${totalQuestions} (${percentage}%)`, 'success');
    }

    displayResult(result) {
        const scorePercentageEl = document.getElementById('scorePercentage');
        const scoreTextEl = document.getElementById('scoreText');
        const timeTextEl = document.getElementById('timeText');
        const dateTextEl = document.getElementById('dateText');
        const categoryTextEl = document.getElementById('categoryText');

        if (scorePercentageEl) scorePercentageEl.textContent = `${result.percentage}%`;
        if (scoreTextEl) scoreTextEl.textContent = `${result.score}/${result.total}`;
        if (timeTextEl) timeTextEl.textContent = this.formatDuration(result.duration);
        if (dateTextEl) dateTextEl.textContent = new Date(result.date).toLocaleDateString();
        if (categoryTextEl) categoryTextEl.textContent = result.category === 'all' ? 'All Categories' : result.category;

        // Update score circle color based on percentage
        const scoreCircle = document.querySelector('.score-circle');
        if (scoreCircle) {
            scoreCircle.classList.remove('low-score', 'medium-score');
            if (result.percentage < 60) {
                scoreCircle.classList.add('low-score');
            } else if (result.percentage < 80) {
                scoreCircle.classList.add('medium-score');
            }
        }
    }

    displayQuestionReview(result) {
        const reviewContainer = document.getElementById('questionReview');
        if (!reviewContainer) return;

        reviewContainer.innerHTML = '';

        result.questions.forEach((question, index) => {
            const userAnswer = result.answers[index];
            const isCorrect = userAnswer === question.correct;

            const reviewItem = document.createElement('div');
            reviewItem.className = `question-review-item ${isCorrect ? 'correct' : 'incorrect'}`;
            
            reviewItem.innerHTML = `
                <h4>${isCorrect ? '✅' : '❌'} Question ${index + 1}: [${question.category}]</h4>
                <p><strong>${question.text}</strong></p>
                <p>Your answer: ${userAnswer !== null ? question.answers[userAnswer] : 'Not answered'}</p>
                <p>Correct answer: ${question.answers[question.correct]}</p>
            `;

            reviewContainer.appendChild(reviewItem);
        });
    }

    displayLatestResult() {
        if (this.results.length > 0) {
            const latestResult = this.results[this.results.length - 1];
            this.displayResult(latestResult);
            this.displayQuestionReview(latestResult);
        }
    }

    formatDuration(ms) {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    retakeQuiz() {
        this.setupQuizInterface();
        this.switchInterface('quiz-interface');
    }

    viewHistory() {
        this.switchInterface('admin-interface');
        this.loadAdminDashboard();
        this.showMessage(`Viewing quiz history: ${this.results.length} completed quizzes`, 'info');
    }

    async addQuestion() {
        const questionText = document.getElementById('newQuestionText').value.trim();
        const categoryInput = document.getElementById('newQuestionCategory');
        const category = categoryInput ? categoryInput.value.trim() : 'Custom';
        const answerInputs = document.querySelectorAll('.answer-text');
        const correctAnswerRadio = document.querySelector('input[name="correctAnswer"]:checked');

        if (!questionText) {
            this.showMessage('Please enter a question text', 'error');
            return;
        }

        if (!category) {
            this.showMessage('Please enter a category', 'error');
            return;
        }

        const answers = Array.from(answerInputs).map(input => input.value.trim()).filter(text => text);
        
        if (answers.length < 2) {
            this.showMessage('Please provide at least 2 answers', 'error');
            return;
        }

        if (!correctAnswerRadio) {
            this.showMessage('Please select the correct answer', 'error');
            return;
        }

        const correctIndex = parseInt(correctAnswerRadio.value);
        if (correctIndex >= answers.length) {
            this.showMessage('Invalid correct answer selection', 'error');
            return;
        }

        const newQuestion = {
            id: Date.now(),
            text: questionText,
            answers: answers,
            correct: correctIndex,
            category: category
        };

        this.questions.push(newQuestion);
        await this.saveQuestions();

        // Clear form
        document.getElementById('newQuestionText').value = '';
        if (categoryInput) categoryInput.value = '';
        answerInputs.forEach(input => input.value = '');
        const radios = document.querySelectorAll('input[name="correctAnswer"]');
        radios.forEach(radio => radio.checked = false);

        this.loadAdminDashboard();
        this.showMessage('Question added successfully!', 'success');
    }

    loadAdminDashboard() {
        this.loadResultsTable();
        this.loadQuestionsList();
        this.loadCategoryFilter();
    }

    loadCategoryFilter() {
        const categories = this.getCategories();
        const filterContainer = document.getElementById('categoryFilter');
        
        if (!filterContainer) return;

        filterContainer.innerHTML = '<label>Filter by Category: </label>';
        
        const select = document.createElement('select');
        select.className = 'form-input';
        select.style.width = 'auto';
        select.style.display = 'inline-block';
        select.style.marginLeft = '10px';
        select.style.marginBottom = '0';
        
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat === 'all' ? 'All Categories' : cat;
            if (cat === this.selectedCategory) {
                option.selected = true;
            }
            select.appendChild(option);
        });

        select.addEventListener('change', (e) => {
            this.selectedCategory = e.target.value;
            this.loadQuestionsList();
        });

        filterContainer.appendChild(select);
    }

    loadResultsTable() {
        const container = document.getElementById('resultsTable');
        if (!container) return;
        
        // Keep the header
        const header = container.querySelector('.table-header');
        container.innerHTML = '';
        if (header) {
            container.appendChild(header);
        }

        if (this.results.length === 0) {
            const emptyRow = document.createElement('div');
            emptyRow.className = 'table-row';
            emptyRow.innerHTML = '<p style="text-align: center; width: 100%;">No quiz results yet.</p>';
            container.appendChild(emptyRow);
            return;
        }

        this.results.slice(-10).reverse().forEach(result => {
            const row = document.createElement('div');
            row.className = 'table-row';
            row.innerHTML = `
                <span>${new Date(result.date).toLocaleDateString()}</span>
                <span>${result.category === 'all' ? 'All' : result.category}</span>
                <span>${result.score}/${result.total} (${result.percentage}%)</span>
                <span>${this.formatDuration(result.duration)}</span>
            `;
            container.appendChild(row);
        });
    }

    loadQuestionsList() {
        const container = document.getElementById('questionsList');
        if (!container) return;
        
        container.innerHTML = '';

        if (this.questions.length === 0) {
            container.innerHTML = '<p>No questions available.</p>';
            return;
        }

        const filteredQuestions = this.filterQuestionsByCategory(this.selectedCategory);

        if (filteredQuestions.length === 0) {
            container.innerHTML = '<p>No questions in this category.</p>';
            return;
        }

        filteredQuestions.forEach((question) => {
            const questionIndex = this.questions.findIndex(q => q.id === question.id);
            const item = document.createElement('div');
            item.className = 'question-item';
            item.innerHTML = `
                <div>
                    <strong>[${question.category}]</strong> ${question.text.substring(0, 80)}${question.text.length > 80 ? '...' : ''}
                </div>
                <button class="btn btn-secondary btn-delete" data-index="${questionIndex}">Delete</button>
            `;
            container.appendChild(item);
        });

        // Add event listeners to delete buttons
        const deleteButtons = container.querySelectorAll('.btn-delete');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                this.deleteQuestion(index);
            });
        });
    }

    async deleteQuestion(index) {
        if (confirm('Are you sure you want to delete this question?')) {
            this.questions.splice(index, 1);
            await this.saveQuestions();
            this.loadAdminDashboard();
            this.showMessage('Question deleted successfully!', 'success');
        }
    }

    exportQuestions() {
        const dataStr = JSON.stringify(this.questions, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `cgf-quiz-questions-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        this.showMessage('Questions exported successfully!', 'success');
    }

    importQuestions() {
        const input = document.getElementById('importFile');
        if (!input) return;

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                const text = await file.text();
                const importedQuestions = JSON.parse(text);

                if (!Array.isArray(importedQuestions)) {
                    throw new Error('Invalid format: expected an array of questions');
                }

                // Validate questions
                importedQuestions.forEach((q, index) => {
                    if (!q.text || !q.answers || !Array.isArray(q.answers) || typeof q.correct !== 'number') {
                        throw new Error(`Invalid question format at index ${index}`);
                    }
                });

                // Merge with existing questions
                const confirm = window.confirm(`Import ${importedQuestions.length} questions? This will add to your existing questions.`);
                if (confirm) {
                    this.questions = [...this.questions, ...importedQuestions];
                    await this.saveQuestions();
                    this.loadAdminDashboard();
                    this.showMessage(`Successfully imported ${importedQuestions.length} questions!`, 'success');
                }
            } catch (error) {
                this.showMessage(`Import failed: ${error.message}`, 'error');
            }

            input.value = '';
        };

        input.click();
    }

    async clearAllData() {
        const confirm = window.confirm('Are you sure you want to clear ALL data? This will delete all questions and results. This action cannot be undone!');
        if (!confirm) return;

        const doubleConfirm = window.confirm('This is your last chance! Are you ABSOLUTELY sure?');
        if (!doubleConfirm) return;

        localStorage.removeItem('cgf-quiz-questions');
        localStorage.removeItem('cgf-quiz-results');
        
        this.questions = this.getDefaultQuestions();
        this.results = [];
        
        await this.saveQuestions();
        await this.saveResults();
        
        this.loadAdminDashboard();
        this.showMessage('All data cleared! Default questions restored.', 'info');
    }

    showMessage(text, type = 'info') {
        const container = document.getElementById('messageContainer');
        if (!container) return;
        
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        
        container.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }

    updateSyncStatus(indicator, text) {
        const indicatorEl = document.getElementById('statusIndicator');
        const textEl = document.getElementById('statusText');
        
        if (indicatorEl) indicatorEl.textContent = indicator;
        if (textEl) textEl.textContent = text;
    }
}

// Initialize the app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.quiz = new CGFQuizApp();
    });
} else {
    window.quiz = new CGFQuizApp();
}
