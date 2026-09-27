import api from "./api";

export async function submitQuiz(documentId, answers) {
  const response = await api.post(
    `/quiz/submit/${documentId}`,
    { answers }
  );

  return response.data;
}

export async function getQuizHistory(documentId) {
  const response = await api.get(`/quiz/history/${documentId}`);
  return response.data;
}

export async function getQuizProgress() {
  const response = await api.get("/quiz/progress");
  return response.data;
}