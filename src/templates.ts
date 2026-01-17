import type { Template } from './types';

export const builtInTemplates: Template[] = [
  {
    name: "Uncertainty question",
    html: `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Сколько попыток?</title>
    <style>
        body {
            font-family: 'Montserrat', sans-serif;
            background: linear-gradient(135deg, #4b0082, #6a5acd);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            color: #222;
        }
        .container {
            position: relative;
            width: 60vmin;
            text-align: center;
        }
        .card {
            background: white;
            padding: 5vmin;
            border-radius: 3vmin;
            box-shadow: 0 2vmin 4vmin rgba(0, 0, 0, 0.2);
            transform: rotate(-5deg);
            overflow-wrap: break-word;
            word-wrap: break-word;
        }
        .card h1 {
            font-size: calc(clamp(1rem, 4vw, 3rem) * var(--font-scale, 1));
            margin: 2vmin 0;
        }
        .question-mark {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 4vmin 0;
        }
        .question-mark svg {
            width: 20vmin;
            height: 20vmin;
        }
        .footer {
            margin-top: 3vmin;
            font-size: calc(clamp(0.8rem, 3vw, 2rem) * var(--font-scale, 1));
            color: white;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <h1>{{question}}</h1>
            <div class="question-mark">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="80" fill="#6a5acd">?</text>
                </svg>
            </div>
        </div>
        <div class="footer">{{footer}}</div>
    </div>
</body>
</html>
`
  },
  {
    name: "Quote",
    html: `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Цитата</title>
    <style>
        body {
            font-family: 'Montserrat', sans-serif;
            background-color: #5A4FCF;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            text-align: center;
            padding: 5vmin;
            margin: 0;
            box-sizing: border-box;
        }
        .quote-container {
            max-width: 80vw;
            background: rgba(255, 255, 255, 0.1);
            padding: 5vmin;
            border-radius: 2vmin;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            overflow-wrap: break-word;
            word-wrap: break-word;
        }
        .quote {
            font-size: calc(clamp(1.2rem, 5vw, 4rem) * var(--font-scale, 1));
            font-weight: bold;
            margin-bottom: 4vmin;
        }
        .author {
            font-size: calc(clamp(0.9rem, 3vw, 2.5rem) * var(--font-scale, 1));
            font-weight: bold;
        }
        .source {
            font-size: calc(clamp(0.8rem, 2.5vw, 2rem) * var(--font-scale, 1));
            opacity: 0.8;
        }
        .social-media-handle {
            font-size: calc(clamp(0.8rem, 2.5vw, 2rem) * var(--font-scale, 1));
            margin-top: 2vmin;
        }
    </style>
</head>
<body>
    <div class="quote-container">
        <div class="quote">"{{quote}}"</div>
        <div class="author">{{author}}</div>
        <div class="source">{{source}}</div>
        <div class="social-media-handle">{{social_media_handle}}</div>
    </div>
</body>
</html>
`
  }
];
