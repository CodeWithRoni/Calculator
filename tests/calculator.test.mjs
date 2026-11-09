import test from 'node:test'
import assert from 'node:assert/strict'
import { calculatorReducer, createInitialState, cleanNumber, evaluate, formatScreen } from '../src/lib/calculator.js'

function press(...actions) {
  return actions.reduce((state, action) => calculatorReducer(state, typeof action === 'string' ? { type: action } : action), createInitialState())
}
const digit = (value) => ({ type: 'DIGIT', value })
const op = (value) => ({ type: 'OPERATOR', value })

// Pure math and precision
test('safe operations, division by zero, normal precision', () => {
  assert.equal(evaluate(0.1, 0.2, '+'), '0.3')
  assert.equal(evaluate(5, 0, '÷'), 'Error')
  assert.equal(evaluate(8, 2, '÷'), '4')
  assert.equal(evaluate(5, 3, '−'), '2')
  assert.equal(evaluate(6, 3, '×'), '18')
  assert.equal(evaluate(1, 2, 'unexpected'), 'Error')
  assert.equal(cleanNumber(-0), '0')
  assert.equal(formatScreen('-1000000.45'), '-1,000,000.45')
  assert.equal(formatScreen('0.'), '0.')
})

test('input decimal and equals with history', () => {
  const s = press(digit('1'), { type: 'DECIMAL' }, digit('2'), op('+'), digit('3'), { type: 'EQUALS' })
  assert.equal(s.display, '4.2')
  assert.deepEqual(s.history[0], { expression: '1.2 + 3 =', result: '4.2' })
})

test('negative numbers and backspace', () => {
  const s = press(digit('7'), { type: 'NEGATE' }, { type: 'BACKSPACE' })
  assert.equal(s.display, '0')
  const r = press(digit('8'), op('+'), { type: 'BACKSPACE' })
  assert.equal(r.operator, null)
  assert.equal(r.display, '8')
})

test('percentage of first operand for plus/minus', () => {
  const s = press(digit('2'), digit('0'), digit('0'), op('+'), digit('1'), digit('0'), { type: 'PERCENT' }, { type: 'EQUALS' })
  assert.equal(s.display, '220')
})

test('unary operations', () => {
  const sq = press(digit('9'), { type: 'UNARY', value: 'sqrt' })
  assert.equal(sq.display, '3')
  const bad = press(digit('0'), { type: 'UNARY', value: 'inverse' })
  assert.equal(bad.display, 'Error')
  assert.equal(calculatorReducer(bad, digit('5')).display, '5')
})

test('history recall and clear history', () => {
  const s = press(digit('9'), op('×'), digit('8'), { type: 'EQUALS' })
  assert.equal(s.display, '72')
  const r = calculatorReducer(s, { type: 'RECALL', value: '72' })
  assert.equal(r.display, '72')
  assert.equal(calculatorReducer(r, { type: 'CLEAR_HISTORY' }).history.length, 0)
})
