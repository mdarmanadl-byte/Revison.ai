import api from "./api";

export async function getSubjects() {
  const response = await api.get("/subjects/");
  return response.data;
}

export async function getSubject(id) {
  const response = await api.get(`/subjects/${id}`);
  return response.data;
}

export async function createSubject(data) {
  const response = await api.post("/subjects/", data);
  return response.data;
}

export async function deleteSubject(id) {
  const response = await api.delete(`/subjects/${id}`);
  return response.data;
}
export async function getStudyMaterial(documentId) {
  const response = await api.post(
    `/study-material/${documentId}`
  );

  return response.data;
}