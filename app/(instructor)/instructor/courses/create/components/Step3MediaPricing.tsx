'use client'

import { Label } from '@/components/ui/label'

import { Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { useMedia } from '@/hooks/useMedia'
import { useRef } from 'react'
import { formatImageUrl } from '@/lib/utils/formatImageUrl'
import { CurrencyInput } from '@/components/ui/currency-input'

interface Step3MediaPricingProps {
    data: {
        price: number
        thumbnailUrl: string
    }
    onChange: (data: Partial<Step3MediaPricingProps['data']>) => void
}

export default function Step3MediaPricing({ data, onChange }: Step3MediaPricingProps) {
    const { uploadAvatarAsync, isUploading } = useMedia()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            const result = await uploadAvatarAsync(file)
            if (result?.fileUrl) {
                onChange({ thumbnailUrl: result.fileUrl })
            }
        } catch (error) {
            console.error('Failed to upload thumbnail:', error)
        }
    }

    return (
        <div className="w-full mx-auto py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Hình ảnh & Giá</h2>
                <p className="text-muted-foreground">
                    Thiết lập giá bán và hình ảnh đại diện cho khóa học.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Thumbnail Section */}
                <div className="space-y-4">
                    <div className="space-y-1">
                        <Label className="text-base font-semibold">Ảnh bìa khóa học</Label>
                        <p className="text-sm text-muted-foreground">Hình ảnh hấp dẫn giúp thu hút học viên (Tỷ lệ 16:9 khuyên dùng).</p>
                    </div>

                    <div
                        className="relative w-full aspect-video bg-gray-50 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-gray-400 group cursor-pointer transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileSelect}
                        />

                        {data.thumbnailUrl ? (
                            <>
                                <Image
                                    src={formatImageUrl(data.thumbnailUrl) || ''}
                                    alt="Thumbnail"
                                    fill
                                    unoptimized
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                                    <ImageIcon className="w-8 h-8 mb-2" />
                                    <span className="font-medium">Thay đổi ảnh bìa</span>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 group-hover:bg-gray-200 transition-colors">
                                    <ImageIcon className="w-6 h-6" />
                                </div>
                                <span className="text-base font-semibold text-gray-900 mb-1">Tải ảnh lên</span>
                                <span className="text-sm text-center px-4">Click để chọn ảnh từ máy tính</span>
                                <span className="text-xs text-muted-foreground mt-4">JPG, PNG, GIF (Tối đa 5MB)</span>
                            </div>
                        )}

                        {isUploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Pricing Section */}
                <div className="space-y-4">
                    <div className="space-y-1">
                        <Label className="text-base font-semibold">Giá bán</Label>
                        <p className="text-sm text-muted-foreground">Xác định mức giá cho khóa học của bạn.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <CurrencyInput
                                value={data.price}
                                onValueChange={(val) => onChange({ price: val })}
                                className="pl-10 h-12 text-2xl md:text-2xl font-bold tracking-tight bg-transparent border border-gray-400 focus-visible:border-black rounded-lg"
                                placeholder="0"
                            />
                            <p className="text-sm text-muted-foreground font-medium">
                                {data.price === 0 ? 'Miễn phí' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.price)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
