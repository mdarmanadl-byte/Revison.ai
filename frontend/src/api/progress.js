import api from "./api";

export async function getSubjectProgress(subjectId) {
  const response = await api.get(`/progress/subject/${subjectId}`);
  return response.data;
}

export async function getSubjectsProgress() {
  const response = await api.get("/progress/subjects");
  return response.data;
}