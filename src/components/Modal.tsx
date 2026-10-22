import { useState, useEffect, useCallback, useRef } from 'react'

type ModalProps = {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  /** Close when clicking the backdrop */
  closeOnBackdrop?: boolean
  /** Close with Escape key — default `true` */
  closeOnEscape?: boolean
  /** `aria-labelledby` value */
  labelledById?: string
  /** className applied to the inner panel */
  panelClassName?: string
}

/**
 * Accessible modal dialog:
 *  – traps tab-focus inside the panel
 *  – closes on Escape
 *  – returns focus to the previously-focused element on close
 *  – sets inert/aria-hidden on the rest of the page while open
 */
export default function Modal({
  open,
  onClose,
  title,
  children,
  closeOnBackdrop = true,
  closeOnEscape = true,
  labelledById,
  panelClassName,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)

  /* Remember currently focused element so we can restore it on close */
  useEffect(() => {
    if (open) previousFocus.current = document.activeElement as HTMLElement
  }, [open])

  /* Escape → close */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') onClose()
    },
    [closeOnEscape, onClose],
  )

  useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', handleKeyDown)
    /* Mark page background as inert so screen readers skip it */
    document.body.setAttribute('inert', '')
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.removeAttribute('inert')
      document.body.style.overflow = ''
      /* Return focus to the element that opened the modal */
      previousFocus.current?.focus()
    }
  }, [open, handleKeyDown])

  /* Focus trap: keep tab order inside panel */
  useEffect(() => {
    if (!open || !panelRef.current) return
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    const onTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }

    panelRef.current.addEventListener('keydown', onTab)
    first?.focus()
    return () => panelRef.current?.removeEventListener('keydown', onTab)
  }, [open])

  if (!open) return null

  return (
    <div
      role="presentation"
      onClick={closeOnBackdrop ? onClose : undefined}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, padding: '16px',
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        {...(labelledById ? { 'aria-labelledby': labelledById } : {})}
        onClick={e => e.stopPropagation()}
        className={panelClassName}
        style={{
          background: '#fff', borderRadius: '12px', maxWidth: '420px', width: '100%',
          textAlign: 'center', outline: 'none',
        }}
      >
        {children}
      </div>
    </div>
  )
}
