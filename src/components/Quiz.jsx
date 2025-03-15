import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar'; // Import the Sidebar component
import Timer from './Timer';
import QuizCompletionMessage from './QuizCompletionMessage';
import '../styles/Quiz.css';
//import MyImage '../assets/podium.gif'

const Quiz = () => {
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [showQuizBox, setShowQuizBox] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userScore, setUserScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [showWrongAnswerModal, setShowWrongAnswerModal] = useState(false); // State for wrong answer modal
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [apiCalledForQuestion, setApiCalledForQuestion] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // Track if timer should pause
  const [isQuizCompleted, setIsQuizCompleted] = useState(false); //Quiz Completed or Not

  const startQuiz = () => {
    setIsQuizStarted(true);
  };

  const handleContinue = () => {
    setShowQuizBox(true); // Show the quiz box after clicking "Continue"
  };

  // Fetch questions based on the selected language
  useEffect(() => {
    const fetchQuestions = async () => {
      const language = localStorage.getItem("selectedLanguage") || "english";
      const savedLang = language.charAt(0).toUpperCase() + language.slice(1);
      const count = 0;

      try {
        const response = await fetch(
          `https://globicall.globicallservices.com/QuizIntegration/QuestionList?reportType=${savedLang}ByCount&count=${count}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setQuestions(data);
        if (data.length > 0) {
          setCurrentQuestionId(data[0].question_id);
        }
        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Handle option selection
  const handleOptionSelect = async (selectedOptionText) => {
    if (!currentQuestionId || !questions.length) return;
  
    const currentQuestion = questions.find((q) => q.question_id === currentQuestionId);
    const correctAnswer = currentQuestion.correctOption;
    const isCorrect = selectedOptionText === correctAnswer;
  
    // Update UI for selected option
    setSelectedOption(selectedOptionText);
  
    // Update score and total points if the answer is correct
    if (isCorrect) {
      setUserScore((prevScore) => prevScore + 1);
      const awardedData = calculateAwardedData(currentQuestionId);
      setTotalPoints((prevPoints) => prevPoints + awardedData);
    } else {
      // Show the wrong answer modal
      setShowWrongAnswerModal(true);
    }
  
    // Send API request to store user's answer
    const user_id = localStorage.getItem('msisdn');
    const status = isLastQuestion ? "completed" : "processing";
    const answerType = isCorrect ? "Currect" : "Wrong";
    const apiUrl = `https://globicall.globicallservices.com/QuizIntegration/QuestionList?reportType=InsertingUserDetailsNew&user_id=${user_id}&question_id=${currentQuestionId}&selected_option=${correctAnswer}&total_points=${totalPoints}&answerType=${answerType}&sub_type=Daily&status=${status}`;
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("API response:", data);
    } catch (error) {
      console.error("API error:", error);
    }
  
    // Move to the next question or end the quiz
    if (!isLastQuestion) {
      const currentIndex = questions.findIndex((q) => q.question_id === currentQuestionId);
      if (currentIndex < questions.length - 1) {
        setCurrentQuestionId(questions[currentIndex + 1].question_id);
      } else {
        setIsLastQuestion(true);
        setIsQuizCompleted(true); // Mark quiz as completed
      }
    }
  };

  // Calculate awarded data based on question ID
  const calculateAwardedData = (questionId) => {
    if (questionId < 5) return 20;
    if (questionId < 10) return 80;
    return 100;
  };

  // Handle when time runs out
  const handleTimeUp = () => {
    if (!apiCalledForQuestion && !showTimeUpModal) {
      setShowTimeUpModal(true);
      setIsPaused(true); // Pause the timer
  
      const user_id = localStorage.getItem('msisdn');
      const status = isLastQuestion ? "completed" : "processing";
      const apiUrl = `https://globicall.globicallservices.com/QuizIntegration/QuestionList?reportType=InsertingUserDetailsNew&user_id=${user_id}&question_id=${currentQuestionId}&selected_option=&total_points=0&answerType=Wrong&sub_type=Daily&status=${status}`;
  
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          console.log("API Response:", data);
          setApiCalledForQuestion(true);
        })
        .catch((error) => console.error("API Error:", error));
    }
  };

  const handleQuit = () => {
    // Navigate to the "My Wins" page
    window.location.href = "/myWins"; // Replace with your actual route
  };
  
  const handleRedeem = () => {
    // Navigate to the "Redeem" page
    window.location.href = "/redeem"; // Replace with your actual route
  };
  
  
  

  // Render the current question
  const renderQuestion = () => {
    if (loading) return <div>Loading questions...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (questions.length === 0) return <div>No questions available.</div>;
  
    if (isQuizCompleted) {
      const correctAnswers = userScore;
      const incorrectAnswers = questions.length - userScore;
      return (
        <QuizCompletionMessage
          correctAnswers={correctAnswers}
          incorrectAnswers={incorrectAnswers}
          onQuit={handleQuit}
          onRedeem={handleRedeem}
        />
      );
    }
  
    const currentQuestion = questions.find((q) => q.question_id === currentQuestionId);
    if (!currentQuestion) return <div>Question not found.</div>;
  
    const currentIndex = questions.findIndex((q) => q.question_id === currentQuestionId);
  
    return (
      <div className="gigapromo-quiz-box" id="languageSelect">
        <header className="gigapromo-quiz-header">
          <div className="gigapromo-quiz-title">Giga Promo</div>
          <Timer
            initialTime={30}
            onTimeUp={handleTimeUp}
            currentQuestionId={currentQuestionId}
            isPaused={isPaused}
          />
          <div className="gigapromo-time-line"></div>
        </header>
        <section className="gigapromo-quiz-body">
          <div className="gigapromo-progress-bar">
            <div
              className="gigapromo-progress"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            ></div>
          </div>
          <div className="gigapromo-question-progress">
            <span>
              {currentIndex + 1} of {questions.length} Questions
            </span>
          </div>
          <div className="gigapromo-question-text">
            {currentQuestion.question}
          </div>
          <div className="gigapromo-options">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedOption === option;
              const isCorrect = option === currentQuestion.correctOption;
              const isWrong = isSelected && !isCorrect;
  
              return (
                <div
                  key={index}
                  className={`gigapromo-option ${
                    isSelected
                      ? isCorrect
                        ? "correct"
                        : "incorrect"
                      : ""
                  }`}
                  onClick={() => handleOptionSelect(option)}
                >
                  {option}
                </div>
              );
            })}
          </div>
        </section>
        <footer className="gigapromo-quiz-footer">
          <div className="gigapromo-total-questions">
            <span>
              {currentIndex + 1} of {questions.length} Questions
            </span>
          </div>
          <button
            type="button"
            className="gigapromo-next-btn"
            onClick={() => {
              const nextIndex = currentIndex + 1;
              if (nextIndex < questions.length) {
                setCurrentQuestionId(questions[nextIndex].question_id);
              } else {
                setIsLastQuestion(true);
              }
            }}
            disabled={currentIndex === questions.length - 1}
          >
            Next Que
          </button>
        </footer>
      </div>
    );
  };

  // Wrong Answer Modal
  const WrongAnswerModal = () => {
    return (
      <div className="gigapromo-modal-overlay">
        <div className="gigapromo-modal">
          <h2 className="gigapromo-modal-title">Wrong Answer!</h2>
          <p className="gigapromo-modal-message">
            Oops! That's not the correct answer. Try again!
          </p>
          <button
            className="gigapromo-modal-close-btn"
            onClick={() => setShowWrongAnswerModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  // Time Up Modal 
  
    const handleCloseTimeUpModal = () => {
      setShowTimeUpModal(false);
      setIsPaused(false); // Resume the timer only after user closes modal
      moveToNextQuestion();
    };
    
    const TimeUpModal = () => (
      <div className="gigapromo-modal-overlay">
        <div className="gigapromo-modal">
          <h2 className="gigapromo-modal-title">Time Up!</h2>
          <p className="gigapromo-modal-message">
            Your time is up! The correct answer has been auto-selected.
          </p>
          <button className="gigapromo-modal-close-btn" onClick={handleCloseTimeUpModal}>
            Close
          </button>
        </div>
      </div>
    );
    


  // Move to the next question
  const moveToNextQuestion = () => {
    const currentIndex = questions.findIndex((q) => q.question_id === currentQuestionId);
  
    if (currentIndex < questions.length - 1) {
      const nextQuestionId = questions[currentIndex + 1].question_id;
      setCurrentQuestionId(nextQuestionId);
      setSelectedOption(null);
  
      // Reset API call tracking **after** setting new question
      setTimeout(() => {
        setApiCalledForQuestion(false);
      }, 500);
    } else {
      setIsLastQuestion(true);
    }
  };
  
  

  return (
    <div className="gigapromo-container">
      {/* Use the Sidebar component */}
      <Sidebar />

      <div className="gigapromo-content">
        <div className="gigapromo-layout">
          {/* Start Quiz Button (70% width) or Rules Box */}
          <div className="gigapromo-start" style={{ display: showQuizBox ? 'none' : 'block' }}>
            {!isQuizStarted ? (
              <button onClick={startQuiz}>Start Quiz</button>
            ) : (
              <div className="info_box gigapromo-rules" id="languageSelect">
                <div className="info-title" data-key="SomeRulesofthisQuiz">
                  <span>Some Rules of this Quiz</span>
                </div>
                <div className="info-list">
                  <div className="info mt-3" data-key="Rule1">
                    1. The game consists of 15 questions, with each question increasing in difficulty and prize value.
                  </div>
                  <div className="info mt-3" data-key="Rule2">
                    2. You have <span>30 seconds</span> to answer each question.
                  </div>
                  <div className="info mt-3" data-key="Rule3">
                    3. Selected answers cannot be changed.
                  </div>
                  <div className="info mt-3" data-key="Rule4">
                    4. No points for wrong answers.
                  </div>
                  <div className="info mt-3" data-key="Rule5">
                    5. There are two guaranteed prize levels after <span>5th and 10th</span> questions.
                  </div>
                  <div className="info mt-3" data-key="Rule6">
                    6. When you answer 5 questions correctly, you win a data package.
                  </div>
                </div>
                <div className="buttons" id="languageSelect" style={{position:"none"}}>
                  <button className="quit" data-key="ExitQuiz">
                    Exit Quiz
                  </button>
                  <button id="Continue" className="restart" data-key="Continue" onClick={handleContinue}>
                    Continue
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quiz Box (Replaces gigapromo-start when Continue is clicked) */}
          {showQuizBox && renderQuestion()}

          {/* Wrong Answer Modal */}
          {showWrongAnswerModal && <WrongAnswerModal />}

          {/* Time UP Modal */}
          {showTimeUpModal && <TimeUpModal />}

          {/* Existing Quiz Questions (30% width, always visible) */}
          <div className="gigapromo-active">
            {/* Quiz Questions */}
            <div className="gigapromo-question">
              <div className="gigapromo-question-header">
                <p>Question 15</p>
                <div className="gigapromo-question-points">
                  <label>1GB</label>
                  <input type="radio" name="action" value="red13" />
                </div>
              </div>
              <div className="gigapromo-question-body">
                <img src={require("../assets/podium.gif")} alt="Question" />
                <ul className="gigapromo-question-options">
                  <li>
                    <label>900 MB</label>
                    <input type="radio" name="action" value="red12" />
                  </li>
                  <li>
                    <label>800 MB</label>
                    <input type="radio" name="action" value="red11" />
                  </li>
                  <li>
                    <label>700 MB</label>
                    <input type="radio" name="action" value="red10" />
                  </li>
                  <li>
                    <label>600 MB</label>
                    <input type="radio" name="action" value="red9" />
                  </li>
                </ul>
              </div>
            </div>

            {/* Add the new HTML structure here */}
            <div className="gigapromo-question">
              <div className="gigapromo-question-header">
                <p>Question 10</p>
                <div className="gigapromo-question-points">
                  <label>500 MB</label>
                  <input type="radio" name="action" value="red13" />
                </div>
              </div>
              <div className="gigapromo-question-body">
                <img src={require("../assets/success.gif")} alt="Question" />
                <ul className="gigapromo-question-options">
                  <li>
                    <label>50 MB</label>
                    <input type="radio" name="action" value="red12" />
                  </li>
                  <li>
                    <label>40 MB</label>
                    <input type="radio" name="action" value="red11" />
                  </li>
                  <li>
                    <label>30 MB</label>
                    <input type="radio" name="action" value="red10" />
                  </li>
                  <li>
                    <label>20 MB</label>
                    <input type="radio" name="action" value="red9" />
                  </li>
                </ul>
              </div>
            </div>

            {/* Add the second new HTML structure here */}
            <div className="gigapromo-question">
              <div className="gigapromo-question-header">
                <p>Question 5</p>
                <div className="gigapromo-question-points">
                  <label>10 MB</label>
                  <input type="radio" name="action" value="red13" />
                </div>
              </div>
              <div className="gigapromo-question-body">
                <img src={require("../assets/rocket.gif")} alt="Question" />
                <ul className="gigapromo-question-options">
                  <li>
                    <label>4 MB</label>
                    <input type="radio" name="action" value="red12" />
                  </li>
                  <li>
                    <label>3 MB</label>
                    <input type="radio" name="action" value="red11" />
                  </li>
                  <li>
                    <label>2 MB</label>
                    <input type="radio" name="action" value="red10" />
                  </li>
                  <li>
                    <label>1 MB</label>
                    <input type="radio" name="action" value="red9" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;