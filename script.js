(() => {
  const questionsDB = {
    general: [
      { q: "What is the capital of France?", a: ["Paris", "Rome", "Berlin", "Madrid"], correct: 0 },
      { q: "Which planet is known as the Red Planet?", a: ["Earth", "Mars", "Jupiter", "Venus"], correct: 1 },
      { q: "What language is primarily spoken in Brazil?", a: ["Spanish", "Portuguese", "French", "English"], correct: 1 },
      { q: "What is the largest mammal?", a: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"], correct: 1 },
      { q: "How many continents are there?", a: ["5", "6", "7", "8"], correct: 2 },
      { q: "Who wrote 'Romeo and Juliet'?", a: ["Charles Dickens", "Mark Twain", "William Shakespeare", "J.K. Rowling"], correct: 2 },
      { q: "What is H2O?", a: ["Oxygen", "Water", "Hydrogen", "Salt"], correct: 1 },
      { q: "Which country hosted the 2016 Summer Olympics?", a: ["China", "Brazil", "UK", "Russia"], correct: 1 },
      { q: "Which is the smallest prime number?", a: ["1", "0", "2", "3"], correct: 2 },
      { q: "What color do you get by mixing red and white?", a: ["Pink", "Purple", "Orange", "Brown"], correct: 0 },
      { q: "How many legs do spiders have?", a: ["6", "8", "10", "12"], correct: 1 },
      { q: "What gas do plants absorb from the air?", a: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], correct: 1 },
      { q: "Which ocean is the largest?", a: ["Atlantic", "Indian", "Arctic", "Pacific"], correct: 3 },
      { q: "Who painted the Mona Lisa?", a: ["Van Gogh", "Da Vinci", "Picasso", "Rembrandt"], correct: 1 },
      { q: "What is the boiling point of water at sea level?", a: ["90°C", "100°C", "110°C", "120°C"], correct: 1 },
    ],
    science: [
      { q: "What is the chemical symbol for gold?", a: ["Ag", "Au", "Pb", "Fe"], correct: 1 },
      { q: "How many bones are in the adult human body?", a: ["206", "201", "208", "210"], correct: 0 },
      { q: "Which planet has the most moons?", a: ["Saturn", "Jupiter", "Mars", "Neptune"], correct: 1 },
      { q: "What force keeps us on the ground?", a: ["Magnetism", "Gravity", "Friction", "Inertia"], correct: 1 },
      { q: "What part of the cell contains DNA?", a: ["Nucleus", "Ribosome", "Cytoplasm", "Membrane"], correct: 0 },
      { q: "What is the speed of light?", a: ["300,000 km/s", "150,000 km/s", "299,792 km/s", "350,000 km/s"], correct: 2 },
      { q: "Which element is a noble gas?", a: ["Oxygen", "Nitrogen", "Argon", "Hydrogen"], correct: 2 },
      { q: "What kind of waves are X-rays?", a: ["Sound Waves", "Electromagnetic Waves", "Mechanical Waves", "Radio Waves"], correct: 1 },
      { q: "Which vitamin is produced when exposed to sunlight?", a: ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"], correct: 3 },
      { q: "What is the main gas in Earth's atmosphere?", a: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], correct: 2 },
      { q: "What is the powerhouse of the cell?", a: ["Nucleus", "Chloroplast", "Mitochondria", "Ribosome"], correct: 2 },
      { q: "Which planet is closest to the sun?", a: ["Venus", "Earth", "Mercury", "Mars"], correct: 2 },
      { q: "What does DNA stand for?", a: ["Deoxyribonucleic Acid", "Deoxyribose Acid", "Dioxyribonucleic Acid", "Deoxyribonuclease Acid"], correct: 0 },
      { q: "How many teeth does an adult human have?", a: ["28", "30", "32", "34"], correct: 2 },
      { q: "What element does 'O' represent on the periodic table?", a: ["Oxygen", "Gold", "Osmium", "Oganesson"], correct: 0 },
    ]
  };

  // Elements
  const categorySelect = document.getElementById("categorySelect");
  const categoryDropdown = document.getElementById("category");
  const startBtn = document.getElementById("startBtn");
  const quizBox = document.getElementById("quizBox");
  const timerEl = document.getElementById("timer");
  const questionEl = document.getElementById("question");
  const answersList = document.getElementById("answers");
  const scoreSummary = document.getElementById("scoreSummary");
  const finalScoreEl = document.getElementById("finalScore");
  const performanceMsgEl = document.getElementById("performanceMsg");
  const restartBtn = document.getElementById("restartBtn");
  const progressBar = document.getElementById("progressBar");
  const modeToggle = document.getElementById("modeToggle");
  const header = document.getElementById("header");

  //Sounds
  const soundCorrect = document.getElementById("soundCorrect");
  const soundWrong = document.getElementById("soundWrong");
  const soundTimer = document.getElementById("soundTimer");

  //variables
  let currentCategory = "general";
  let questions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let timeLeft = 15;
  let timerId = null;
  const questionTime = 15; 
  const totalQuestions = 15;

  // Toggle dark/light mode
  function toggleMode() {
    document.body.classList.toggle("dark");
    header.classList.toggle("dark");
    progressBar.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
      modeToggle.textContent = "Light Mode";
    } else {
      modeToggle.textContent = "Dark Mode";
    }
  }
  modeToggle.addEventListener("click", toggleMode);

  // Start quiz
  startBtn.addEventListener("click", () => {
    currentCategory = categoryDropdown.value;
    questions = [...questionsDB[currentCategory]];
    shuffleArray(questions);
    questions = questions.slice(0, totalQuestions);

    currentQuestionIndex = 0;
    score = 0;

    categorySelect.style.display = "none";
    scoreSummary.style.display = "none";
    quizBox.style.display = "block";

    showQuestion();
    startTimer();
  });

  // Restart quiz
  restartBtn.addEventListener("click", () => {
    categorySelect.style.display = "block";
    scoreSummary.style.display = "none";
    quizBox.style.display = "none";
  });

  // Show question
  function showQuestion() {
    resetState();

    const currentQ = questions[currentQuestionIndex];
    questionEl.textContent = `${currentQuestionIndex + 1}. ${currentQ.q}`;

    currentQ.a.forEach((answer, index) => {
      const button = document.createElement("button");
      button.textContent = answer;
      button.setAttribute("data-index", index);
      button.setAttribute("type", "button");
      button.addEventListener("click", selectAnswer);
      answersList.appendChild(button);
    });

    updateProgressBar();
  }

  // Reset for next question
  function resetState() {
    clearInterval(timerId);
    timeLeft = questionTime;
    timerEl.textContent = `Time: ${timeLeft}s`;
    answersList.innerHTML = "";
  }

  // Select answer
  function selectAnswer(e) {
    clearInterval(timerId);
    const selectedBtn = e.target;
    const selectedIndex = Number(selectedBtn.getAttribute("data-index"));
    const correctIndex = questions[currentQuestionIndex].correct;

    // Disable all buttons
    Array.from(answersList.children).forEach(btn => {
      btn.disabled = true;
      btn.classList.remove("correct", "wrong");
    });

    if (selectedIndex === correctIndex) {
      selectedBtn.classList.add("correct");
      score++;
      soundCorrect.play();
    } else {
      selectedBtn.classList.add("wrong");
      // Highlight correct answer
      answersList.children[correctIndex].classList.add("correct");
      soundWrong.play();
    }

    setTimeout(nextQuestion, 1500);
  }

  // Timer countdown
  function startTimer() {
    timerEl.textContent = `Time: ${timeLeft}s`;

    timerId = setInterval(() => {
      timeLeft--;
      timerEl.textContent = `Time: ${timeLeft}s`;
      if (timeLeft <= 5 && timeLeft > 0) {
        soundTimer.play();
      }
      if (timeLeft <= 0) {
        clearInterval(timerId);
        showCorrectAnswer();
        setTimeout(nextQuestion, 1500);
      }
    }, 1000);
  }

  // Show correct answer if time runs out
  function showCorrectAnswer() {
    const correctIndex = questions[currentQuestionIndex].correct;
    Array.from(answersList.children).forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === correctIndex) {
        btn.classList.add("correct");
      }
    });
  }

  // Go to next question or finish
  function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
      startTimer();
    } else {
      finishQuiz();
    }
  }

  // Finish quiz
  function finishQuiz() {
    quizBox.style.display = "none";
    scoreSummary.style.display = "block";

    finalScoreEl.textContent = `You scored ${score} out of ${questions.length}`;

    let performance = "";
    const percent = (score / questions.length) * 100;
    if (percent >= 80) performance = "Excellent work! 🎉";
    else if (percent >= 50) performance = "Good job! 👍";
    else performance = "Better luck next time! 🙃";

    performanceMsgEl.textContent = performance;
  }
  

  // Update progress bar
  function updateProgressBar() {
    const progressPercent = ((currentQuestionIndex) / questions.length) * 100;
    progressBar.style.width = `${progressPercent}%`;
  }

  // Utility: Shuffle array
  function shuffleArray(arr) {
    for(let i = arr.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  })();
  (() => {
  const pauseResumeBtn = document.getElementById("pauseResumeBtn");
  const stopBtn = document.getElementById("stopBtn");

  let isPaused = false;

  // Pause/Resume handler
  pauseResumeBtn.addEventListener("click", () => {
    if (!isPaused) {
      pauseQuiz();
    } else {
      resumeQuiz();
    }
  });

  // Stop handler
  stopBtn.addEventListener("click", () => {
    stopQuiz();
  });

  // Pause quiz
  function pauseQuiz() {
    clearInterval(timerId);
    isPaused = true;
    pauseResumeBtn.textContent = "Resume";
    disableAnswers(true);
    timerEl.textContent = `Paused at: ${timeLeft}s`;
  }

  // Resume quiz
  function resumeQuiz() {
    isPaused = false;
    pauseResumeBtn.textContent = "Pause";
    disableAnswers(false);
    timerEl.textContent = `Time: ${timeLeft}s`;
    startTimer();
  }

  // Disable or enable answer buttons
  function disableAnswers(disable) {
    Array.from(answersList.children).forEach(btn => {
      btn.disabled = disable;
    });
  }

  // Stop quiz function
  function stopQuiz() {
    clearInterval(timerId);
    quizBox.style.display = "none";
    scoreSummary.style.display = "block";

    finalScoreEl.textContent = `You scored ${score} out of ${currentQuestionIndex + 1}`;

    let performance = "";
    const percent = (score / (currentQuestionIndex + 1)) * 100;
    if (percent >= 80) performance = "Excellent work! 🎉";
    else if (percent >= 50) performance = "Good job! 👍";
    else performance = "Better luck next time! 🙃";

    performanceMsgEl.textContent = performance;
  }
function showSection(sectionId) {
  const sections = document.querySelectorAll('.page-section');
  sections.forEach(section => {
    section.style.display = 'none';
  });

  document.getElementById(sectionId).style.display = 'block';
}



  // When showing question, reset pause state & button
  function showQuestion() {
    resetState();
    isPaused = false;
    pauseResumeBtn.textContent = "Pause";
    pauseResumeBtn.disabled = false;
    stopBtn.disabled = false;

    const currentQ = questions[currentQuestionIndex];
    questionEl.textContent = `${currentQuestionIndex + 1}. ${currentQ.q}`;

    currentQ.a.forEach((answer, index) => {
      const button = document.createElement("button");
      button.textContent = answer;
      button.setAttribute("data-index", index);
      button.setAttribute("type", "button");
      button.addEventListener("click", selectAnswer);
      answersList.appendChild(button);
    });

    updateProgressBar();
  }

  // When quiz ends, disable pause & stop buttons
  function finishQuiz() {
    quizBox.style.display = "none";
    scoreSummary.style.display = "block";

    pauseResumeBtn.disabled = true;
    stopBtn.disabled = true;

    finalScoreEl.textContent = `You scored ${score} out of ${questions.length}`;

    let performance = "";
    const percent = (score / questions.length) * 100;
    if (percent >= 80) performance = "Excellent work! 🎉";
    else if (percent >= 50) performance = "Good job! 👍";
    else performance = "Better luck next time! 🙃";

    performanceMsgEl.textContent = performance;
  }

  // ...rest of your existing code unchanged...

})();


