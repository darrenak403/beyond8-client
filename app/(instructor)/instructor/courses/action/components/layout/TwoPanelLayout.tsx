"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Eye, Settings, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useIsMobile } from "@/hooks/useMobile";
import CompactSectionList from "../content/CompactSectionList";
import { useGetSectionsByCourseId } from "@/hooks/useSection";
import ContentEditor, { ContentEditorRef } from "../content/ContentEditor";

interface TwoPanelLayoutProps {
  courseId: string;
  onBackToInfo?: () => void;
}

export default function TwoPanelLayout({ courseId, onBackToInfo }: TwoPanelLayoutProps) {
  const isMobile = useIsMobile();
  const editorRef = useRef<ContentEditorRef>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [pendingNavigation, setPendingNavigation] = useState<{
    sectionId: string;
    lessonId: string | null;
  } | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const { sections } = useGetSectionsByCourseId(courseId);

  // Auto-select first section on mount
  React.useEffect(() => {
    if (sections && sections.length > 0 && !selectedSectionId) {
      setSelectedSectionId(sections[0].id);
    }
  }, [sections, selectedSectionId]);

  const handleSelectSection = (sectionId: string) => {
    const hasChanges = editorRef.current?.hasUnsavedChanges();
    if (hasChanges) {
      setPendingNavigation({ sectionId, lessonId: null });
      setShowSaveDialog(true);
    } else {
      setSelectedSectionId(sectionId);
      setSelectedLessonId(null);
      if (isMobile) {
        setShowMobileSidebar(false);
      }
    }
  };

  const handleSelectLesson = (sectionId: string, lessonId: string) => {
    const hasChanges = editorRef.current?.hasUnsavedChanges();
    if (hasChanges) {
      setPendingNavigation({ sectionId, lessonId });
      setShowSaveDialog(true);
    } else {
      setSelectedSectionId(sectionId);
      setSelectedLessonId(lessonId);
      if (isMobile) {
        setShowMobileSidebar(false);
      }
    }
  };

  // Handle lesson selection from ContentEditor (stays in same section)
  const handleLessonSelect = (lessonId: string) => {
    if (selectedSectionId) {
      if (lessonId) {
        setSelectedLessonId(lessonId);
      } else {
        // Empty string means go back to section view
        setSelectedLessonId(null);
      }
    }
  };

  const handleSaveAndNavigate = async () => {
    await editorRef.current?.save();
    if (pendingNavigation) {
      setSelectedSectionId(pendingNavigation.sectionId);
      setSelectedLessonId(pendingNavigation.lessonId);
    }
    setShowSaveDialog(false);
    setPendingNavigation(null);
    if (isMobile) {
      setShowMobileSidebar(false);
    }
  };

  const handleDiscardAndNavigate = () => {
    if (pendingNavigation) {
      setSelectedSectionId(pendingNavigation.sectionId);
      setSelectedLessonId(pendingNavigation.lessonId);
    }
    setShowSaveDialog(false);
    setPendingNavigation(null);
    if (isMobile) {
      setShowMobileSidebar(false);
    }
  };

  const handleCancelNavigation = () => {
    setShowSaveDialog(false);
    setPendingNavigation(null);
  };

  const handleCreateSection = () => {
    // The create section form will be handled in the CompactSectionList or ContentEditor
    // For now, we don't need to do anything here
  };

  const handleSectionDeleted = () => {
    // When a section is deleted, select the first available section
    if (sections && sections.length > 0) {
      const remainingSections = sections.filter((s) => s.id !== selectedSectionId);
      if (remainingSections.length > 0) {
        setSelectedSectionId(remainingSections[0].id);
        setSelectedLessonId(null);
      } else {
        setSelectedSectionId(null);
        setSelectedLessonId(null);
      }
    }
  };

  const selectedSection = sections?.find((s) => s.id === selectedSectionId);

  return (
    <>
      <div className="flex flex-col h-screen w-full bg-purple-100 p-4 overflow-hidden">

        {/* Main Card Container */}
        <div className="flex flex-col flex-1 bg-white rounded-[30px] shadow-sm border border-purple-100 overflow-hidden">
          {/* Header Portal Target */}
          <div id="course-editor-header-root" className="shrink-0 w-full bg-white border-b z-20" />

          <div className="flex-1 flex overflow-hidden">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className={`flex flex-1 gap-3 overflow-hidden ${!isMobile ? "h-[calc(100vh-24px)] mx-3 mb-3" : "h-full"}`}
            >
              {/* Left Panel - Desktop */}
              {!isMobile && (
                <CompactSectionList
                  courseId={courseId}
                  selectedSectionId={selectedSectionId}
                  selectedLessonId={selectedLessonId}
                  onSelectSection={handleSelectSection}
                  onSelectLesson={handleSelectLesson}
                  onCreateSection={handleCreateSection}
                />
              )}

              {/* Right Panel Wrapper with Toolbar */}
              <div className="flex flex-1 overflow-hidden">
                <ContentEditor
                  ref={editorRef}
                  courseId={courseId}
                  selectedSectionId={selectedSectionId}
                  selectedLessonId={selectedLessonId}
                  section={selectedSection}
                  onDeleted={handleSectionDeleted}
                  onLessonSelect={handleLessonSelect}
                  onBackToInfo={onBackToInfo}
                />

                {/* Right Toolbar */}
                <div className="w-14 border-l bg-gray-50 flex flex-col items-center py-4 gap-4 shrink-0 z-10">
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-gray-500 hover:text-purple-600 hover:bg-purple-50" title="Xem trước">
                    <Eye className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-gray-500 hover:text-purple-600 hover:bg-purple-50" title="Cài đặt">
                    <Settings className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-gray-500 hover:text-purple-600 hover:bg-purple-50" title="Trợ giúp">
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mobile FAB Button */}
        {isMobile && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <Button
              size="lg"
              onClick={() => setShowMobileSidebar(true)}
              className="h-14 w-14 rounded-full shadow-lg"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobile && showMobileSidebar && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowMobileSidebar(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold text-gray-900">Nội dung khóa học</h3>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowMobileSidebar(false)}
                  className="h-8 w-8"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="h-[calc(100vh-64px)]">
                <CompactSectionList
                  courseId={courseId}
                  selectedSectionId={selectedSectionId}
                  selectedLessonId={selectedLessonId}
                  onSelectSection={handleSelectSection}
                  onSelectLesson={handleSelectLesson}
                  onCreateSection={handleCreateSection}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Save Confirmation Dialog */}
      <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <AlertDialogContent className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[2%] data-[state=open]:slide-in-from-top-[2%]">
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có muốn lưu thay đổi?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có những thay đổi chưa được lưu. Bạn muốn lưu trước khi chuyển sang mục khác không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelNavigation} className="rounded-full">Hủy</AlertDialogCancel>
            <Button variant="outline" onClick={handleDiscardAndNavigate} className="rounded-full">
              Không lưu
            </Button>
            <AlertDialogAction onClick={handleSaveAndNavigate} className="rounded-full">Lưu</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
