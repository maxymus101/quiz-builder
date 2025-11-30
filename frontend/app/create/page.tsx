"use client";

import QuestionForm from "@/components/QuestionForm/QuestionForm";
import { api, Question } from "@/services/api";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import styles from "./page.module.css";
import toast from "react-hot-toast";

const QuizSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .required("Title is required"),
  questions: Yup.array()
    .of(
      Yup.object().shape({
        type: Yup.string().required(),
        text: Yup.string().required("Question text is required"),
        options: Yup.array().when("type", {
          is: "checkbox",
          then: (schema) => schema.min(1, "At least one option required"),
          otherwise: (schema) => schema.notRequired(),
        }),
      })
    )
    .min(1, "At least one question is required"),
});

export default function CreateQuizPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    title: "",
    questions: [
      {
        type: "boolean" as Question["type"],
        text: "",
        options: undefined,
      },
    ],
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      setIsSubmitting(true);
      await api.createQuiz(values);
      toast.success("Quiz created successfully! 🎉");
      router.push("/quizzes");
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast.error("Failed to create quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Create New Quiz</h1>

        <Formik
          initialValues={initialValues}
          validationSchema={QuizSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form className={styles.form}>
              {/* Quiz Title */}
              <div className={styles.field}>
                <label htmlFor="title">Quiz Title:</label>
                <Field
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Enter quiz title"
                  className={styles.input}
                />
                {errors.title && touched.title && (
                  <div className={styles.error}>{errors.title}</div>
                )}
              </div>

              {/* Questions */}
              <FieldArray name="questions">
                {({ push, remove }) => (
                  <div>
                    <div className={styles.questionsHeader}>
                      <h2>Questions</h2>
                      <button
                        type="button"
                        onClick={() =>
                          push({
                            type: "boolean",
                            text: "",
                            options: undefined,
                          })
                        }
                        className={styles.addQuestionBtn}
                      >
                        + Add Question
                      </button>
                    </div>

                    {values.questions.map((question, index) => (
                      <QuestionForm
                        key={index}
                        question={question}
                        index={index}
                        onChange={(idx, updatedQuestion) => {
                          setFieldValue(`questions.${idx}`, updatedQuestion);
                        }}
                        onRemove={() => {
                          if (values.questions.length > 1) {
                            remove(index);
                          } else {
                            toast.error(
                              "Quiz must have at least one question!"
                            ); // ← змінили
                          }
                        }}
                      />
                    ))}

                    {errors.questions &&
                      typeof errors.questions === "string" && (
                        <div className={styles.error}>{errors.questions}</div>
                      )}
                  </div>
                )}
              </FieldArray>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitBtn}
              >
                {isSubmitting ? "Creating..." : "Create Quiz"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
