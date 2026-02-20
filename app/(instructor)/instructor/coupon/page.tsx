"use client"

import { CouponExplorer } from "./components/CouponExplorer"

export default function InstructorCouponPage() {
    return (
        <div className="flex flex-col px-4 md:px-8 scrollbar-stable w-full" style={{ height: 'calc(100vh - 200px)', minHeight: 0 }}>
            <CouponExplorer />
        </div>
    )
}
