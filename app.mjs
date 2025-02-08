export const templates = [
    {
        name: "Uncertainty Quote",
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
            width: 300px;
            text-align: center;
        }
        .card {
            background: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
            transform: rotate(-5deg);
        }
        .card h1 {
            font-size: 20px;
            margin: 10px 0;
        }
        .question-mark {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 20px 0;
        }
        .footer {
            margin-top: 15px;
            font-size: 14px;
            color: white;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <h1>{{question}}</h1>
            <div class="question-mark">
                <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="80" fill="#6a5acd">?</text>
                </svg>
            </div>
        </div>
        <div class="footer">{{footer}}</div>
    </div>
</body>
</html>

`
    }
]; 