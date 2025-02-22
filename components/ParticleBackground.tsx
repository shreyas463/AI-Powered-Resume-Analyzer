'use client'

import React from 'react'
import { useEffect, useRef } from 'react'

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set initial canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Handle window resize
    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }
    window.addEventListener('resize', handleResize)

    // Simple particle system
    const particles: Array<{
      x: number
      y: number
      speed: number
      size: number
    }> = []

    // Create particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * 2 + 0.5,
        size: Math.random() * 3 + 1
      })
    }

    // Animation function
    function animate() {
      if (!ctx || !canvas) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach(particle => {
        // Move particle
        particle.y += particle.speed

        // Reset position if particle goes off screen
        if (particle.y > canvas.height) {
          particle.y = 0
          particle.x = Math.random() * canvas.width
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ background: 'transparent' }}
    />
  )
} 