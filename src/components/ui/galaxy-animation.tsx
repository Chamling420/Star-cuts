'use client'

import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  twinkleSpeed: number
  twinklePhase: number
  color: string
}

interface ShootingStar {
  x: number
  y: number
  length: number
  speed: number
  angle: number
  opacity: number
  life: number
  maxLife: number
  trail: { x: number; y: number; opacity: number }[]
}

interface Nebula {
  x: number
  y: number
  radius: number
  color: string
  opacity: number
  drift: number
  phase: number
}

interface MoonData {
  x: number
  y: number
  radius: number
  glowRadius: number
  phase: number
}

export default function GalaxyAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let width = 0
    let height = 0

    // ─── Resize Handler ─────────────────────────────────────────────
    function resize() {
      if (!canvas) return
      width = canvas.parentElement?.clientWidth || window.innerWidth
      height = canvas.parentElement?.clientHeight || window.innerHeight
      canvas.width = width
      canvas.height = height
    }
    resize()
    window.addEventListener('resize', resize)

    // ─── Color Palette ──────────────────────────────────────────────
    const starColors = [
      '#ffffff',
      '#ffe4c4',
      '#ffd2a1',
      '#c4d4ff',
      '#aabfff',
      '#ffc8dd',
      '#bde0fe',
      '#ffafcc',
    ]

    const nebulaColors = [
      'rgba(139, 92, 246, 0.03)',   // violet
      'rgba(236, 72, 153, 0.025)',  // pink
      'rgba(59, 130, 246, 0.025)',  // blue
      'rgba(168, 85, 247, 0.03)',   // purple
      'rgba(244, 114, 182, 0.02)',  // rose
    ]

    // ─── Create Stars ───────────────────────────────────────────────
    const stars: Star[] = []
    const starCount = Math.min(400, Math.floor((width * height) / 3000))

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 0.3,
        speed: Math.random() * 0.3 + 0.05,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.03 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      })
    }

    // ─── Create Nebulae ─────────────────────────────────────────────
    const nebulae: Nebula[] = []
    for (let i = 0; i < 5; i++) {
      nebulae.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 300 + 150,
        color: nebulaColors[i % nebulaColors.length],
        opacity: Math.random() * 0.5 + 0.3,
        drift: Math.random() * 0.2 + 0.05,
        phase: Math.random() * Math.PI * 2,
      })
    }

    // ─── Create Moon ────────────────────────────────────────────────
    const moon: MoonData = {
      x: width * 0.82,
      y: height * 0.18,
      radius: Math.min(width, height) * 0.045,
      glowRadius: Math.min(width, height) * 0.12,
      phase: 0,
    }

    // ─── Shooting Stars ─────────────────────────────────────────────
    const shootingStars: ShootingStar[] = []

    function createShootingStar(): ShootingStar {
      const startX = Math.random() * width * 0.8
      const startY = Math.random() * height * 0.4
      return {
        x: startX,
        y: startY,
        length: Math.random() * 80 + 40,
        speed: Math.random() * 6 + 4,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
        opacity: 1,
        life: 0,
        maxLife: Math.random() * 60 + 40,
        trail: [],
      }
    }

    let shootingStarTimer = 0
    const shootingStarInterval = Math.random() * 120 + 80

    // ─── Large Pulsing Stars ────────────────────────────────────────
    const pulsingStars: {
      x: number
      y: number
      baseSize: number
      phase: number
      speed: number
      color: string
      rayLength: number
    }[] = []

    for (let i = 0; i < 8; i++) {
      pulsingStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseSize: Math.random() * 2.5 + 2,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.008,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        rayLength: Math.random() * 20 + 10,
      })
    }

    // ─── Animation Loop ─────────────────────────────────────────────
    let time = 0

    function animate() {
      if (!ctx || !canvas) return
      time++

      // Clear canvas with deep space gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, '#05050f')
      gradient.addColorStop(0.3, '#0a0a1a')
      gradient.addColorStop(0.5, '#0d0820')
      gradient.addColorStop(0.7, '#10081e')
      gradient.addColorStop(1, '#06060f')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // ─── Draw Nebulae ───────────────────────────────────────────
      nebulae.forEach((nebula) => {
        const pulseOpacity = nebula.opacity + Math.sin(time * 0.005 + nebula.phase) * 0.1
        const nx = nebula.x + Math.sin(time * 0.003 + nebula.phase) * 30
        const ny = nebula.y + Math.cos(time * 0.002 + nebula.phase) * 20

        const nebulaGrad = ctx.createRadialGradient(nx, ny, 0, nx, ny, nebula.radius)
        nebulaGrad.addColorStop(0, nebula.color)
        nebulaGrad.addColorStop(0.5, nebula.color.replace(/[\d.]+\)$/, `${pulseOpacity * 0.5})`))
        nebulaGrad.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = nebulaGrad
        ctx.fillRect(0, 0, width, height)
      })

      // ─── Draw Galaxy Swirl ──────────────────────────────────────
      ctx.save()
      ctx.translate(width * 0.5, height * 0.45)
      ctx.rotate(time * 0.0003)
      for (let arm = 0; arm < 3; arm++) {
        ctx.save()
        ctx.rotate((arm * Math.PI * 2) / 3)
        for (let i = 0; i < 200; i++) {
          const angle = i * 0.04
          const dist = i * 1.2
          const x = Math.cos(angle) * dist + (Math.sin(time * 0.01 + i) * 3)
          const y = Math.sin(angle) * dist * 0.6 + (Math.cos(time * 0.01 + i) * 2)
          const starOpacity = Math.max(0, 0.3 - i * 0.0012) * (0.7 + Math.sin(time * 0.02 + i * 0.1) * 0.3)
          const size = Math.max(0.3, 1.5 - i * 0.005)

          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fillStyle = i % 5 === 0
            ? `rgba(200, 180, 255, ${starOpacity})`
            : i % 7 === 0
              ? `rgba(255, 180, 200, ${starOpacity})`
              : `rgba(200, 210, 255, ${starOpacity})`
          ctx.fill()
        }
        ctx.restore()
      }
      ctx.restore()

      // ─── Draw Moon ──────────────────────────────────────────────
      const moonPulse = 1 + Math.sin(time * 0.01) * 0.03
      const mR = moon.radius * moonPulse
      const gR = moon.glowRadius * moonPulse

      // Moon glow
      const moonGlow = ctx.createRadialGradient(moon.x, moon.y, mR, moon.x, moon.y, gR)
      moonGlow.addColorStop(0, 'rgba(200, 210, 255, 0.15)')
      moonGlow.addColorStop(0.3, 'rgba(180, 190, 240, 0.08)')
      moonGlow.addColorStop(0.6, 'rgba(150, 160, 220, 0.03)')
      moonGlow.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = moonGlow
      ctx.beginPath()
      ctx.arc(moon.x, moon.y, gR, 0, Math.PI * 2)
      ctx.fill()

      // Moon body
      const moonGrad = ctx.createRadialGradient(
        moon.x - mR * 0.3, moon.y - mR * 0.3, mR * 0.1,
        moon.x, moon.y, mR
      )
      moonGrad.addColorStop(0, '#e8e0f0')
      moonGrad.addColorStop(0.4, '#d4cce0')
      moonGrad.addColorStop(0.7, '#b8b0c8')
      moonGrad.addColorStop(1, '#9088a0')
      ctx.fillStyle = moonGrad
      ctx.beginPath()
      ctx.arc(moon.x, moon.y, mR, 0, Math.PI * 2)
      ctx.fill()

      // Moon craters
      const craters = [
        { ox: -0.2, oy: -0.15, r: 0.15 },
        { ox: 0.15, oy: 0.1, r: 0.1 },
        { ox: -0.05, oy: 0.25, r: 0.08 },
        { ox: 0.25, oy: -0.2, r: 0.06 },
      ]
      craters.forEach((crater) => {
        ctx.beginPath()
        ctx.arc(
          moon.x + crater.ox * mR,
          moon.y + crater.oy * mR,
          crater.r * mR,
          0, Math.PI * 2
        )
        ctx.fillStyle = 'rgba(120, 110, 140, 0.3)'
        ctx.fill()
      })

      // ─── Draw Stars ─────────────────────────────────────────────
      stars.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase)
        const currentOpacity = star.opacity * (0.5 + twinkle * 0.5)
        const currentSize = star.size * (0.8 + twinkle * 0.2)

        // Slow drift upward
        star.y -= star.speed * 0.3
        star.x += Math.sin(time * 0.001 + star.twinklePhase) * 0.1

        // Wrap around
        if (star.y < -10) {
          star.y = height + 10
          star.x = Math.random() * width
        }
        if (star.x < -10) star.x = width + 10
        if (star.x > width + 10) star.x = -10

        // Draw star with glow
        if (currentSize > 1.5) {
          const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, currentSize * 4)
          glow.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity * 0.3})`)
          glow.addColorStop(1, 'rgba(255, 255, 255, 0)')
          ctx.fillStyle = glow
          ctx.fillRect(star.x - currentSize * 4, star.y - currentSize * 4, currentSize * 8, currentSize * 8)
        }

        ctx.beginPath()
        ctx.arc(star.x, star.y, currentSize, 0, Math.PI * 2)
        ctx.fillStyle = star.color.replace(')', `, ${currentOpacity})`).replace('rgb', 'rgba').replace('##', '#')

        // Simple approach: set globalAlpha
        ctx.globalAlpha = currentOpacity
        ctx.fillStyle = star.color
        ctx.fill()
        ctx.globalAlpha = 1
      })

      // ─── Draw Pulsing Stars (big cross-shaped) ──────────────────
      pulsingStars.forEach((ps) => {
        const pulse = Math.sin(time * ps.speed + ps.phase)
        const size = ps.baseSize * (1 + pulse * 0.4)
        const rayLen = ps.rayLength * (0.7 + pulse * 0.3)
        const opacity = 0.6 + pulse * 0.3

        ctx.save()
        ctx.translate(ps.x, ps.y)

        // Glow
        const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, rayLen * 1.5)
        glow.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.15})`)
        glow.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.fillStyle = glow
        ctx.fillRect(-rayLen * 1.5, -rayLen * 1.5, rayLen * 3, rayLen * 3)

        // Cross rays
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.4})`
        ctx.lineWidth = 0.5

        // Horizontal ray
        ctx.beginPath()
        ctx.moveTo(-rayLen, 0)
        ctx.lineTo(rayLen, 0)
        ctx.stroke()

        // Vertical ray
        ctx.beginPath()
        ctx.moveTo(0, -rayLen)
        ctx.lineTo(0, rayLen)
        ctx.stroke()

        // Diagonal rays (45 deg)
        const diagLen = rayLen * 0.6
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`
        ctx.beginPath()
        ctx.moveTo(-diagLen, -diagLen)
        ctx.lineTo(diagLen, diagLen)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(diagLen, -diagLen)
        ctx.lineTo(-diagLen, diagLen)
        ctx.stroke()

        // Core
        ctx.beginPath()
        ctx.arc(0, 0, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.fill()

        ctx.restore()
      })

      // ─── Shooting Stars ─────────────────────────────────────────
      shootingStarTimer++
      if (shootingStarTimer > shootingStarInterval + Math.random() * 60) {
        shootingStars.push(createShootingStar())
        shootingStarTimer = 0
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i]
        ss.life++
        ss.x += Math.cos(ss.angle) * ss.speed
        ss.y += Math.sin(ss.angle) * ss.speed

        // Fade out
        const lifeRatio = ss.life / ss.maxLife
        ss.opacity = lifeRatio < 0.1 ? lifeRatio * 10 : 1 - (lifeRatio - 0.1) / 0.9

        // Add trail point
        ss.trail.push({ x: ss.x, y: ss.y, opacity: ss.opacity })
        if (ss.trail.length > 20) ss.trail.shift()

        // Draw trail
        if (ss.trail.length > 1) {
          for (let t = 1; t < ss.trail.length; t++) {
            const prev = ss.trail[t - 1]
            const curr = ss.trail[t]
            const trailOpacity = (t / ss.trail.length) * ss.opacity * 0.8
            const trailWidth = (t / ss.trail.length) * 2

            ctx.beginPath()
            ctx.moveTo(prev.x, prev.y)
            ctx.lineTo(curr.x, curr.y)
            ctx.strokeStyle = `rgba(255, 255, 255, ${trailOpacity})`
            ctx.lineWidth = trailWidth
            ctx.stroke()
          }
        }

        // Draw head
        const headGlow = ctx.createRadialGradient(ss.x, ss.y, 0, ss.x, ss.y, 6)
        headGlow.addColorStop(0, `rgba(255, 255, 255, ${ss.opacity})`)
        headGlow.addColorStop(0.5, `rgba(200, 220, 255, ${ss.opacity * 0.4})`)
        headGlow.addColorStop(1, 'rgba(200, 220, 255, 0)')
        ctx.fillStyle = headGlow
        ctx.fillRect(ss.x - 6, ss.y - 6, 12, 12)

        // Remove dead shooting stars
        if (ss.life >= ss.maxLife) {
          shootingStars.splice(i, 1)
        }
      }

      // ─── Subtle Vignette ────────────────────────────────────────
      const vignette = ctx.createRadialGradient(
        width / 2, height / 2, Math.min(width, height) * 0.3,
        width / 2, height / 2, Math.max(width, height) * 0.8
      )
      vignette.addColorStop(0, 'rgba(0,0,0,0)')
      vignette.addColorStop(1, 'rgba(0,0,0,0.4)')
      ctx.fillStyle = vignette
      ctx.fillRect(0, 0, width, height)

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: '#05050f' }}
    />
  )
}
