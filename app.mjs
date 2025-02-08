export const templates = [
    {
        name: "Newsletter Quote",
        html: `
            <article style="
                max-width: 680px;
                margin: 2rem auto;
                padding: 2.5rem;
                background: linear-gradient(to right bottom, #ffffff, #f8f9fa);
                border-radius: 12px;
                box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
                font-family: system-ui, -apple-system, sans-serif;">
                
                <blockquote style="
                    margin: 0;
                    padding-left: 1.5rem;
                    border-left: 4px solid #1095c1;">
                    
                    <p style="
                        font-size: 1.25rem;
                        line-height: 1.75;
                        color: #374151;
                        margin: 0 0 1.5rem 0;
                        font-family: 'Georgia', serif;">
                        "{{quote}}"
                    </p>
                    
                    <footer style="
                        color: #4b5563;
                        font-size: 1rem;">
                        <strong style="
                            display: block;
                            margin-bottom: 0.25rem;
                            color: #111827;">
                            — {{author}}
                        </strong>
                        <cite style="
                            font-style: italic;
                            opacity: 0.8;
                            font-size: 0.9em;">
                            {{source}}
                        </cite>
                    </footer>
                </blockquote>
            </article>
        `
    }
]; 