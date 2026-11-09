# ✦ Nova Calc — Calculator, Reimagined

**Nova Calc** is a polished, keyboard-friendly React calculator by [CodeWithRoni](https://github.com/CodeWithRoni).

> Simple math. Extraordinary experience.

## Highlights

- Premium responsive interface inspired by modern productivity apps
- Dark and light modes, with saved preference
- Arithmetic: addition, subtraction, multiplication, division
- Percentage, sign toggle, square, square root, and reciprocal
- Decimal support and controlled input limits
- A searchable-in-your-mind history: see previous calculations and tap a result to reuse it
- Calculation history saved locally in your browser (up to 24 items)
- Physical keyboard support and one-tap result copying
- Safer calculator logic **without `eval()` or `Function()`**
- Friendly errors for division by zero and invalid square roots
- Honors reduced-motion preferences

## Keyboard shortcuts

| Key | Action |
|---|---|
| `0`–`9` | Enter number |
| `.` | Decimal separator |
| `+`, `-`, `*`, `/` | Arithmetic |
| `%` | Percentage |
| `Enter`, `=` | Calculate |
| `Backspace`, `Delete` | Delete last digit |
| `Escape` | Clear; closes history if open |

## Run locally

Requires Node.js compatible with Vite 7 (Node 20.19+ or 22.12+).

```bash
npm ci
npm run dev
```

For testing or a production build:

```bash
npm test
npm run lint
npm run build
```

**Stack:** React 19, Vite 7, JavaScript, CSS.

## How calculations work

Basic binary operations calculate left-to-right as in a traditional handheld calculator. For example, entering `2 + 3 × 4 =` returns `20`, not `14`. Percentage operates on the current number; for addition/subtraction it uses a percentage of the stored value (for example, `200 + 10 % =` returns `220`). No general expression parser is used.

## Privacy and data

Nova Calc performs calculations in your browser. Theme preference and recent calculation history are stored in browser `localStorage`; the app does not send calculation history to a server. Fonts may load from Google Fonts, with system fallbacks.

## Credits

Designed and developed by **Md. Amzad Hossain Roni**.

- [Portfolio](https://codewithroni.github.io/)
- [GitHub](https://github.com/CodeWithRoni)
