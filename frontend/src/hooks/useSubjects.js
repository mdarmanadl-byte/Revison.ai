import { useCallback, useEffect, useState } from "react";
import {
  getSubjects,
  createSubject,
  deleteSubject,
} from "../api/subjects";

export function useSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSubjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getSubjects();

      const result =
        data?.subjects ||
        data?.data ||
        data ||
        [];

      setSubjects(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to load subjects."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const addSubject = async (data) => {
    const result = await createSubject(data);

    await fetchSubjects();

    return result;
  };

  const removeSubject = async (id) => {
    await deleteSubject(id);

    setSubjects((current) =>
      current.filter((subject) => subject.id !== id)
    );
  };

  return {
    subjects,
    loading,
    error,
    refresh: fetchSubjects,
    addSubject,
    removeSubject,
  };
}