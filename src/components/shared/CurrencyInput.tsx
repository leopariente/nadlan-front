import { useState, useRef } from 'react'
import { formatCurrency, parseCurrencyInput, cn } from '@/lib/utils'

interface CurrencyInputProps {
  value: number
  onChange: (value: number) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function CurrencyInput({ value, onChange, placeholder, className, disabled }: CurrencyInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [displayValue, setDisplayValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFocus = () => {
    setIsFocused(true)
    setDisplayValue(value === 0 ? '' : String(value))
  }

  const handleBlur = () => {
    setIsFocused(false)
    const parsed = parseCurrencyInput(displayValue)
    onChange(parsed)
    setDisplayValue('')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits and decimal point
    const raw = e.target.value.replace(/[^\d.]/g, '')
    setDisplayValue(raw)
  }

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      disabled={disabled}
      className={cn('cell-input', className)}
      value={isFocused ? displayValue : (value === 0 ? '' : formatCurrency(value))}
      placeholder={placeholder ?? '0'}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
    />
  )
}
