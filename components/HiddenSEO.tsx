import { slidesData } from "@/lib/slidesData";

export default function HiddenSEO() {
  return (
    <div className="sr-only" aria-hidden="false">
      <h1>SEO's Journey</h1>
      <p>Seo's SW R&amp;D Journey</p>
      <div role="feed" aria-label="Portfolio Slides">
        {slidesData.map((s, i) => (
          <article key={s.id} aria-label={`Slide ${i + 1}`}>
            <header>
              {s.intro && <p>{s.intro}</p>}
              {s.title && <h2>{s.title}</h2>}
            </header>
            {s.body && <p>{s.body}</p>}
            {s.paragraphs?.map((p, j) => (
              <p key={j}>{p}</p>
            ))}
            {s.bullets && (
              <ul>
                {s.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            )}
            {s.links && (
              <ul>
                {s.links.map((l, j) => (
                  <li key={j}>
                    <a href={l.url}>{l.text}</a>
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
