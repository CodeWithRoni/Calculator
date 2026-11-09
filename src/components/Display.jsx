import { formatScreen } from '../lib/calculator.js'

export default function Display({ display, expression, error, waiting, onCopy, copied }) {
  const displayText = formatScreen(display)
  return (
    <div className="calc-display">
      <div className="display-meta"><span>CALCULATION</span><button type="button" className="copy-button" aria-label={copied ? 'Result copied' : 'Copy result'} title="Copy result" onClick={onCopy} disabled={error}><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg> <span>{copied ? 'Copied!' : 'Copy'}</span></button></div>
      <div className="calc-expression" aria-label="Current expression">{expression || 'Ready when you are'}</div>
      <div className={'calc-result' + (error ? ' display-error' : '') + (displayText.length > 13 ? ' result-small' : '')} aria-live="polite" aria-atomic="true">{displayText}</div>
      <div className="display-baseline"><span className="baseline-dot" /> {error ? 'CHECK YOUR INPUT' : waiting ? 'ENTER NEXT NUMBER' : 'PRECISION MODE'} <span className="baseline-lines">≋ ≋ ≋</span></div>
    </div>
  )
}
