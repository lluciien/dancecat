"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cat, Volume2, VolumeX } from "lucide-react"

interface ClickText {
  id: number
  text: string
  x: number
  y: number
}

export default function DancingCat() {
  const [isDancing, setIsDancing] = useState(false)
  const [isHappy, setIsHappy] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [clickTexts, setClickTexts] = useState<ClickText[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 使用外链MP3
  useEffect(() => {
    audioRef.current = new Audio("https://music.163.com/song/media/outer/url?id=516497142.mp3")
    audioRef.current.loop = true

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      if (isDancing && !isMuted) {
        audioRef.current.play().catch(() => {
          setIsMuted(true)
        })
      } else {
        audioRef.current.pause()
      }
    }
  }, [isDancing, isMuted])

  const cuteTexts = [
    "喵~",
    "nya~",
    "✨",
    "meow!",
    "푸르릉~",
    "にゃん!",
    "🌟",
    "💕",
    "🎵",
    "🌈",
    "⭐",
    "💫",
    "🎀",
    "🐾",
    "可爱!",
    "kawaii!",
    "萌萌哒",
    "귀여워!",
    "かわいい!",
    "♪♫♬",
    "❤️",
    "🦋",
    "🌸",
    "✿",
    "❀",
    "🍥",
    "🎪",
  ]

  const addClickText = (e: React.MouseEvent<HTMLDivElement>) => {
    // 直接使用相对于视口的坐标
    const x = e.clientX
    const y = e.clientY

    // 随机选择1-3个文字/符号
    const count = Math.floor(Math.random() * 3) + 1
    for (let i = 0; i < count; i++) {
      const newText = {
        id: Date.now() + i,
        text: cuteTexts[Math.floor(Math.random() * cuteTexts.length)],
        x: x + (Math.random() - 0.5) * 40, // 增加随机偏移范围
        y: y + (Math.random() - 0.5) * 40,
      }
      setClickTexts((prev) => [...prev, newText])

      setTimeout(() => {
        setClickTexts((prev) => prev.filter((t) => t.id !== newText.id))
      }, 1000)
    }
  }

  const danceVariants = {
    dance: {
      y: [0, -20, 0, -15, 0],
      rotate: [0, 15, -8, 15, -8, 0],
      scale: [1, 1.1, 0.9, 1.05, 0.95, 1],
      transition: {
        duration: 1.2,
        repeat: Number.POSITIVE_INFINITY,
        ease: [0.68, -0.55, 0.265, 1.55],
      },
    },
    hover: {
      scale: 1.1,
      rotate: [0, -5, 5, 0],
      transition: {
        duration: 0.3,
      },
    },
  }

  const noteVariants = {
    animate: (i: number) => ({
      opacity: [0, 1, 0],
      y: [-10, -50],
      x: Math.sin(i) * 20,
      transition: {
        duration: 1,
        repeat: Number.POSITIVE_INFINITY,
        delay: i * 0.2,
      },
    }),
  }

  const clickTextVariants = {
    initial: { opacity: 0, scale: 0.5 },
    animate: {
      opacity: [0, 1, 0],
      scale: [0.5, 1.2, 1],
      y: -60, // 增加上升距离
      x: (Math.random() - 0.5) * 60, // 添加随机水平移动
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-100 to-purple-100"
      onClick={addClickText}
    >
      {/* 音量控制按钮 */}
      <motion.button
        className="fixed top-4 right-4 p-2 bg-white/80 rounded-full shadow-md"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation() // 防止触发父元素的点击事件
          setIsMuted(!isMuted)
        }}
      >
        {isMuted ? <VolumeX className="text-pink-500" /> : <Volume2 className="text-pink-500" />}
      </motion.button>

      <div className="relative">
        {/* 点击产生的文字动画 */}
        <AnimatePresence>
          {clickTexts.map(({ id, text, x, y }) => (
            <motion.div
              key={id}
              className="fixed pointer-events-none text-pink-500 font-bold text-xl z-50"
              style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
              variants={clickTextVariants}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0, scale: 0.5 }}
            >
              {text}
            </motion.div>
          ))}
        </AnimatePresence>

        {isDancing && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={noteVariants}
                animate="animate"
                className="absolute text-2xl text-pink-500"
                style={{
                  top: -20,
                  left: 50 + i * 30,
                }}
              >
                {["♪", "♫", "♩"][i]}
              </motion.div>
            ))}
          </>
        )}

        <motion.div
          animate={isDancing ? "dance" : {}}
          whileHover="hover"
          variants={danceVariants}
          className="cursor-pointer relative"
          onClick={(e) => {
            e.stopPropagation() // 防止触发父元素的点击事件
            setIsDancing(!isDancing)
            setIsHappy(true)
            setTimeout(() => setIsHappy(false), 300)
          }}
        >
          <Cat size={200} strokeWidth={1.5} className="text-pink-500 drop-shadow-lg" />
          {/* 眼睛 */}
          <motion.div
            className="absolute top-[75px] left-[65px] w-3 h-3 bg-pink-500 rounded-full"
            animate={
              isHappy
                ? {
                    scaleY: [1, 0.2, 1],
                    transition: { duration: 0.3 },
                  }
                : {}
            }
          />
          <motion.div
            className="absolute top-[75px] right-[65px] w-3 h-3 bg-pink-500 rounded-full"
            animate={
              isHappy
                ? {
                    scaleY: [1, 0.2, 1],
                    transition: { duration: 0.3 },
                  }
                : {}
            }
          />
        </motion.div>
      </div>

      <motion.p
        className="mt-6 text-xl font-bold text-pink-500"
        animate={{
          scale: isDancing ? [1, 1.1, 1] : 1,
          transition: {
            duration: 0.5,
            repeat: isDancing ? Number.POSITIVE_INFINITY : 0,
            repeatType: "reverse",
          },
        }}
      >
        {isDancing ? "喵喵喵 ～♪" : "摸摸我跳舞吧！"}
      </motion.p>

      {isDancing && (
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-sm text-pink-400">
          再次点击停止跳舞
        </motion.p>
      )}
    </div>
  )
}

