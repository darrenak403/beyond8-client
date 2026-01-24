"use client"

import { useRef, useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import gsap from "gsap"

export interface RoleBadgeItemProps {
    role: string
    variant?: "default" | "secondary" | "destructive" | "outline"
    className?: string
    onClick?: () => void
    style?: React.CSSProperties
}

export function RoleBadgeItem({ role, variant = "outline", className, onClick, style }: RoleBadgeItemProps) {
    return (
        <Badge
            variant={variant}
            className={`capitalize whitespace-nowrap ${className}`}
            onClick={onClick}
            style={style}
        >
            {role === "ROLE_STUDENT" ? "Học viên" : role === "ROLE_INSTRUCTOR" ? "Giảng viên" : role === "ROLE_STAFF" ? "Nhân viên" : "Admin"}
        </Badge>
    )
}

interface RoleBadgesProps {
    roles: string[]
}

export function RoleBadges({ roles }: RoleBadgesProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
        if (!containerRef.current || roles.length <= 1) return

        const badges = containerRef.current.querySelectorAll('.role-badge')
        const plusBadge = containerRef.current.querySelector('.plus-badge')

        const handleMouseEnter = () => {
            setIsHovered(true)

            // Fade out plus badge
            if (plusBadge) {
                gsap.to(plusBadge, {
                    opacity: 0,
                    duration: 0.2
                })
            }

            // Fan out all badges slightly without moving much
            badges.forEach((badge, index) => {
                let x = 0, y = 0, rotation = 0

                if (roles.length === 2) {
                    // 2 roles: spread horizontally slightly
                    const spacing = 25
                    x = (index - 0.5) * spacing
                    y = 0
                    rotation = (index === 0 ? -8 : 8)
                } else if (roles.length === 3) {
                    // 3 roles: slight arc
                    const positions = [
                        { x: -30, y: -5, rotation: -10 },   // left
                        { x: 0, y: -8, rotation: 0 },       // center (slightly higher)
                        { x: 30, y: -5, rotation: 10 }      // right
                    ]
                    const pos = positions[index]
                    x = pos.x
                    y = pos.y
                    rotation = pos.rotation
                } else if (roles.length === 4) {
                    // 4 roles: gentle arc
                    const positions = [
                        { x: -40, y: -3, rotation: -12 },
                        { x: -15, y: -6, rotation: -5 },
                        { x: 15, y: -6, rotation: 5 },
                        { x: 40, y: -3, rotation: 12 }
                    ]
                    const pos = positions[index]
                    x = pos.x
                    y = pos.y
                    rotation = pos.rotation
                }

                gsap.to(badge, {
                    opacity: 1,
                    rotation: rotation,
                    x: x,
                    y: y,
                    duration: 0.4,
                    ease: "back.out(1.7)"
                })
            })
        }

        const handleMouseLeave = () => {
            setIsHovered(false)

            // Show plus badge again
            if (plusBadge) {
                gsap.to(plusBadge, {
                    opacity: 1,
                    duration: 0.2,
                    delay: 0.1
                })
            }

            // Stack badges back
            badges.forEach((badge, index) => {
                gsap.to(badge, {
                    opacity: index === 0 ? 1 : 0,
                    rotation: 0,
                    x: 0,
                    y: 0,
                    duration: 0.3,
                    ease: "power2.inOut"
                })
            })
        }

        const container = containerRef.current
        container.addEventListener('mouseenter', handleMouseEnter)
        container.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            container.removeEventListener('mouseenter', handleMouseEnter)
            container.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [roles.length])

    if (roles.length <= 1) {
        return (
            <div className="flex flex-wrap gap-1">
                {roles.map((role) => (
                    <RoleBadgeItem key={role} role={role} variant="default" />
                ))}
            </div>
        )
    }

    return (
        <div
            ref={containerRef}
            className="relative inline-flex items-center cursor-pointer"
            style={{ minWidth: '100px', height: '26px' }}
        >
            {roles.map((role, index) => (
                <RoleBadgeItem
                    key={role}
                    role={role}
                    variant="default"
                    className="role-badge absolute"
                    style={{
                        zIndex: roles.length - index,
                        transformOrigin: "center center",
                        opacity: index === 0 ? 1 : 0,
                        left: '0',
                        top: '0'
                    }}
                />
            ))}
            {!isHovered && (
                <Badge
                    variant="secondary"
                    className="plus-badge absolute bg-purple-100 text-purple-700 hover:bg-purple-200 text-xs px-1.5 py-0.5"
                    style={{
                        zIndex: roles.length + 1,
                        fontSize: '10px',
                        left: '4.5rem',
                        top: '0'
                    }}
                >
                    +{roles.length - 1}
                </Badge>
            )}
        </div>
    )
}