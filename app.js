(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');

    if (query) {
        startAnimation(query);
    } else {
        setupCreateView();
    }

    function setupCreateView() {
        const createView = document.getElementById('create-view');
        const animView = document.getElementById('animation-view');
        createView.classList.remove('hidden');
        animView.classList.add('hidden');

        const input = document.getElementById('prompt-input');
        const btn = document.getElementById('generate-btn');
        const linkResult = document.getElementById('link-result');
        const linkOutput = document.getElementById('link-output');
        const copyBtn = document.getElementById('copy-btn');
        const copyFeedback = document.getElementById('copy-feedback');

        btn.addEventListener('click', generateLink);

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                generateLink();
            }
        });

        function generateLink() {
            const prompt = input.value.trim();
            if (!prompt) {
                input.focus();
                return;
            }
            const url = `${window.location.origin}${window.location.pathname}?q=${encodeURIComponent(prompt)}`;
            linkOutput.value = url;
            linkResult.classList.remove('hidden');
            linkOutput.select();
        }

        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(linkOutput.value).then(() => {
                copyFeedback.textContent = 'Kopiert!';
                setTimeout(() => { copyFeedback.textContent = ''; }, 2000);
            }).catch(() => {
                linkOutput.select();
                document.execCommand('copy');
                copyFeedback.textContent = 'Kopiert!';
                setTimeout(() => { copyFeedback.textContent = ''; }, 2000);
            });
        });
    }

    function startAnimation(prompt) {
        const createView = document.getElementById('create-view');
        const animView = document.getElementById('animation-view');
        createView.classList.add('hidden');
        animView.classList.remove('hidden');

        const cursor = document.getElementById('fake-cursor');
        const mockInput = document.getElementById('mock-input');
        const inputWrapper = document.getElementById('input-wrapper');
        const typedText = document.getElementById('typed-text');
        const inputCursor = document.getElementById('input-cursor');
        const placeholderText = document.getElementById('placeholder-text');
        const sendBtn = document.getElementById('mock-send-btn');
        const overlay = document.getElementById('redirect-overlay');

        // Step 1: Wait, then move cursor to input field
        setTimeout(() => {
            const inputRect = mockInput.getBoundingClientRect();
            const targetX = inputRect.left + 30;
            const targetY = inputRect.top + inputRect.height / 2;

            cursor.classList.add('moving');
            cursor.style.top = targetY + 'px';
            cursor.style.left = targetX + 'px';

            // Step 2: Click in input field
            setTimeout(() => {
                cursor.classList.add('clicking');
                inputWrapper.classList.add('active');
                placeholderText.classList.add('hidden');
                inputCursor.classList.remove('hidden');

                setTimeout(() => {
                    cursor.classList.remove('clicking');
                }, 150);

                // Step 3: Typewriter effect
                setTimeout(() => {
                    typeText(prompt, typedText, () => {
                        // Step 4: Move cursor to send button
                        setTimeout(() => {
                            sendBtn.classList.add('active');

                            const sendRect = sendBtn.getBoundingClientRect();
                            const sendX = sendRect.left + sendRect.width / 2 - 5;
                            const sendY = sendRect.top + sendRect.height / 2 - 5;

                            cursor.style.top = sendY + 'px';
                            cursor.style.left = sendX + 'px';

                            // Step 5: Click send
                            setTimeout(() => {
                                cursor.classList.add('clicking');
                                inputCursor.classList.add('hidden');

                                setTimeout(() => {
                                    cursor.classList.remove('clicking');
                                    cursor.style.display = 'none';
                                }, 150);

                                // Step 6: Show overlay and redirect
                                setTimeout(() => {
                                    overlay.classList.remove('hidden');
                                    requestAnimationFrame(() => {
                                        overlay.classList.add('visible');
                                    });

                                    setTimeout(() => {
                                        window.location.href = `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;
                                    }, 2500);
                                }, 400);
                            }, 900);
                        }, 350);
                    });
                }, 350);
            }, 1000);
        }, 700);
    }

    function typeText(text, element, callback) {
        let i = 0;
        const speed = Math.max(30, Math.min(65, 2000 / text.length));

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed + (Math.random() * 25 - 12));
            } else if (callback) {
                callback();
            }
        }

        type();
    }
})();
