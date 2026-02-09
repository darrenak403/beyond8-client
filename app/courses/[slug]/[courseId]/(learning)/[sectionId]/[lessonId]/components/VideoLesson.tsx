'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  MediaPlayer,
  MediaProvider,
  TimeSlider,
  VolumeSlider,
  MuteButton,
  PlayButton,
  FullscreenButton,
  Controls,
  useMediaState,
  Menu,
  useVideoQualityOptions,
  Poster
} from '@vidstack/react'
import type { MediaPlayerInstance } from '@vidstack/react'
import '@vidstack/react/player/styles/base.css'
import {
  Play,
  Pause,
  Maximize,
  Minimize,
  Lightbulb,
  LightbulbOff,
  Volume1,
  Volume2,
  VolumeX,
  Download,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import DocumentDownloadButton from '@/components/ui/document-download-button'

// Custom Play Button Component with Animation
function CustomPlayButton() {
  const isPaused = useMediaState('paused')
  return (
    <PlayButton className="group relative flex items-center justify-center p-2 outline-none ring-inset ring-brand-purple focus-visible:ring-4 rounded-md">
      {isPaused ? (
        <Play className="w-8 h-8 fill-white text-white transition-transform group-hover:scale-110" />
      ) : (
        <Pause className="w-8 h-8 fill-white text-white transition-transform group-hover:scale-110" />
      )}
    </PlayButton>
  )
}

// Center Large Play Button
function CenterPlayButton() {
  const isPaused = useMediaState('paused')
  const hasStarted = useMediaState('started')

  if (!isPaused && hasStarted) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
      <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-[0_0_30px_rgba(168,85,247,0.4)] animate-in fade-in zoom-in duration-300 pointer-events-auto cursor-pointer hover:scale-110 transition-transform hover:bg-white/20">
        <PlayButton className="w-full h-full flex items-center justify-center">
          <Play className="w-8 h-8 fill-white text-white ml-1" />
        </PlayButton>
      </div>
    </div>
  )
}

function CustomFullscreenButton() {
  const isFullscreen = useMediaState('fullscreen')
  return (
    <FullscreenButton className="group p-2 hover:bg-white/10 rounded-md transition-colors">
      {isFullscreen ? (
        <Minimize className="w-5 h-5 text-white/90 group-hover:text-white" />
      ) : (
        <Maximize className="w-5 h-5 text-white/90 group-hover:text-white" />
      )}
    </FullscreenButton>
  )
}

// Theater Mode Button Component
function TheaterModeButton({ isTheaterMode, onToggle }: { isTheaterMode: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="group p-2 hover:bg-white/10 rounded-md transition-colors"
      title={isTheaterMode ? "Tắt chế độ rạp chiếu" : "Chế độ rạp chiếu"}
    >
      {isTheaterMode ? (
        <LightbulbOff className="w-5 h-5 text-white/90 group-hover:text-white" />
      ) : (
        <Lightbulb className="w-5 h-5 text-white/90 group-hover:text-white" />
      )}
    </button>
  )
}

// Video Quality Menu Component
function VideoQualitySubmenu({
  variants,
  currentSrc,
  onQualityChange,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variants?: any[]
  currentSrc?: string
  onQualityChange?: (url: string) => void
}) {
  const options = useVideoQualityOptions({ auto: true, sort: 'descending' })
  const currentQualityHeight = options.selectedQuality?.height

  // Logic hiển thị hint
  let hint = ''
  if (variants && variants.length > 0) {
    // Manual mode
    const activeVariant = variants.find(v => v.Url === currentSrc)
    hint = activeVariant ? (activeVariant.Quality === 'master' ? 'Tự động' : (
      /^\d+$/.test(activeVariant.Quality) ? `${activeVariant.Quality}p` : activeVariant.Quality
    )) : 'Tự động'
  } else {
    // Vidstack auto mode
    hint = options.selectedValue !== 'auto' && currentQualityHeight
      ? `${currentQualityHeight}p`
      : `Auto${currentQualityHeight ? ` (${currentQualityHeight}p)` : ''}`
  }


  return (
    <Menu.Root>
      <Menu.Button
        disabled={!variants && options.disabled}
        className="group px-3 py-2 hover:bg-white/10 rounded-md transition-colors text-white/90 hover:text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {hint}
      </Menu.Button>
      <Menu.Content
        className="bg-black/95 backdrop-blur-md rounded-lg border border-white/10 shadow-2xl p-2 min-w-[120px]"
        placement="top"
        offset={12}
      >
        <Menu.RadioGroup value={currentSrc || options.selectedValue} className="space-y-1">
          {variants && variants.length > 0 ? (
            // Render variants manual
            variants.map((variant) => {
              const label = variant.Quality === 'master' ? 'Tự động' : (
                /^\d+$/.test(variant.Quality) ? `${variant.Quality}p` : variant.Quality
              )
              return (
                <Menu.Radio
                  value={variant.Url}
                  onSelect={() => onQualityChange?.(variant.Url)}
                  key={variant.Url}
                  className="px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-md cursor-pointer transition-colors text-sm flex items-center justify-between data-[checked]:bg-brand-purple/20 data-[checked]:text-brand-purple"
                >
                  <span>{label}</span>
                  {variant.Resolution && <span className="text-xs text-white/50 ml-2">{variant.Resolution}</span>}
                </Menu.Radio>
              )
            })
          ) : (
            // Fallback to Vidstack
            options.map(({ label, value, bitrateText, select }) => (
              <Menu.Radio
                value={value}
                onSelect={select}
                key={value}
                className="px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-md cursor-pointer transition-colors text-sm flex items-center justify-between data-[checked]:bg-brand-purple/20 data-[checked]:text-brand-purple"
              >
                <span>{label}</span>
                {bitrateText && <span className="text-xs text-white/50 ml-2">{bitrateText}</span>}
              </Menu.Radio>
            ))
          )}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  )
}

