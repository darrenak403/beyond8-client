"use client"

import { CouponExplorer } from "./components/CouponExplorer"

export default function InstructorCouponPage() {
    return (
        <div className="flex flex-col px-8 scrollbar-stable" style={{ height: 'calc(100vh - 100px)', minHeight: 0 }}>
            <div className="h-full overflow-y-auto pb-8">
                <CouponExplorer />
            </div>
        </div>
    )
}
