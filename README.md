# Stochastic Resonance demo — gain/dopamine × noise × threshold

A tiny, self-contained browser demo that shows why adding **moderate broadband noise** can **improve** detection/recall in a **nonlinear, thresholded** system — and why **lower dopaminergic gain** shifts the optimum to **higher noise**. This is a toy illustration of the **Moderate Brain Arousal (MBA)** idea applied to ADHD.

> Open `index.html` in any modern browser. No build. No dependencies.

---

## Quick start

1. Put these files in a folder:
   - `index.html` - the interactive demo
   - `style.css` - stylesheet
   - `README.md` - this file
2. Double click `index.html` or run a static server, e.g. `python -m http.server` and open <http://localhost:8000>.

You can also host this on GitHub Pages by placing `index.html` at the repository root.

---

## What you are seeing

- **Model**: a simple threshold detector with **dopaminergic gain** `g`, **threshold** `θ`, **internal noise** `σ_int`, and **external noise** `σ_ext` that couples in with strength `α`.
- **Signal path**: `x = s + n_int + α·n_ext` → `y = σ(g·x − θ)`, `σ` is a logistic.
- The plot shows **balanced accuracy** as a function of `σ_ext`. For subthreshold `s`, accuracy follows an **inverted‑U** vs noise (stochastic resonance). **Lower gain** needs **more noise** to reach the sweet spot and often peaks lower.

**Equations shown in the UI**

- Hit rate: `H = 1 − Φ((θ − g·s)/(g·σ))`
- False alarm: `F = 1 − Φ(θ/(g·σ))`
- Balanced accuracy: `0.5 · (H + (1 − F))`
- Effective noise: `σ = sqrt(σ_int^2 + (α·σ_ext)^2)`

This is a deliberately minimal, static model that illustrates intuition, not a claim about full neural dynamics.

---

## Why noise can help (intuitive theory)

- **Stochastic resonance**: in nonlinear systems with thresholds, a small amount of noise helps weak signals cross effective boundaries, improving detection. Too much noise swamps the code. Result: an **inverted‑U** performance curve.
- **Gain modulation**: dopamine is often modeled as **neural gain**. Lower dopamine → lower gain. In an SR system, lower gain **right‑shifts** the optimal noise level, which is exactly what is observed in ADHD cohorts.
- **Continuous broadband noise** works because it adds energy without structured content that would capture attention. Intermittent or meaningful sounds tend to harm performance.

For background and data, see:
- **Söderlund, Sikström (2007)**. *Listen to the noise: noise is beneficial for cognitive performance in ADHD*, *Journal of Child Psychology and Psychiatry*, 48(8), 840–847. doi:10.1111/j.1469-7610.2007.01749.x. This paper introduces the ADHD finding and links it to stochastic resonance and dopamine-modulated gain.
- **Moss, Ward, Sannita (2004)**. *Stochastic resonance and sensory information processing: a tutorial and review of applications*, *Clinical Neurophysiology*, 115, 267–281.

---

## Controls cheat sheet

- **s**: stimulus amplitude. Keep it subthreshold relative to `θ/g` to see the SR hump.
- **θ**: threshold. Higher θ makes detection harder.
- **σ_int**: internal noise floor.
- **α**: coupling from external noise to effective internal noise.
- **σ_ext,max**: x‑axis range. Widen this if your peak is off the right edge.
- **g_A, g_B**: two gains to compare (e.g., “low‑DA/ADHD” vs “control”).

Buttons:
- **Reset** restores defaults.
- **Export PNG** saves the current plot image.

---

## Repo structure

```
sr-gain-noise-demo/
├─ index.html        # the interactive demo
├─ style.css         # stylesheet: look and feel. 
├─ README.md         # this file
└─ LICENSE           # MIT License. 
```

---

## Credits

- Concept and demo code: Oskar Paulander (based on the MBA intuition and SR toy model).
- Theory and empirical grounding:
  - G. Söderlund, S. Sikström, A. Smart (2007). *Listen to the noise: noise is beneficial for cognitive performance in ADHD*, J Child Psychol Psychiatry, 48(8), 840–847. doi:10.1111/j.1469-7610.2007.01749.x.
  - Additional SR background from Moss, Ward, Sannita (2004).

If you use this in a paper, please credit the above and link back to this repository.

---

## License

MIT License