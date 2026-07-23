import type { HeadingStyle } from "./types"

const accent = `
article h2.hf-h2 {
  font-size: 1.45rem;
  font-weight: 700;
  color: var(--dark);
  margin: 2.2rem 0 0.8rem;
  padding: 0.5rem 0 0.5rem 1rem;
  border-left: 4px solid var(--secondary);
  background: color-mix(in srgb, var(--secondary) 8%, transparent);
  border-radius: 0 4px 4px 0;
}
article h3.hf-h3 {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--gray);
  margin: 1.5rem 0 0.6rem;
  padding: 0.2rem 0 0.2rem 0.75rem;
  border-left: 2px solid var(--tertiary);
}
article h4.hf-h4 {
  font-size: 1rem;
  font-weight: 500;
  color: color-mix(in srgb, var(--gray) 85%, transparent);
  margin: 1.1rem 0 0.4rem;
  padding: 0.1rem 0 0.1rem 1.25rem;
  border-left: 1px dotted var(--tertiary);
}
`

const minimal = `
article h2.hf-h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--secondary);
  margin: 2rem 0 0.7rem;
}
article h3.hf-h3 {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--gray);
  margin: 1.2rem 0 0.5rem;
  padding-left: 0.75em;
}
article h4.hf-h4 {
  font-size: 1rem;
  font-weight: 400;
  color: color-mix(in srgb, var(--gray) 80%, transparent);
  margin: 1rem 0 0.4rem;
  padding-left: 1.5em;
  font-style: italic;
}
`

const gradient = `
article h2.hf-h2 {
  font-size: 1.45rem;
  font-weight: 700;
  color: var(--dark);
  margin: 2.2rem 0 0.6rem;
  padding-bottom: 0.45rem;
  border-bottom: 3px solid transparent;
  border-image: linear-gradient(to right, var(--secondary), var(--tertiary) 60%, transparent) 1;
}
article h3.hf-h3 {
  font-size: 1.12rem;
  font-weight: 600;
  color: var(--secondary);
  margin: 1.5rem 0 0.5rem;
  padding-bottom: 0.2rem;
  border-bottom: 1px solid var(--tertiary);
  display: inline-block;
}
article h4.hf-h4 {
  font-size: 1rem;
  font-weight: 500;
  color: var(--gray);
  margin: 1rem 0 0.4rem;
  text-decoration: underline dotted var(--tertiary);
  text-underline-offset: 4px;
}
`

const card = `
article h2.hf-h2 {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--dark);
  margin: 2rem 0 0.8rem;
  padding: 0.6rem 1rem;
  background: var(--light);
  border: 1px solid var(--lightgray);
  border-radius: 8px;
  box-shadow: 0 2px 8px color-mix(in srgb, var(--secondary) 12%, transparent);
}
article h3.hf-h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--secondary);
  margin: 1.4rem 0 0.5rem;
  padding: 0.35rem 0.75rem;
  border-left: 3px solid var(--secondary);
  background: color-mix(in srgb, var(--lightgray) 60%, transparent);
  border-radius: 0 6px 6px 0;
}
article h4.hf-h4 {
  font-size: 1rem;
  font-weight: 500;
  color: var(--gray);
  margin: 1rem 0 0.4rem;
  padding: 0.25rem 0.5rem 0.25rem 1rem;
  border-left: 1px solid var(--tertiary);
  background: color-mix(in srgb, var(--lightgray) 30%, transparent);
}
`

const STYLES: Record<HeadingStyle, string> = {
  accent,
  minimal,
  gradient,
  card,
}

export function getStyleCss(style: HeadingStyle): string {
  return STYLES[style]
}
