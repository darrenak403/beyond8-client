"use client";

import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { useGetLessonBySectionId } from "@/hooks/useLesson";

import { NoSelection } from "./editors/NoSelection";
import { SectionEditor, SectionEditorRef } from "./editors/SectionEditor";
import { LessonEditor, LessonEditorRef } from "./editors/LessonEditor";

interface ContentEditorProps {
  courseId: string;
  selectedSectionId: string | null;
  selectedLessonId: string | null;
  section: { id: string; orderIndex: number; title: string; description?: string } | undefined;
  onDeleted?: () => void;
  onLessonSelect?: (lessonId: string) => void;
  onBackToInfo?: () => void;
}

export interface ContentEditorRef {
  hasUnsavedChanges: () => boolean;
  save: () => Promise<void>;
}

const ContentEditor = forwardRef<ContentEditorRef, ContentEditorProps>(
  ({ courseId, selectedSectionId, selectedLessonId, section, onDeleted, onLessonSelect, onBackToInfo }, ref) => {

    // We fetch lessons here to pass to LessonEditor so it knows which lesson is selected from the list
    // (LessonEditor takes `lessons` and finds current one by ID)
    const { lessons } = useGetLessonBySectionId(selectedSectionId || "");

    const sectionEditorRef = useRef<SectionEditorRef>(null);
    const lessonEditorRef = useRef<LessonEditorRef>(null);

    useImperativeHandle(ref, () => ({
      hasUnsavedChanges: () => {
        if (selectedLessonId) {
          return lessonEditorRef.current?.hasUnsavedChanges() ?? false;
        }
        if (selectedSectionId && section) {
          return sectionEditorRef.current?.hasUnsavedChanges() ?? false;
        }
        return false;
      },
      save: async () => {
        if (selectedLessonId) {
          await lessonEditorRef.current?.save();
        } else if (selectedSectionId && section) {
          await sectionEditorRef.current?.save();
        }
      },
    }));

    if (!section || !selectedSectionId) {
      return <NoSelection onBackToInfo={onBackToInfo} />;
    }

    if (selectedLessonId) {
      return (
        <LessonEditor
          ref={lessonEditorRef}
          lessonId={selectedLessonId}
          selectedSectionId={selectedSectionId}
          sectionTitle={section?.title || ""}
          sectionOrder={section?.orderIndex || 0}
          lessons={lessons || []}
          onBack={() => onLessonSelect?.("")}
          onBackToInfo={onBackToInfo}
        />
      );
    }

    return (
      <SectionEditor
        ref={sectionEditorRef}
        courseId={courseId}
        section={section}
        onBackToInfo={onBackToInfo}
        onLessonSelect={onLessonSelect}
        onDeleted={onDeleted}
      />
    );
  }
);

ContentEditor.displayName = "ContentEditor";

export default ContentEditor;
