import { useEffect, useReducer, useState } from 'react'
import CalculatorButton from './CalculatorButton.jsx'
import Display from './Display.jsx'
import { calculatorReducer, createInitialState, formatScreen } from '../lib/calculator.js'

const keys = [
  { label: 'AC', kind: 'utility', action: 'CLEAR', ariaLabel: 'All clear' },
  { label: 'DEL', kind: 'utility', action: 'BACKSPACE', ariaLabel: 'Delete last digit' },
  { label: '%', kind: 'utility', action: 'PERCENT', ariaLabel: 'Percentage' },
  { label: '÷', kind: 'op', action: 'OPERATOR', value: '÷', ariaLabel: 'Divide' },
  { label: '7', action: 'DIGIT', value: '7' },
  { label: '8', action: 'DIGIT', value: '8' },
  { label: '9', action: 'DIGIT', value: '9' },
  { label: '×', kind: 'op', action: 'OPERATOR', value: '×', ariaLabel: 'Multiply' },
  { label: '4', action: 'DIGIT', value: '4' },
  { label: '5', action: 'DIGIT', value: '5' },
  { label: '6', action: 'DIGIT', value: '6' },
  { label: '−', kind: 'op', action: 'OPERATOR', value: '−', ariaLabel: 'Subtract' },
  { label: '1', action: 'DIGIT', value: '1' },
  { label: '2', action: 'DIGIT', value: '2' },
  { label: '3', action: 'DIGIT', value: '3' },
  { label: '+', kind: 'op', action: 'OPERATOR', value: '+', ariaLabel: 'Add' },
  { label: '±', kind: 'utility', action: 'NEGATE', ariaLabel: 'Change sign' },
  { label: '0', action: 'DIGIT', value: '0' },
  { label: '.', action: 'DECIMAL', ariaLabel: 'Decimal point' },
  { label: '=', kind: 'equals', action: 'EQUALS', ariaLabel: 'Equals' },
]

function loadInitialState() {
  try { return createInitialState(JSON.parse(window.localStorage.getItem('nova-calc-history') || '[]')) }
  catch { return createInitialState() }
}

export default function CalculatorCard() {
  const [state, dispatch] = useReducer(calculatorReducer, undefined, loadInitialState)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    try { window.localStorage.setItem('nova-calc-history', JSON.stringify(state.history)) } catch { /* browser storage may be disabled */ }
  }, [state.history])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.target?.closest('input, textarea, [contenteditable="true"]')) return
      const key = event.key
      let action
      if (/^[0-9]$/.test(key)) action = { type: 'DIGIT', value: key }
      else if (key === '.') action = { type: 'DECIMAL' }
      else if (key === '+') action = { type: 'OPERATOR', value: '+' }
      else if (key === '-') action = { type: 'OPERATOR', value: '−' }
      else if (key === '*') action = { type: 'OPERATOR', value: '×' }
      else if (key === '/') action = { type: 'OPERATOR', value: '÷' }
      else if (key === '%') action = { type: 'PERCENT' }
      else if (key === 'Enter' || key === '=') action = { type: 'EQUALS' }
      else if (key === 'Escape') { if (historyOpen) { setHistoryOpen(false); event.preventDefault(); return } action = { type: 'CLEAR' } }
      else if (key === 'Backspace' || key === 'Delete') action = { type: 'BACKSPACE' }
      if (action) { event.preventDefault(); setCopied(false); dispatch(action) }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [historyOpen])

  function pressKey(key) {
    setCopied(false)
    dispatch({ type: key.action, value: key.value })
  }

  async function copyResult() {
    try {
      await navigator.clipboard.writeText(state.display)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  const expression = state.operator && state.stored !== null
    ? `${formatScreen(String(state.stored))} ${state.operator}${state.waiting ? '' : ' ' + formatScreen(state.display)}`
    : state.lastExpression

  return (
    <section className="calculator" aria-label="Nova calculator">
      <div className="calc-header"><div className="calc-identity"><span className="calc-logomark"><span>+</span><span>×</span></span><span><strong>NOVA<span className="calc-identity-dot">.</span></strong><small>YOUR SMART CALCULATOR</small></span></div><button className={'history-toggle' + (historyOpen ? ' history-toggle-on' : '')} type="button" aria-label={historyOpen ? 'Close calculation history' : 'Open calculation history'} aria-expanded={historyOpen} onClick={() => setHistoryOpen((value) => !value)}><svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5m4-1v5l4 2"/></svg><span>History</span></button></div>
      <div className="calc-inner">
        <Display display={state.display} expression={expression} error={state.error} waiting={state.waiting} onCopy={copyResult} copied={copied} />
        <div className="function-row" role="group" aria-label="Extra math functions"><span className="function-caption">QUICK TOOLS</span><button type="button" onClick={() => dispatch({ type: 'UNARY', value: 'square' })} aria-label="Square current number">x²</button><button type="button" onClick={() => dispatch({ type: 'UNARY', value: 'sqrt' })} aria-label="Square root">√x</button><button type="button" onClick={() => dispatch({ type: 'UNARY', value: 'inverse' })} aria-label="Reciprocal">1/x</button></div>
        <div className="keypad" role="group" aria-label="Calculator keypad">{keys.map((key) => <CalculatorButton key={key.label} item={key} active={key.kind === 'op' && state.operator === key.value && state.waiting} onPress={pressKey} />)}</div>
        <div className="keyboard-hint"><span><span className="hint-dot"/> KEYBOARD READY</span><span>ESC <b>•</b> ENTER <b>•</b> BACKSPACE</span></div>
      </div>
      {historyOpen && <div className="history-panel" role="region" aria-label="Calculation history"><div className="history-panel-title"><div><span className="history-eyebrow">YOUR RECENT CALCULATIONS</span><h3>History</h3></div><button aria-label="Close history" className="history-close" onClick={() => setHistoryOpen(false)} type="button">×</button></div>{state.history.length ? <><div className="history-list">{state.history.map((item, index) => <button type="button" key={index + item.expression + item.result} className="history-item" onClick={() => { dispatch({ type: 'RECALL', value: item.result }); setHistoryOpen(false) }}><span>{item.expression}</span><strong>{formatScreen(item.result)} <span>↗</span></strong></button>)}</div><button type="button" className="clear-history" onClick={() => dispatch({ type: 'CLEAR_HISTORY' })}>Clear history</button></> : <div className="history-empty"><span>◌</span><strong>Nothing here yet</strong><p>Your calculations will show up here as you work.</p></div>}</div>}
    </section>
  )
}
