import lonelyData from "./questions/why-feel-lonely.json";
import allahTestData from "./questions/why-does-allah-test-me.json";
import findPeaceData from "./questions/how-do-i-find-peace.json";
import distantData from "./questions/why-do-i-feel-distant-from-allah.json";
import purposeData from "./questions/what-is-my-purpose.json";
import questionsIndexData from "./questions-index.json";

export type QuestionEvidence = {
  verse_ref: string;
  arabic: string;
  translation_en: string;
  why_cited: string;
};

export type QuestionSubSection = {
  heading: string;
  body: string;
  evidence: QuestionEvidence[];
};

export type QuestionSection = {
  heading: string;
  body: string;
  evidence: QuestionEvidence[];
  sub_sections?: QuestionSubSection[];
};

export type Question = {
  question_id: string;
  question: string;
  short_answer: string;
  topic_tags: string[];
  sections: QuestionSection[];
  related_questions: string[];
  related_verses: string[];
};

export type QuestionIndexItem = {
  slug: string;
  question: string;
  short_answer: string;
  topic_tags: string[];
};

export const questions: Record<string, Question> = {
  "why-feel-lonely": lonelyData as Question,
  "why-does-allah-test-me": allahTestData as Question,
  "how-do-i-find-peace": findPeaceData as Question,
  "why-do-i-feel-distant-from-allah": distantData as Question,
  "what-is-my-purpose": purposeData as Question,
};

export const questionsIndex: QuestionIndexItem[] = questionsIndexData.questions;

export function getQuestion(slug: string): Question | undefined {
  return questions[slug];
}

export function getAllQuestions(): QuestionIndexItem[] {
  return questionsIndex;
}

export function getQuestionsByTopic(topicSlug: string): QuestionIndexItem[] {
  return questionsIndex.filter((q) => q.topic_tags.includes(topicSlug));
}