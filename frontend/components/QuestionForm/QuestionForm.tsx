"use client";

import { Question } from "../../services/api";

import styles from "./QuestionForm.module.css";

interface QuestionFormProps {
  question: Question;
  index: number;
  onChange: (index: number, question: Question) => void;
  onRemove: () => void;
}

export default function QuestionForm({
  question,
  index,
  onChange,
  onRemove,
}: QuestionFormProps) {
  const handleTypeChange = (newType: Question["type"]) => {
    const updatedQuestion: Question = {
      ...question,
      type: newType,
      options: newType === "checkbox" ? [""] : undefined,
    };
    onChange(index, updatedQuestion);
  };

  const handleTextChange = (text: string) => {
    onChange(index, { ...question, text });
  };

  const handleOptionChange = (optionIndex: number, value: string) => {
    if (!question.options) return;

    const newOptions = [...question.options];
    newOptions[optionIndex] = value;
    onChange(index, { ...question, options: newOptions });
  };

  const addOption = () => {
    const currentOptions = question.options || [""];
    onChange(index, { ...question, options: [...currentOptions, ""] });
  };

  const removeOption = (optionIndex: number) => {
    if (!question.options) return;

    const newOptions = question.options.filter((_, idx) => idx !== optionIndex);
    onChange(index, { ...question, options: newOptions });
  };
  return (
    <div className={styles.questionCard}>
      <div className={styles.questionHeader}>
        <h3>Question {index + 1}</h3>
        <button type="button" onClick={onRemove} className={styles.removeBtn}>
          Remove
        </button>
      </div>

      {/* Question Type */}
      <div className={styles.field}>
        <label>Question Type:</label>
        <select
          value={question.type}
          onChange={(e) => handleTypeChange(e.target.value as Question["type"])}
          className={styles.select}
        >
          <option value="boolean">True/False</option>
          <option value="input">Text Input</option>
          <option value="checkbox">Multiple Choice</option>
        </select>
      </div>

      {/* Question Text */}
      <div className={styles.field}>
        <label>Question Text:</label>
        <input
          type="text"
          value={question.text}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Enter your question"
          className={styles.input}
        />
      </div>

      {/* Options for Checkbox type */}
      {question.type === "checkbox" && (
        <div className={styles.optionsSection}>
          <label>Options:</label>
          {question.options?.map((option, optionIndex) => (
            <div key={optionIndex} className={styles.optionRow}>
              <input
                type="text"
                value={option}
                onChange={(e) =>
                  handleOptionChange(optionIndex, e.target.value)
                }
                placeholder={`Option ${optionIndex + 1}`}
                className={styles.optionInput}
              />
              {question.options && question.options.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeOption(optionIndex)}
                  className={styles.removeOptionBtn}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            className={styles.addOptionBtn}
          >
            + Add Option
          </button>
        </div>
      )}

      {/* Preview based on type */}
      <div className={styles.preview}>
        <strong>Preview:</strong>
        <div className={styles.previewContent}>
          {question.type === "boolean" && (
            <div>
              <label>
                <input type="radio" name={`preview-${index}`} /> True
              </label>
              <label>
                <input type="radio" name={`preview-${index}`} /> False
              </label>
            </div>
          )}

          {question.type === "input" && (
            <input
              type="text"
              placeholder="User will type answer here..."
              disabled
            />
          )}

          {question.type === "checkbox" && (
            <div>
              {question.options?.map((option, idx) => (
                <label key={idx}>
                  <input type="checkbox" /> {option || `Option ${idx + 1}`}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
