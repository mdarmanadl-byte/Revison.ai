import api from "./api";

export async function createPersonalizedQuiz(data = {}) {
  const response = await api.post("/personalized-quiz", data);
  return response.data;
}

export async function submitPersonalizedQuiz(quizId, answers) {
  const response = await api.post(
    `/personalized-quiz/${quizId}/submit`,
    { answers }
  );

  return response.data;
}

export async function getPersonalizedQuizHistory() {
  const response = await api.get("/personalized-quiz/history");
  return response.data;
}