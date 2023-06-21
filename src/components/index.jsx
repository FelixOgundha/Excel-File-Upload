
import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Index() {
  const [surveyResult, setSurveyResult] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getSurvey();
  }, []);

  const calculateStatistics = (results, questions) => {
    const statistics = {};

    // Iterate over survey questions
    questions.forEach(question => {
      // Initialize statistics variables for each question
      let totalCount = 0;
      let validCount = 0;
      let uniqueValues = new Set();
      let choiceFrequency = {}; // Frequency of each choice selected
      let answerValues = {}; // Values and unique counts for each answer

      // Iterate over survey results
      results.forEach(result => {
        if (result.content) {
          const response = JSON.parse(result.content)[question.name];

          // Update statistics based on question type and desired calculations
          switch (question.type) {
            case "text":
              totalCount++;
              if (response) {
                validCount++;
                uniqueValues.add(response);
                if (answerValues[response]) {
                  answerValues[response]++;
                } else {
                  answerValues[response] = 1;
                }
              }
              break;
            case "multiple-choice":
              totalCount++;
              if (response) {
                validCount++;
                response.forEach(option => {
                  uniqueValues.add(option);
                  if (choiceFrequency[option]) {
                    choiceFrequency[option]++;
                  } else {
                    choiceFrequency[option] = 1;
                  }
                });
              }
              break;
            case "boolean":
              totalCount++;
              if (typeof response === "boolean") {
                validCount++;
                const answer = response.toString();
                uniqueValues.add(answer);
                if (answerValues[answer]) {
                  answerValues[answer]++;
                } else {
                  answerValues[answer] = 1;
                }
              }
              break;
            // Add more cases for other question types as needed
          }
        }
      });

      // Calculate additional statistics based on your requirements
      const percentage = (validCount / totalCount) * 100;
      const uniqueCount = uniqueValues.size;

      // Find the most selected choice and its frequency
      let mostSelectedChoice = "";
      let mostSelectedFrequency = 0;
      if (question.type === "multiple-choice") {
        Object.entries(choiceFrequency).forEach(([choice, frequency]) => {
          if (frequency > mostSelectedFrequency) {
            mostSelectedChoice = choice;
            mostSelectedFrequency = frequency;
          }
        });
      }

      // Store the calculated statistics for the question
      statistics[question.name] = {
        totalCount,
        validCount,
        percentage,
        uniqueCount,
        choiceFrequency,
        mostSelectedChoice,
        mostSelectedFrequency,
        answerValues,
      };
    });

    // Return the statistics for all questions
    return statistics;
  };

  const getSurvey = () => {
    const uploadUrl = 'https://localhost:5001/api/Survey/GetSurvey?surveyId=43';
    setIsLoading(true);

    axios
      .get(uploadUrl)
      .then(response => {
        setSurveyResult(response.data.surveyResults.$values);
        setQuestions(JSON.parse(response.data.jsonData).elements);
      })
      .catch(error => {
        console.error('Survey retrieval error:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  // Call the calculateStatistics function with the survey results and questions
  const statistics = calculateStatistics(surveyResult, questions);
  return (
    <div>
      <h1>Survey Statistics</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {questions.map(question => {
            const questionStatistics = statistics[question.name];
            const { title, type } = question; return (
              <div key={question.name}>
                <h3>{title}</h3>
                <p>Total count: {questionStatistics.totalCount}</p>
                <p>Valid count: {questionStatistics.validCount}</p>
                <p>Percentage: {questionStatistics.percentage.toFixed(2)}%</p>
                <p>Unique count: {questionStatistics.uniqueCount}</p>
                {type === "multiple-choice" && (
                  <div>
                    <p>Choice Frequency:</p>
                    <ul>
                      {Object.entries(questionStatistics.choiceFrequency).map(
                        ([choice, frequency]) => (
                          <li key={choice}>
                            {choice}: {frequency}
                          </li>
                        )
                      )}
                    </ul>
                    <p>
                      Most Selected Choice: {questionStatistics.mostSelectedChoice} (
                      {questionStatistics.mostSelectedFrequency} times)
                    </p>
                  </div>
                )}
                <p>Answers:</p>
                <ul>
                  {Object.entries(questionStatistics.answerValues).map(
                    ([answer, count]) => (
                      <li key={answer}>
                        {answer}: {count} times
                      </li>
                    )
                  )}
                </ul>
                <hr />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default Index;