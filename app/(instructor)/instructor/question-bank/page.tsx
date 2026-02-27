"use client"

import { QuestionBankExplorer } from "./components/QuestionBankExplorer"

export default function QuestionBankPage() {
  return (
    <div className="flex flex-col px-8 scrollbar-stable" style={{ height: 'calc(100vh - 200px)', minHeight: 0 }}>
      <QuestionBankExplorer />
    </div>
  )
}