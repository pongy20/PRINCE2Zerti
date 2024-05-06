document.addEventListener('DOMContentLoaded', function() {
    const questionEl = document.getElementById('question');
    const answerButtonsContainer = document.querySelector('.answers');
    const nextButton = document.getElementById('next-button');
    let currentQuestion = {};
    let correctAnswerText = '';
    let questions = [];
    let questionHistory = [];
    let correctAnswersAmount = 0;
    let givenAnswersAmount = 0;

    // Funktion zum Laden der Fragen aus der JSON-Datei
    async function loadQuestions() {
        const response = await fetch('questions.json');
        questions = await response.json();
        showRandomQuestion();
    }

    // Funktion zum Anzeigen einer zufälligen Frage und Durchmischen der Antworten
    function showRandomQuestion() {
        if (questionHistory.length === questions.length) {
            alert('Herzlichen Glückwunsch! Du hast alle Fragen durchgearbeitet... richtiger Hustler!');
            questionHistory = []; // Verlauf löschen, um von vorne zu beginnen
        } 
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * questions.length);
        } while (questionHistory.includes(randomIndex)); // Überprüfen, ob die Frage bereits gestellt wurde

        currentQuestion = questions[randomIndex];
        questionHistory.push(randomIndex); // Die Indexnummer der aktuellen Frage zum Verlauf hinzufügen

        switch (currentQuestion.solution) {
            case 'a':
                correctAnswerText = currentQuestion.a;
                break;
            case 'b':
                correctAnswerText = currentQuestion.b;
                break;
            case 'c':
                correctAnswerText = currentQuestion.c;
                break;
            case 'd':
                correctAnswerText = currentQuestion.d;
                break;
            default:
                break;
        }

        correctAnswer = currentQuestion.solution;
        questionEl.textContent = currentQuestion.question;
        
        // Antworten in einem Array mit IDs sammeln
        let answers = [
            { text: currentQuestion.a, id: 'a' },
            { text: currentQuestion.b, id: 'b' },
            { text: currentQuestion.c, id: 'c' },
            { text: currentQuestion.d, id: 'd' }
        ];
        
        // Antworten durchmischen
        shuffleArray(answers);
        
        // Antwortbuttons anzeigen
        displayAnswers(answers);
    }

    // Funktion zum Anzeigen der durchgemischten Antworten
    function displayAnswers(answers) {
        answerButtonsContainer.innerHTML = ''; // Löscht frühere Antworten
        answers.forEach(answer => {
            const button = document.createElement('button');
            button.classList.add('answer-button');
            button.textContent = answer.text;
            button.dataset.id = answer.id; // Speichert die Antwort-ID im dataset des Buttons
            button.addEventListener('click', function() {
                checkAnswer(answer.id);
            });
            answerButtonsContainer.appendChild(button);
        });
    }

    // Funktion zum Mischen der Array-Elemente
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // ES6 Destructuring-Swap
        }
    }

    // Funktion zum Aktualisieren der Statistiken
    function updateStats() {
        const correctCountEl = document.getElementById('correct-count');
        const totalCountEl = document.getElementById('total-count');
        const percentageEl = document.getElementById('percentage');

        correctCountEl.textContent = correctAnswersAmount;
        totalCountEl.textContent = givenAnswersAmount;
        const percentage = givenAnswersAmount > 0 ? (correctAnswersAmount / givenAnswersAmount * 100).toFixed(2) : 0; // Berechne den Prozentwert und runde auf zwei Dezimalstellen
        if (percentage >= 60) {
            percentageEl.classList.add('percentage-high');
        } else {
            percentageEl.classList.remove('percentage-high');
        }
        percentageEl.textContent = `${percentage}%`;
    }


    // Funktion zur Überprüfung der Antwort und Anzeige des Ergebnisses
    function checkAnswer(selectedAnswerId) {
        const selectedAnswerButton = answerButtonsContainer.querySelector(`[data-id="${selectedAnswerId}"]`);
        const selectedAnswerText = selectedAnswerButton.textContent.trim();
        const answerButtons = Array.from(answerButtonsContainer.querySelectorAll('.answer-button'));

        // Prüfen ob bereits eine Frage angeklickt ist
        let isAnswered = false;
        answerButtons.forEach(button => {
            console.log(button.classList)
            if (button.classList.contains('correct') || button.classList.contains('wrong')) {
                isAnswered = true;
            }
        });
        if (isAnswered) {
            return;
        }

        givenAnswersAmount++;

        // Markiere den Button mit der ausgewählten Antwort rot
        selectedAnswerButton.classList.add('wrong');

        // Durchlaufe alle Antwortbuttons, um die richtige Antwort zu markieren
        answerButtons.forEach(button => {
            if (button.textContent.trim() === correctAnswerText) {
                if (selectedAnswerText === correctAnswerText) {
                    correctAnswersAmount++;
                }
                button.classList.add('correct');
                button.classList.remove('wrong');
            }
        });

        // Zeige den "Nächste Frage" Button an
        nextButton.style.display = 'block';
        nextButton.style.visibility = 'visible';
        updateStats();
    }

    // Event Listener für den "Nächste Frage" Button
    nextButton.addEventListener('click', function() {
        // Verstecke den Button, um ihn für die nächste Frage wieder zu verwenden
        nextButton.style.display = 'none';
        nextButton.style.visibility = 'hidden';
        // Entferne alle Klassenmarkierungen der Antworten
        Array.from(answerButtonsContainer.children).forEach(button => {
            button.classList.remove('correct', 'wrong');
        });
        // Zeige die nächste Frage an
        showRandomQuestion();
    });

    // Fragen beim Laden der Seite initial laden
    loadQuestions();
});
