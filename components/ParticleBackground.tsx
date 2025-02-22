'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    let animationFrameId: number

    const initCanvas = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Set canvas size
      const handleResize = () => {
        if (!canvas) return
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
      handleResize()
      window.addEventListener('resize', handleResize)

      // Create particles
      const particles: Particle[] = []
      const particleCount = 50

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25
        })
      }

      // Animation loop
      const animate = () => {
        if (!canvas || !ctx) return

        // Clear and fill background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Update and draw particles
        particles.forEach(particle => {
          // Update position
          particle.x += particle.speedX
          particle.y += particle.speedY

          // Handle screen boundaries
          if (particle.x > canvas.width) particle.x = 0
          if (particle.x < 0) particle.x = canvas.width
          if (particle.y > canvas.height) particle.y = 0
          if (particle.y < 0) particle.y = canvas.height

          // Draw particle
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()
        })

        animationFrameId = requestAnimationFrame(animate)
      }

      animate()

      return () => {
        window.removeEventListener('resize', handleResize)
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId)
        }
      }
    }

    const cleanup = initCanvas()
    return () => {
      if (cleanup) cleanup()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ background: 'linear-gradient(to bottom right, #0f172a, #1e293b)' }}
    />
  )
}