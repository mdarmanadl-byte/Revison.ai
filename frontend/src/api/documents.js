import api from "./api";

export async function uploadDocument(subjectId, file, topicId = null) {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("subject_id", subjectId);

  if (topicId) {
    formData.append("topic_id", topicId);
  }

  const response = await api.post("/documents/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}