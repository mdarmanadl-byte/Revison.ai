import api from "./api";

export async function getDocumentRevision(documentId) {
  const response = await api.get(`/revision/document/${documentId}`);
  return response.data;
}

export async function getDocumentMcqs(documentId) {
  const response = await api.get(`/revision/mcqs/${documentId}`);
  return response.data;
}

export async function getDocumentSummary(documentId) {
  const response = await api.get(`/revision/summary/${documentId}`);
  return response.data;
}