function VolumeControl() {
  const volume = useMediaState('volume')
  const isMuted = useMediaState('muted')

  return (
    <div className="group flex items-center relative gap-0.5 px-2 bg-black/20 backdrop-blur-sm rounded-full hover:bg-black/40 transition-all duration-300 border border-white/5 hover:border-white/10">
      <MuteButton className="group-hover:text-white text-white/90 transition-colors p-1.5 rounded-full hover:bg-white/10">
        {isMuted || volume == 0 ? (
          <VolumeX className="w-5 h-5" />
        ) : volume < 0.5 ? (
          <Volume1 className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </MuteButton>
      <div className="w-0 overflow-hidden group-hover:w-20 transition-all duration-300 ease-out origin-left opacity-0 group-hover:opacity-100">
        <VolumeSlider.Root className="relative flex items-center select-none touch-none w-20 h-8 cursor-pointer group/slider mx-2">
          <VolumeSlider.Track className="bg-white/30 relative w-full h-[3px] rounded-full group-hover/slider:h-1 transition-all" />
          <VolumeSlider.TrackFill
            className="bg-white absolute left-0 top-1/2 -translate-y-1/2 h-[3px] rounded-full origin-left group-hover/slider:h-1 transition-all"
            style={{ width: 'var(--slider-fill)' }}
          />
          <VolumeSlider.Thumb
            className="absolute top-1/2 left-0 w-3 h-3 bg-white rounded-full shadow-sm opacity-0 group-hover/slider:opacity-100 transition-opacity transform -translate-y-1/2"
            style={{ left: 'var(--slider-fill)' }}
          />
        </VolumeSlider.Root>
      </div>
    </div>
  )
}


// Time Display Component
function TimeDisplay({ durationSeconds }: { durationSeconds?: number | null }) {
  const currentTime = useMediaState('currentTime')
  const duration = useMediaState('duration')

  const finalDuration = duration || (durationSeconds || 0)

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${String(secs).padStart(2, '0')}`
  }

  return (
    <div className="flex items-center gap-1 text-white text-xs font-medium">
      <span>{formatTime(currentTime)}</span>
      <span className="text-white/50">/</span>
      <span className="text-white/70">{formatTime(finalDuration)}</span>
    </div>
  )
}

interface VideoLessonProps {
  title: string
  description?: string | null
  videoUrl?: string
  thumbnailUrl?: string | null
  originVideoUrl: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variants?: any[]
  durationSeconds?: number | null
  isDownloadable?: boolean
}

export default function VideoLesson({ title, description, videoUrl, thumbnailUrl, variants, durationSeconds, originVideoUrl, isDownloadable = false }: VideoLessonProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isTheaterMode, setIsTheaterMode] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(videoUrl)
  const playerRef = React.useRef<MediaPlayerInstance>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true)
  }, [])

  // Sync currentSrc with videoUrl when prop changes (lesson change)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentSrc(videoUrl)
  }, [videoUrl])

  // Ensure currentTime starts at 0 when video URL or duration changes
  // Note: Only reset if the *base* videoUrl changes (lesson changes), not when switching quality manually
  useEffect(() => {
    if (!playerRef.current) return
    const player = playerRef.current

    const resetCurrentTime = () => {
      try {
        if (player.currentTime > 0) {
          player.currentTime = 0
        }
      } catch (e) {
        console.warn('Could not reset currentTime', e)
      }
    }

    // Only reset if we just mounted OR if videoUrl text prop changed (likely new lesson loaded)
    // We do NOT want to reset when currentSrc changes due to quality switch
    // This is tricky. Let's rely on [videoUrl] changing (which means lesson changed)
    resetCurrentTime()
    const resetTimer1 = setTimeout(resetCurrentTime, 50)

    return () => {
      clearTimeout(resetTimer1)
    }

  }, [videoUrl, durationSeconds])

  const handleQualityChange = (newUrl: string) => {
    if (playerRef.current) {
      // Save current time
      const currentTime = playerRef.current.currentTime;
      const paused = playerRef.current.paused;

      setCurrentSrc(newUrl)

      // Restore time after short delay to allow src load
      // Note: Vidstack might handle 'src' change gracefully, but let's be safe
      setTimeout(() => {
        if (playerRef.current) {
          playerRef.current.currentTime = currentTime;
          if (!paused) playerRef.current.play();
        }
      }, 100)
    } else {
      setCurrentSrc(newUrl)
    }
  }

  // Handle ESC key to exit theater mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isTheaterMode) {
        setIsTheaterMode(false)
      }
    }

    if (isTheaterMode) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isTheaterMode])

  if (!isMounted) {
    return (
      <div className="w-full aspect-video bg-gray-900 animate-pulse rounded-2xl flex items-center justify-center">
        <div className="text-white/30 font-medium">Loading Player...</div>
      </div>
    )
  }

  const finalUrl = currentSrc || videoUrl;

  if (!finalUrl) {
    return (
      <div className="w-full aspect-video bg-gray-900 rounded-2xl flex items-center justify-center">
        <div className="text-white/60 text-sm">
          Không tìm thấy URL video cho bài học này.
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Backdrop for Theater Mode */}
      {isTheaterMode && (
        <div
          className="fixed inset-0 bg-black/95 z-[60] animate-in fade-in duration-300 backdrop-blur-sm"
          onClick={() => setIsTheaterMode(false)}
        />
      )}

      {/* Placeholder to prevent layout shift */}
      {isTheaterMode && <div className="w-full aspect-video mb-8" aria-hidden="true" />}

      {/* Video Player Container */}
      <motion.div
        layout
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className={cn(
          "w-full group relative overflow-hidden ring-1 ring-white/10 bg-black aspect-video",
          isTheaterMode
            ? "fixed inset-0 z-[70] m-auto w-full max-w-6xl h-fit max-h-screen rounded-none md:rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            : "mb-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100"
        )}
      >
        <MediaPlayer
          ref={playerRef}
          title={title}
          src={finalUrl}
          playsInline
          aspectRatio="16/9"
          load="eager"
          className="w-full h-full"
        >
          <MediaProvider>
            <Poster className="vds-poster object-cover w-full h-full absolute inset-0 block opacity-0 data-[visible]:opacity-100 transition-opacity duration-200" src={thumbnailUrl || undefined} alt={title} />
          </MediaProvider>

          {/* Click to Play/Pause Overlay */}
          <div
            className="absolute inset-0 z-10 cursor-pointer"
            onClick={() => {
              if (playerRef.current) {
                if (playerRef.current.paused) {
                  playerRef.current.play()
                } else {
                  playerRef.current.pause()
                }
              }
            }}
          />

          {/* Center Play Button Overlay */}
          <CenterPlayButton />

          {/* Pro Max Controls Overlay */}
          <Controls.Root className="absolute inset-0 z-30 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 data-[visible]:opacity-100 pointer-events-none">

            <div className="p-4 md:p-6 w-full space-y-4 pointer-events-auto">

              {/* Progress Bar (TimeSlider) */}
              <div className="flex items-center gap-3">
                <TimeSlider.Root className="group/slider relative flex items-center select-none touch-none w-full h-4 cursor-pointer">
                  <TimeSlider.Track className="relative bg-white/20 rounded-full w-full h-1 group-hover/slider:h-2 transition-all duration-300 overflow-hidden">
                    {/* Đoạn đã xem */}
                    <TimeSlider.TrackFill
                      className="bg-primary absolute left-0 top-0 h-full rounded-full"
                      style={{ width: 'var(--slider-fill)' }}
                    />
                    {/* Đoạn đã buffer */}
                    <TimeSlider.Progress
                      className="bg-white/30 absolute left-0 top-0 h-full rounded-full"
                      style={{ width: 'var(--slider-progress)' }}
                    />
                  </TimeSlider.Track>
                  <TimeSlider.Thumb
                    className="absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-lg ring-2 ring-brand-purple opacity-0 group-hover/slider:opacity-100 transition-opacity duration-200 pointer-events-none"
                    style={{ left: 'var(--slider-fill)', transform: 'translate(-50%, -50%)' }}
                  />
                  {/* Preview implementation would go here if thumbnails available */}
                </TimeSlider.Root>
                <TimeDisplay durationSeconds={durationSeconds} />
              </div>

              {/* Bottom Bar: Play | Volume | Spacer | Title | Settings | Fullscreen */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CustomPlayButton />

                  <VolumeControl />

                  <div className="hidden md:block ml-2">
                    <h3 className="text-white text-sm font-medium line-clamp-1 max-w-[200px]">
                      {description || title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Download Button */}
                  {isDownloadable && videoUrl && (
                    <DocumentDownloadButton
                      url={originVideoUrl}
                      className="group p-2 hover:bg-white/10 rounded-md transition-colors"
                      title="Tải xuống video"
                    >
                      <Download className="w-5 h-5 text-white/90 group-hover:text-white" />
                    </DocumentDownloadButton>
                  )}

                  <VideoQualitySubmenu
                    variants={variants}
                    currentSrc={currentSrc}
                    onQualityChange={handleQualityChange}
                  />

                  <TheaterModeButton
                    isTheaterMode={isTheaterMode}
                    onToggle={() => setIsTheaterMode(!isTheaterMode)}
                  />

                  <CustomFullscreenButton />
                </div>
              </div>
            </div>

          </Controls.Root>
        </MediaPlayer>
      </motion.div>
    </>
  )
}
