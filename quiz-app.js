class CGFQuizApp {
    constructor() {
        this.questions = [];
        this.results = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.startTime = null;
        this.endTime = null;
        
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
        this.initializeQuiz();
        this.loadAdminDashboard();
        
        // Update sync status
        this.updateSyncStatus('✅', 'Ready');
        
        console.log('✅ CGF Quiz App initialized successfully!');
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetInterface = e.target.dataset.interface;
                this.switchInterface(targetInterface);
            });
        });

        // Quiz controls
        document.getElementById('nextBtn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('prevBtn').addEventListener('click', () => this.prevQuestion());
        document.getElementById('submitBtn').addEventListener('click', () => this.submitQuiz());
        document.getElementById('retakeBtn').addEventListener('click', () => this.retakeQuiz());
        document.getElementById('viewHistoryBtn').addEventListener('click', () => this.viewHistory());

        // Admin controls
        document.getElementById('addQuestionBtn').addEventListener('click', () => this.addQuestion());
    }

    switchInterface(interfaceName) {
        // Hide all interfaces
        document.querySelectorAll('.interface').forEach(iface => {
            iface.classList.remove('active');
        });
        
        // Show target interface
        document.getElementById(interfaceName).classList.add('active');
        
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-interface="${interfaceName}"]`).classList.add('active');

        // Load interface-specific data
        if (interfaceName === 'admin-interface') {
            this.loadAdminDashboard();
        } else if (interfaceName === 'results-interface') {
            this.displayLatestResult();
        }
    }

    async loadQuestions() {
        try {
            const stored = localStorage.getItem('cgf-quiz-questions');
            if (stored) {
                this.questions = JSON.parse(stored);
            } else {
                // Default questions
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
                text: "What severity level shoul
