import { encodeCompoundId } from './crypto'
import { LessonType } from '@/lib/api/services/fetchCourse'

/* ── Course Detail ──────────────────────────────────────────── */

/** /courses/[slug]?mode=preview|detail&id={enc(courseId)} */
export function courseUrl(slug: string, courseId: string, mode?: 'preview' | 'detail') {
  const id = encodeCompoundId(courseId)
  const modeParam = mode ? `mode=${mode}&` : ''
  return `/courses/${slug}?${modeParam}id=${id}`
}

/* ── Checkout ───────────────────────────────────────────────── */

/** /courses/[slug]/checkout?id={enc(courseId)} */
export function checkoutUrl(slug: string, courseId: string) {
  return `/courses/${slug}/checkout?id=${encodeCompoundId(courseId)}`
}

/* ── Instructor ─────────────────────────────────────────────── */

/** /courses/[slug]/instructor?id={enc(courseId|instructorId)} */
export function instructorUrl(slug: string, courseId: string, instructorId: string) {
  return `/courses/${slug}/instructor?id=${encodeCompoundId(courseId, instructorId)}`
}

/* ── Lesson (auto-detect type) ──────────────────────────────── */

/**
 * Trả về URL cho lesson dựa theo type.
 * - Video → /courses/[slug]/watch?id=...
 * - Text  → /courses/[slug]/text?id=...
 * - Quiz  → /courses/[slug]/quiz-attempt?id=...
 */
export function lessonUrl(
  slug: string,
  courseId: string,
  sectionId: string,
  lesson: { id: string; type: string; quizId?: string | null },
  mode?: 'preview' | 'detail',
) {
  if (lesson.type === LessonType.Quiz && lesson.quizId) {
    return quizOverviewUrl(slug, courseId, sectionId, lesson.id, lesson.quizId)
  }
  const route = lesson.type === LessonType.Video ? 'watch' : 'text'
  const id = encodeCompoundId(courseId, sectionId, lesson.id)
  return `/courses/${slug}/${route}?id=${id}${mode ? `&mode=${mode}` : ''}`
}

/* ── Watch (Video) ──────────────────────────────────────────── */

/** /courses/[slug]/watch?id={enc(courseId|sectionId|lessonId)}&mode=... */
export function watchUrl(slug: string, courseId: string, sectionId: string, lessonId: string, mode?: string) {
  const id = encodeCompoundId(courseId, sectionId, lessonId)
  return `/courses/${slug}/watch?id=${id}${mode ? `&mode=${mode}` : ''}`
}

/* ── Text ────────────────────────────────────────────────────── */

/** /courses/[slug]/text?id={enc(courseId|sectionId|lessonId)}&mode=... */
export function textUrl(slug: string, courseId: string, sectionId: string, lessonId: string, mode?: string) {
  const id = encodeCompoundId(courseId, sectionId, lessonId)
  return `/courses/${slug}/text?id=${id}${mode ? `&mode=${mode}` : ''}`
}

/* ── Quiz ────────────────────────────────────────────────────── */

/** /courses/[slug]/quiz-attempt?id={enc(courseId|sectionId|lessonId|quizId)} */
export function quizOverviewUrl(slug: string, courseId: string, sectionId: string, lessonId: string, quizId: string) {
  return `/courses/${slug}/quiz-attempt?id=${encodeCompoundId(courseId, sectionId, lessonId, quizId)}`
}

/** /courses/[slug]/quiz-attempt/take?id={enc(courseId|sectionId|lessonId|quizId)} */
export function quizTakeUrl(slug: string, courseId: string, sectionId: string, lessonId: string, quizId: string) {
  return `/courses/${slug}/quiz-attempt/take?id=${encodeCompoundId(courseId, sectionId, lessonId, quizId)}`
}

/** /courses/[slug]/quiz-attempt/result?id={enc(courseId|sectionId|lessonId|quizId|attemptId)} */
export function quizResultUrl(slug: string, courseId: string, sectionId: string, lessonId: string, quizId: string, attemptId: string) {
  return `/courses/${slug}/quiz-attempt/result?id=${encodeCompoundId(courseId, sectionId, lessonId, quizId, attemptId)}`
}

/* ── Assignment ──────────────────────────────────────────────── */

/** /courses/[slug]/asm-attempt?id={enc(courseId|sectionId|assignmentId)} */
export function asmAttemptUrl(slug: string, courseId: string, sectionId: string, assignmentId: string) {
  return `/courses/${slug}/asm-attempt?id=${encodeCompoundId(courseId, sectionId, assignmentId)}`
}

/* ── Navigation helper ───────────────────────────────────────── */

/**
 * Tạo URL cho lesson tiếp theo (dùng trong navigation).
 * Tự xác định route dựa theo lesson.type.
 */
export function nextLessonUrl(
  slug: string,
  courseId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nextLesson: { id: string; type: string; sectionId: string; quizId?: any },
) {
  if (nextLesson.type === LessonType.Quiz && nextLesson.quizId) {
    return quizOverviewUrl(slug, courseId, nextLesson.sectionId, nextLesson.id, nextLesson.quizId)
  }
  if (nextLesson.type === LessonType.Video) {
    return watchUrl(slug, courseId, nextLesson.sectionId, nextLesson.id)
  }
  return textUrl(slug, courseId, nextLesson.sectionId, nextLesson.id)
}
