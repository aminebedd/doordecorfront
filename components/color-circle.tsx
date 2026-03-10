interface ColorCircleProps {
  code: string
  secondaryCode?: string | null
  size?: number
  className?: string
}

export function ColorCircle({ code, secondaryCode, size = 32, className = "" }: ColorCircleProps) {
  const base = `rounded-full border border-border shrink-0 ${className}`

  if (secondaryCode) {
    return (
      <div
        className={base}
        style={{
          width: size,
          height: size,
          background: `linear-gradient(135deg, ${code} 50%, ${secondaryCode} 50%)`,
        }}
      />
    )
  }

  return (
    <div
      className={base}
      style={{ width: size, height: size, backgroundColor: code }}
    />
  )
}
