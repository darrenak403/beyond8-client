"use client"

import { GradingExplorer } from "./components/GradingExplorer"

export default function GradingPage() {
    return (
        <div className="flex flex-col h-full scrollbar-stable" style={{ minHeight: 'calc(100vh - 100px)' }}>
            <GradingExplorer />
        </div>
    )
}
