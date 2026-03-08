'use client'

import { Label } from '@/components/ui/label'
import { Image as ImageIcon, Gift, BadgeDollarSign } from 'lucide-react'
import { useMedia } from '@/hooks/useMedia'
import { useRef, useState } from 'react'
import { formatImageUrl } from '@/lib/utils/formatImageUrl'
import { CurrencyInput } from '@/components/ui/currency-input'
import SafeImage from '@/components/ui/SafeImage'
import { AvatarCropperDialog } from '@/components/ui/cropper-image'
import { cn } from '@/lib/utils'

interface Step3MediaPricingProps {
    data: {
        price: number
        thumbnailUrl: string
    }
    onChange: (data: Partial<Step3MediaPricingProps['data']>) => void
}

export default function Step4MediaPricing({ data, onChange }: Step3MediaPricingProps) {
    const { uploadCourseThumbnailAsync, isUploadingCourseThumbnail } = useMedia()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [cropperOpen, setCropperOpen] = useState(false)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [isFree, setIsFree] = useState(data.price === 0)

    const handlePricingToggle = (free: boolean) => {
        setIsFree(free)
        if (free) onChange({ price: 0 })
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Read file as data URL for the cropper
        const reader = new FileReader()
        reader.onload = () => {
            setSelectedImage(reader.result as string)
            setCropperOpen(true)
        }
        reader.readAsDataURL(file)

        // Reset input value to allow selecting the same file again
        e.target.value = ''
    }

    const handleCropped = async (file: File) => {
        try {
            const result = await uploadCourseThumbnailAsync(file)
            if (result?.fileUrl) {
                onChange({ thumbnailUrl: result.fileUrl })
            }
        } catch (error) {
            console.error('Failed to upload thumbnail:', error)
        }
    }

    return (
        <div className="w-full mx-auto py-4 sm:py-6 md:py-8 space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4 sm:px-0">
            <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Hình ảnh & Giá</h2>
                <p className="text-sm sm:text-base text-muted-foreground mr-12">
                    Thiết lập giá bán và hình ảnh đại diện cho khóa học.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:gap-8">
                {/* Pricing Section */}
                <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-1">
                        <Label className="text-sm sm:text-base font-semibold">Giá bán</Label>
                        <p className="text-xs sm:text-sm text-muted-foreground">Xác định mức giá cho khóa học của bạn.</p>
                    </div>

                    {/* Free / Paid Toggle */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => handlePricingToggle(true)}
                            className={cn(
                                'flex items-center gap-3 px-5 py-3 rounded-xl border-2 transition-all duration-200 w-full',
                                isFree
                                    ? 'border-primary bg-primary text-white shadow-md'
                                    : 'border-gray-200 bg-white text-gray-600 hover:border-primary/50'
                            )}
                        >
                            <Gift className="w-5 h-5 shrink-0" />
                            <div className="text-left">
                                <p className="font-semibold text-sm">Miễn phí</p>
                                <p className={cn('text-xs', isFree ? 'text-primary-foreground/70' : 'text-muted-foreground')}>Học viên truy cập miễn phí</p>
                            </div>
                        </button>
                        <button
                            type="button"
                            onClick={() => handlePricingToggle(false)}
                            className={cn(
                                'flex items-center gap-3 px-5 py-3 rounded-xl border-2 transition-all duration-200 w-full',
                                !isFree
                                    ? 'border-primary bg-primary text-white shadow-md'
                                    : 'border-gray-200 bg-white text-gray-600 hover:border-primary/50'
                            )}
                        >
                            <BadgeDollarSign className="w-5 h-5 shrink-0" />
                            <div className="text-left">
                                <p className="font-semibold text-sm">Có phí</p>
                                <p className={cn('text-xs', !isFree ? 'text-primary-foreground/70' : 'text-muted-foreground')}>Thu phí học viên</p>
                            </div>
                        </button>
                    </div>

                    {/* Price Input */}
                    {!isFree && (
                        <div className="space-y-2 pt-1">
                            <CurrencyInput
                                value={data.price}
                                onValueChange={(val) => onChange({ price: val })}
                                className="h-12 bg-transparent border border-gray-400 focus-visible:border-primary rounded-lg w-full"
                            />
                            {/* {data.price > 0 && (
                                <p className="text-sm text-muted-foreground font-medium">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.price)}
                                </p>
                            )} */}
                        </div>
                    )}
                </div>

                <div className="h-px bg-gray-100" />

                {/* Thumbnail Section */}
                <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-1">
                        <Label className="text-sm sm:text-base font-semibold">Ảnh bìa khóa học</Label>
                        <p className="text-xs sm:text-sm text-muted-foreground">Hình ảnh hấp dẫn giúp thu hút học viên (Tỷ lệ 16:9 khuyên dùng).</p>
                    </div>

                    <div
                        className="relative w-full aspect-video bg-gray-50 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-gray-400 active:border-gray-500 group cursor-pointer transition-colors"
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
                                <SafeImage
                                    src={formatImageUrl(data.thumbnailUrl) || ''}
                                    alt="Thumbnail"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                                    <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 mb-2" />
                                    <span className="text-base sm:text-lg font-medium px-4 text-center">Thay đổi ảnh bìa</span>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 py-8">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-gray-200 transition-colors">
                                    <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                                </div>
                                <span className="text-base sm:text-lg font-semibold text-gray-900 mb-1">Tải ảnh lên</span>
                                <span className="text-sm sm:text-base text-center px-4">Click để chọn ảnh từ máy tính</span>
                                <span className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-4">JPG, PNG, GIF (Tối đa 5MB)</span>
                            </div>
                        )}

                        {isUploadingCourseThumbnail && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AvatarCropperDialog
                open={cropperOpen}
                imageSrc={selectedImage}
                onClose={() => setCropperOpen(false)}
                onCropped={handleCropped}
                aspect={16 / 9}
                cropShape="rect"
            />
        </div>
    )
}
