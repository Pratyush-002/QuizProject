import '../styles/QuizComplete.css'

const QuizCompletionMessage = ({ correctAnswers, incorrectAnswers, onQuit, onRedeem }) => {
    return (
      <div className="gigapromo-quiz-completion">
        <h2>Congratulations!</h2>
        <p>You have completed the quiz.</p>
        <p>Correct Answers: {correctAnswers}</p>
        <p>Incorrect Answers: {incorrectAnswers}</p>
        <div className="gigapromo-quiz-completion-buttons">
          <button className="gigapromo-quiz-quit-btn" onClick={onQuit}>
            Quit
          </button>
          <button className="gigapromo-quiz-redeem-btn" onClick={onRedeem}>
            Redeem
          </button>
        </div>
      </div>
    );
  };

  export default QuizCompletionMessage