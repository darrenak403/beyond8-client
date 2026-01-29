'use client'

import * as React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface CurrencyInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    value: number
    onValueChange: (value: number) => void
}

const formatNumberWithSeparator = (num: string): string => {
    if (!num) return ''
    // Xóa tất cả ký tự không phải số
    const cleanNum = num.replace(/[^0-9]/g, '')
    if (!cleanNum) return ''
    // Thêm dấu chấm cách 3 số từ phải sang trái
    return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
    ({ value, onValueChange, className, ...props }, ref) => {
        const [displayValue, setDisplayValue] = useState(
            value === 0 ? '' : new Intl.NumberFormat('vi-VN').format(value),
        )
        const [isFocused, setIsFocused] = useState(false)
        // Track previous value to sync state from props
        const [prevValue, setPrevValue] = useState(value)

        // Sync displayValue when value prop changes (and not focused)
        if (value !== prevValue) {
            setPrevValue(value)
            // Only update display value if not focused (user is not typing)
            if (!isFocused) {
                setDisplayValue(value === 0 ? '' : new Intl.NumberFormat('vi-VN').format(value))
            }
        }

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = e.target.value.replace(/[^0-9]/g, '')

            const formattedValue = formatNumberWithSeparator(inputValue)
            setDisplayValue(formattedValue)

            if (inputValue === '') {
                onValueChange(0)
            } else {
                const numberValue = Number.parseInt(inputValue, 10)

                if (!isNaN(numberValue) && numberValue <= Number.MAX_SAFE_INTEGER) {
                    onValueChange(numberValue)
                }
            }
        }

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true)
            if (value !== 0) {
                const formattedValue = formatNumberWithSeparator(value.toString())
                setDisplayValue(formattedValue)
            }
            props.onFocus?.(e)
        }

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false)
            // Khi blur, format lại với dấu phẩy
            if (value !== 0) {
                setDisplayValue(new Intl.NumberFormat('vi-VN').format(value))
            } else {
                setDisplayValue('')
            }
            props.onBlur?.(e)
        }

        return (
            <div className="relative">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-medium text-muted-foreground underline">
                    đ
                </div>
                <Input
                    type="text"
                    value={displayValue}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={cn('pl-7 text-lg font-bold tracking-wider', className)}
                    placeholder="0"
                    ref={(node) => {
                        if (typeof ref === 'function') {
                            ref(node)
                        } else if (ref) {
                            ref.current = node
                        }
                    }}
                    {...props}
                />
            </div>
        )
    },
)
CurrencyInput.displayName = 'CurrencyInput'

export { CurrencyInput }
