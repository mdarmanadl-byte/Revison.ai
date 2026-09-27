import api from "./api";

export async function getWeakTopics() {
  const response = await api.get("/weak-topics");
  return response.data;
}