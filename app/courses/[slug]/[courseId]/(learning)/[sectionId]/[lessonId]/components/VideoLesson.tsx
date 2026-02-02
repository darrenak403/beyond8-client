'use client'

import React, { useEffect, useState } from 'react'
import {
  MediaPlayer,
  MediaProvider,
  TimeSlider,
  PlayButton,
  FullscreenButton,
  Controls,
  useMediaState
} from '@vidstack/react'
import type { MediaPlayerInstance } from '@vidstack/react'
import '@vidstack/react/player/styles/base.css'
import { 
  Play, 
  Pause, 
  Maximize, 
  Minimize, 
} from 'lucide-react'

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
  durationSeconds?: number | null
}

export default function VideoLesson({ title, description, videoUrl, durationSeconds }: VideoLessonProps) {
  const [isMounted, setIsMounted] = useState(false)
  const playerRef = React.useRef<MediaPlayerInstance>(null)

  useEffect(() => {
    //eslint-disable-next-line
    setIsMounted(true)
  }, [])

  // Set duration from durationSeconds if available and ensure currentTime starts at 0
  useEffect(() => {
    if (!playerRef.current) return
    
    const player = playerRef.current
    
    // Function to reset currentTime to 0
    const resetCurrentTime = () => {
      if (player.currentTime > 0) {
        player.currentTime = 0
      }
    }
    
    // Reset immediately and after delays to catch async updates
    resetCurrentTime()
    const resetTimer1 = setTimeout(resetCurrentTime, 50)
    const resetTimer2 = setTimeout(resetCurrentTime, 200)
    
    // Set duration if video hasn't loaded its own duration yet
    if (durationSeconds && durationSeconds > 0) {
      if (!player.duration || player.duration === 0) {
        // Set duration and ensure currentTime is 0
        try {
          // @ts-expect-error - internal API to set duration
          player.mediaStore?.setState?.({ duration: durationSeconds, currentTime: 0 })
        } catch (e) {
          // Fallback if internal API is not available
          console.warn('Could not set duration via internal API', e)
        }
      }
    }
    
    return () => {
      clearTimeout(resetTimer1)
      clearTimeout(resetTimer2)
    }
  }, [durationSeconds, videoUrl])

  if (!isMounted) {
    return (
      <div className="w-full aspect-video bg-gray-900 animate-pulse rounded-2xl flex items-center justify-center">
        <div className="text-white/30 font-medium">Loading Player...</div>
      </div>
    )
  }

  const finalUrl = videoUrl || "https://d30z0qh7rhzgt8.cloudfront.net/courses/hls/meo_con_lon_ton/meo_con_lon_ton_1080p.m3u8"

  return (
    <div className="w-full mb-8 group relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-black aspect-video">
      <MediaPlayer 
        key={finalUrl}
        ref={playerRef}
        title={title}
        src={finalUrl}
        playsInline
        aspectRatio="16/9"
        load="eager"
        className="w-full h-full"
      >
        <MediaProvider />
        
        {/* Center Play Button Overlay */}
        <CenterPlayButton />

        {/* Pro Max Controls Overlay */}
        <Controls.Root className="absolute inset-0 z-30 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 data-[visible]:opacity-100 pointer-events-none">
           
           <div className="p-4 md:p-6 w-full space-y-4 pointer-events-auto">
              
              {/* Progress Bar (TimeSlider) */}
              <div className="flex items-center gap-3">
                <TimeSlider.Root className="group/slider relative flex items-center select-none touch-none w-full h-4 cursor-pointer">
                   <TimeSlider.Track className="relative ring-brand-purple bg-white/20 rounded-full w-full h-1 group-hover/slider:h-2 transition-all duration-300">
                      <TimeSlider.TrackFill className="bg-brand-gradient absolute h-full rounded-full will-change-[width]" />
                      <TimeSlider.Progress className="bg-white/30 absolute h-full rounded-full will-change-[width]" />
                   </TimeSlider.Track>
                   <TimeSlider.Thumb className="block w-4 h-4 bg-white rounded-full shadow-lg ring-2 ring-brand-purple opacity-0 group-hover/slider:opacity-100 transition-opacity transform scale-0 group-hover/slider:scale-100 transition-transform duration-200" />
                   {/* Preview implementation would go here if thumbnails available */}
                </TimeSlider.Root>
                <TimeDisplay durationSeconds={durationSeconds} />
              </div>

              {/* Bottom Bar: Play | Volume | Spacer | Title | Settings | Fullscreen */}
              <div className="flex items-center justify-between gap-4">
                 <div className="flex items-center gap-4">
                    <CustomPlayButton />

                    <div className="hidden md:block">
                        <h3 className="text-white text-sm font-medium line-clamp-1 max-w-[200px]">
                          {description || title}
                        </h3>
                    </div>
                 </div>

                 <div className="flex items-center gap-2">
                    
                    <CustomFullscreenButton />
                 </div>
              </div>
           </div>

        </Controls.Root>
      </MediaPlayer>
    </div>
  )
}
