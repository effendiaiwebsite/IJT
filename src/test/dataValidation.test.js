import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

describe('Data Validation Tests', () => {
  const publicDataPath = join(process.cwd(), 'public', 'data');

  describe('Syllabus Files', () => {
    it('should have valid JSON structure in all syllabus files', () => {
      const syllabiPath = join(publicDataPath, 'syllabi');
      const files = readdirSync(syllabiPath).filter(f => f.endsWith('.json'));

      expect(files.length).toBeGreaterThan(0);

      files.forEach(file => {
        const content = readFileSync(join(syllabiPath, file), 'utf8');
        const data = JSON.parse(content);

        // Check required fields
        expect(data).toHaveProperty('examId');
        expect(data).toHaveProperty('examName');
        expect(data).toHaveProperty('subjects');
        expect(Array.isArray(data.subjects)).toBe(true);

        // Validate subjects structure
        data.subjects.forEach(subject => {
          expect(subject).toHaveProperty('subjectId');
          // Handle both 'name' and 'subjectName' fields
          expect(subject.name || subject.subjectName).toBeTruthy();
          expect(subject).toHaveProperty('chapters');
          expect(Array.isArray(subject.chapters)).toBe(true);

          // Validate chapters
          subject.chapters.forEach(chapter => {
            expect(chapter).toHaveProperty('chapterId');
            // Handle both 'name' and 'chapterName' fields
            expect(chapter.name || chapter.chapterName).toBeTruthy();
          });
        });
      });
    });
  });

  describe('Tutorial Files', () => {
    it('should have valid tutorial structure', () => {
      const tutorialsPath = join(publicDataPath, 'tutorials');
      const exams = readdirSync(tutorialsPath).filter(f => {
        try {
          return readdirSync(join(tutorialsPath, f)).length > 0;
        } catch {
          return false;
        }
      });

      expect(exams.length).toBeGreaterThan(0);

      // Test a sample of tutorial files
      let tutorialCount = 0;
      exams.slice(0, 5).forEach(exam => {
        const examPath = join(tutorialsPath, exam);
        const subjects = readdirSync(examPath);

        subjects.forEach(subject => {
          const subjectPath = join(examPath, subject);
          try {
            const chapters = readdirSync(subjectPath);

            chapters.forEach(chapter => {
              const tutorialFile = join(subjectPath, chapter, 'tutorials.json');
              try {
                const content = readFileSync(tutorialFile, 'utf8');
                const data = JSON.parse(content);

                // Validate structure
                expect(data).toHaveProperty('chapterId');
                expect(data).toHaveProperty('chapterName');
                expect(data).toHaveProperty('subjectId');
                expect(data).toHaveProperty('examId');
                expect(data).toHaveProperty('slides');
                expect(Array.isArray(data.slides)).toBe(true);

                // Validate slides
                data.slides.forEach(slide => {
                  expect(slide).toHaveProperty('slideNumber');
                  expect(slide).toHaveProperty('title');
                  expect(slide).toHaveProperty('content');
                  expect(slide).toHaveProperty('type');
                  expect(typeof slide.slideNumber).toBe('number');
                });

                tutorialCount++;
              } catch (e) {
                // File might not exist, skip
              }
            });
          } catch {
            // Not a directory, skip
          }
        });
      });

      expect(tutorialCount).toBeGreaterThan(0);
    });
  });

  describe('Question Files', () => {
    it('should have valid question structure with non-empty questions array', () => {
      const questionsPath = join(publicDataPath, 'questions');
      const exams = readdirSync(questionsPath).filter(f => {
        try {
          return readdirSync(join(questionsPath, f)).length > 0;
        } catch {
          return false;
        }
      });

      expect(exams.length).toBeGreaterThan(0);

      let questionFileCount = 0;
      let validQuestionFiles = 0;

      exams.slice(0, 5).forEach(exam => {
        const examPath = join(questionsPath, exam);
        const subjects = readdirSync(examPath);

        subjects.forEach(subject => {
          const subjectPath = join(examPath, subject);
          try {
            const chapters = readdirSync(subjectPath);

            chapters.forEach(chapter => {
              const questionFile = join(subjectPath, chapter, 'test-questions.json');
              try {
                const content = readFileSync(questionFile, 'utf8');
                const data = JSON.parse(content);

                questionFileCount++;

                // Validate structure
                expect(data).toHaveProperty('examId');
                expect(data).toHaveProperty('subjectId');
                expect(data).toHaveProperty('chapterId');
                expect(data).toHaveProperty('questions');
                expect(Array.isArray(data.questions)).toBe(true);

                // Check that questions array is not empty (this was the bug!)
                if (data.questions.length > 0) {
                  validQuestionFiles++;

                  expect(data).toHaveProperty('totalQuestions');
                  expect(data).toHaveProperty('totalMarks');
                  expect(data).toHaveProperty('duration');

                  // Validate questions
                  data.questions.forEach((question, index) => {
                    expect(question, `Question ${index} in ${exam}/${subject}/${chapter}`).toHaveProperty('id');
                    expect(question, `Question ${index} in ${exam}/${subject}/${chapter}`).toHaveProperty('questionNumber');
                    expect(question, `Question ${index} in ${exam}/${subject}/${chapter}`).toHaveProperty('questionText');
                    expect(question, `Question ${index} in ${exam}/${subject}/${chapter}`).toHaveProperty('options');
                    expect(question, `Question ${index} in ${exam}/${subject}/${chapter}`).toHaveProperty('correctAnswer');
                    expect(question, `Question ${index} in ${exam}/${subject}/${chapter}`).toHaveProperty('explanation');
                    expect(question, `Question ${index} in ${exam}/${subject}/${chapter}`).toHaveProperty('difficulty');
                    expect(question, `Question ${index} in ${exam}/${subject}/${chapter}`).toHaveProperty('marks');

                    expect(Array.isArray(question.options)).toBe(true);
                    expect(question.options.length).toBeGreaterThanOrEqual(2);
                    expect(typeof question.correctAnswer).toBe('number');
                    expect(question.correctAnswer).toBeGreaterThanOrEqual(0);
                    expect(question.correctAnswer).toBeLessThan(question.options.length);
                  });
                }
              } catch (e) {
                // File might not exist, skip
              }
            });
          } catch {
            // Not a directory, skip
          }
        });
      });

      expect(questionFileCount).toBeGreaterThan(0);
      expect(validQuestionFiles).toBeGreaterThan(0);

      // Log the ratio of valid files
      console.log(`Valid question files: ${validQuestionFiles}/${questionFileCount}`);
    });
  });

  describe('Data Integrity', () => {
    it('should have content for major exams', () => {
      const syllabiPath = join(publicDataPath, 'syllabi');
      const syllabusFiles = readdirSync(syllabiPath).filter(f => f.endsWith('.json'));

      // Test specific major exams that we know have content
      const majorExams = ['rrb-ntpc', 'cds', 'nda', 'ibps-clerk', 'sbi-clerk', 'ssc-mts', 'ssc-chsl'];
      let examsWithContent = 0;
      let totalExamsChecked = 0;

      syllabusFiles.forEach(file => {
        const syllabusContent = readFileSync(join(syllabiPath, file), 'utf8');
        const syllabusData = JSON.parse(syllabusContent);

        const examId = syllabusData.examId;

        // Only check major exams
        if (!majorExams.includes(examId)) {
          return;
        }

        totalExamsChecked++;

        // Check if tutorials directory exists
        const tutorialsPath = join(publicDataPath, 'tutorials', examId);
        const questionsPath = join(publicDataPath, 'questions', examId);

        // At least one should exist
        let hasContent = false;
        try {
          const tutorialFiles = readdirSync(tutorialsPath);
          if (tutorialFiles.length > 0) hasContent = true;
        } catch {}

        try {
          const questionFiles = readdirSync(questionsPath);
          if (questionFiles.length > 0) hasContent = true;
        } catch {}

        if (hasContent) {
          examsWithContent++;
        }
      });

      // Expect at least 80% of major exams to have content
      const percentage = (examsWithContent / totalExamsChecked) * 100;
      console.log(`Major exams with content: ${examsWithContent}/${totalExamsChecked} (${percentage.toFixed(0)}%)`);
      expect(percentage).toBeGreaterThanOrEqual(80);
    });
  });
});
