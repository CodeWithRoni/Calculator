/** Pure calculator engine. No eval(), Function(), or string execution. */
export const MAX_DIGITS = 13

const MAX_HISTORY = 24
const OPS = ['+', '−', '×', '÷']

export const cleanNumber = (value) => {
  if (!Number.isFinite(value)) return 'Error'
  if (Object.is(value, -0) || value === 0) return '0'
  const rounded = Number(value.toPrecision(12))
  if (!Number.isFinite(rounded)) return 'Error'
  return String(rounded)
}

export function formatScreen(value) {
  const text = String(value || '0')
  if (text === 'Error' || /e/i.test(text)) return text
  const [integer, fractional] = text.split('.')
  const sign = integer.startsWith('-') ? '-' : ''
  const digits = integer.replace('-', '')
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return sign + grouped + (fractional === undefined ? '' : '.' + fractional)
}

export function evaluate(a, b, operator) {
  if (![a, b].every(Number.isFinite)) return 'Error'
  let value
  switch (operator) {
    case '+': value = a + b; break
    case '−': value = a - b; break
    case '×': value = a * b; break
    case '÷': value = b === 0 ? NaN : a / b; break
    default: return 'Error'
  }
  return cleanNumber(value)
}

export function createInitialState(history = []) {
  return {
    display: '0',
    stored: null,
    operator: null,
    waiting: false,
    justEvaluated: false,
    lastExpression: '',
    error: false,
    history: Array.isArray(history)
      ? history.filter((item) => item && typeof item.expression === 'string' && typeof item.result === 'string').slice(0, MAX_HISTORY)
      : [],
  }
}

const countDigits = (text) => (text.match(/\d/g) || []).length
const endError = (state, expression = '') => ({ ...state, display: 'Error', stored: null, operator: null, waiting: false, justEvaluated: true, error: true, lastExpression: expression })
const freshDisplay = (state, display) => ({ ...state, display, error: false, lastExpression: state.justEvaluated ? '' : state.lastExpression, justEvaluated: false })

export function calculatorReducer(state, action) {
  const { type, value } = action
  if (type === 'CLEAR') return { ...createInitialState(state.history) }
  if (type === 'CLEAR_HISTORY') return { ...state, history: [] }
  if (type === 'RECALL') {
    if (typeof value !== 'string' || !Number.isFinite(Number(value))) return state
    return { ...createInitialState(state.history), display: value, lastExpression: 'From history' }
  }
  if (type === 'DIGIT') {
    if (!/^\d$/.test(value)) return state
    if (state.waiting || state.justEvaluated || state.error) return { ...freshDisplay(state, value), waiting: false, lastExpression: state.justEvaluated ? '' : state.lastExpression }
    if (countDigits(state.display) >= MAX_DIGITS) return state
    return freshDisplay(state, state.display === '0' ? value : state.display === '-0' ? '-' + value : state.display + value)
  }
  if (type === 'DECIMAL') {
    if (state.waiting || state.justEvaluated || state.error) return { ...freshDisplay(state, '0.'), waiting: false, lastExpression: state.justEvaluated ? '' : state.lastExpression }
    if (state.display.includes('.') || /e/i.test(state.display)) return state
    return freshDisplay(state, state.display + '.')
  }
  if (type === 'BACKSPACE') {
    if (state.error || state.justEvaluated) return { ...createInitialState(state.history) }
    if (state.waiting) return { ...state, stored: null, operator: null, waiting: false }
    const updated = state.display.slice(0, -1)
    return { ...state, display: !updated || updated === '-' ? '0' : updated }
  }
  if (type === 'NEGATE') {
    if (state.error) return state
    if (Number(state.display) === 0) return state
    return { ...state, display: state.display.startsWith('-') ? state.display.slice(1) : '-' + state.display, justEvaluated: false }
  }
  if (type === 'PERCENT') {
    if (state.error) return state
    let n = Number(state.display) / 100
    if (state.operator && state.stored !== null && !state.waiting && ['+', '−'].includes(state.operator)) n *= state.stored
    const result = cleanNumber(n)
    if (result === 'Error') return endError(state)
    return { ...state, display: result, justEvaluated: false }
  }
  if (type === 'UNARY') {
    if (state.error) return state
    const n = Number(state.display)
    let result, sign
    if (value === 'square') { result = n * n; sign = `sqr(${state.display})` }
    else if (value === 'sqrt') { result = Math.sqrt(n); sign = `√(${state.display})` }
    else if (value === 'inverse') { result = n === 0 ? NaN : 1 / n; sign = `1/(${state.display})` }
    else return state
    const text = cleanNumber(result)
    if (text === 'Error') return endError(state, sign)
    const history = state.operator ? state.history : [{ expression: sign, result: text }, ...state.history].slice(0, MAX_HISTORY)
    return { ...state, display: text, history, lastExpression: sign, justEvaluated: false, waiting: false }
  }
  if (type === 'OPERATOR') {
    if (!OPS.includes(value) || state.error) return state
    if (state.operator && !state.waiting && state.stored !== null) {
      const next = evaluate(state.stored, Number(state.display), state.operator)
      if (next === 'Error') return endError(state)
      return { ...state, display: next, stored: Number(next), operator: value, waiting: true, justEvaluated: false, lastExpression: '' }
    }
    return { ...state, stored: Number(state.display), operator: value, waiting: true, justEvaluated: false, lastExpression: '' }
  }
  if (type === 'EQUALS') {
    if (!state.operator || state.stored === null || state.error) return state
    const b = state.waiting ? state.stored : Number(state.display)
    const expr = `${cleanNumber(state.stored)} ${state.operator} ${cleanNumber(b)} =`
    const result = evaluate(state.stored, b, state.operator)
    if (result === 'Error') return endError(state, expr)
    return {
      ...state,
      display: result,
      stored: null,
      operator: null,
      waiting: false,
      justEvaluated: true,
      lastExpression: expr,
      history: [{ expression: expr, result }, ...state.history].slice(0, MAX_HISTORY),
    }
  }
  return state
}
