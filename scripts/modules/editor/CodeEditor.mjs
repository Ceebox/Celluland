// Based on https://gist.github.com/zserge/03280e5efebae83cc41c78dbd7e73608
export class Editor {

    /**
     * @param {HTMLDivElement} element
     */
    constructor(element) {
        this.editor = element;
        this.textChangedCallbacks = new Set();
        this.createEditor(element);
    }

    getText() {
        const lines = [];
        for (const line of this.editor.querySelectorAll('div')) {
            if (line.childNodes.length === 1 && line.firstChild?.nodeName === 'BR') {
                lines.push('');
            } else {
                lines.push(line.textContent);
            }
        }
        return lines.join('\n');
    }

    /**
     * @param {string} text
     */
    setText(text) {
        // Clear current content
        this.editor.innerHTML = '';
        const lines = text.replace(/\r/g, '').split('\n');
        for (let lineText of lines) {
            const lineDiv = document.createElement('div');
            lineDiv.className = 'line';
            // If empty, add a <br>
            if (lineText === '') {
                lineDiv.appendChild(document.createElement('br'));
            } else {
                lineDiv.textContent = lineText;
            }
            this.editor.appendChild(lineDiv);
        }

        // Ensure at least one line
        if (this.editor.children.length === 0) {
            const lineDiv = document.createElement('div');
            lineDiv.className = 'line';
            lineDiv.appendChild(document.createElement('br'));
            this.editor.appendChild(lineDiv);
        }

        this.highlightJs(this.editor);
    }

    /**
     * @param {HTMLElement} element
     */
    highlightJs(element) {
        const keywords = new Set([
            'new', 'if', 'else', 'for', 'while', 'return', 'var', 'const', 'let'
        ]);

        const escapeHtml = (/** @type {string} */ text) => {
            return text.replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        };

        // Tokens
        const stringRegex = /^("([^\\"]|\\.)*"|'([^\\']|\\.)*'|`([^\\`]|\\.)*`)/;
        const commentRegex = /^\/\/.*/;
        const numberRegex = /^\b\d+\b/;
        const wordRegex = /^\b[a-zA-Z_]\w*\b/;

        // My time building a compiler is coming in handy! ;)
        for (const node of element.children) {
            if (node.nodeType !== 1) continue; // only element nodes

            const line = node.innerText; // raw text, not HTML
            let html = '';
            let pos = 0;

            while (pos < line.length) {
                const rest = line.slice(pos);

                // Check for comment (highest priority)
                const commentMatch = rest.match(commentRegex);
                if (commentMatch) {
                    const commentText = commentMatch[0];
                    html += `<em class="comment">${escapeHtml(commentText)}</em>`;
                    break; // Comment goes to end of line
                }

                // Check for string
                const stringMatch = rest.match(stringRegex);
                if (stringMatch) {
                    const strText = stringMatch[0];
                    html += `<span class="string">${escapeHtml(strText)}</span>`;
                    pos += strText.length;
                    continue;
                }

                // Check for keyword or number or word
                const wordMatch = rest.match(wordRegex);
                if (wordMatch) {
                    const word = wordMatch[0];
                    if (keywords.has(word)) {
                        html += `<span class="keyword">${escapeHtml(word)}</span>`;
                    } else {
                        html += escapeHtml(word);
                    }
                    pos += word.length;
                    continue;
                }

                // Check for number
                const numberMatch = rest.match(numberRegex);
                if (numberMatch) {
                    const number = numberMatch[0];
                    html += `<span class="number">${escapeHtml(number)}</span>`;
                    pos += number.length;
                    continue;
                }

                // Not a token - escape and output one character to move forward
                const ch = rest[0];
                html += escapeHtml(ch);
                pos += 1;
            }

            // Replace content and preserve empty lines with <br>
            node.innerHTML = html.length > 0 ? html : '<br>';
        }
    }

    /**
     * @param {Node} element
     */
    caret(element) {
        const range = window.getSelection()?.getRangeAt(0);
        if (!range) {
            return -1;
        }

        const prefix = range?.cloneRange();
        if (!prefix) {
            return -1;
        }

        prefix.selectNodeContents(element);
        prefix.setEnd(range.endContainer, range.endOffset);
        return prefix.toString().length;
    };

    /**
     * @param {number} pos
     * @param {{ childNodes: any; }} parent
     */
    setCaret(pos, parent) {

        if (!pos) {
            return 0;
        }

        for (const node of parent.childNodes) {
            if (node.nodeType == Node.TEXT_NODE) {
                if (node.length >= pos) {
                    const range = document.createRange();
                    const sel = window.getSelection();
                    range.setStart(node, pos);
                    range.collapse(true);
                    sel?.removeAllRanges();
                    sel?.addRange(range);
                    return -1;
                } else {
                    pos = pos - node.length;
                }
            } else {
                pos = this.setCaret(pos, node);
                if (pos < 0) {
                    return pos;
                }
            }
        }

        return pos;
    };

    /**
     * @param {Node} el
     */
    createEditor(el) {
        const tab = "    ";

        this.highlightJs(el);

        el.addEventListener("keydown", (e) => {

            // Detect Ctrl+A or Cmd+A
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {

                this.isSelectAll = true;

                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(el);
                selection?.removeAllRanges();
                selection?.addRange(range);
            }

            if (e.which === 9) {
                const pos = this.caret(el) ?? 0 + tab.length;
                const range = window.getSelection()?.getRangeAt(0);
                range?.deleteContents();
                range?.insertNode(document.createTextNode(tab));
                this.highlightJs(el);
                this.setCaret(pos, el);
            }
        });

        el.addEventListener("keyup", (e) => {
            if (this.isSelectAll) {
                this.isSelectAll = false;
                return;
            }

            if (e.keyCode >= 0x30 || e.keyCode == 0x20) {
                const pos = this.caret(el);
                this.highlightJs(el);
                this.setCaret(pos, el);
            }
        });

        el.addEventListener("input", (e) => {
            if (
                el.childNodes.length === 0 ||
                (el.childNodes.length === 1 && el.firstChild?.nodeName === 'BR')
            ) {
                el.innerHTML = "";
                const lineDiv = document.createElement("div");
                lineDiv.className = "line";
                lineDiv.appendChild(document.createElement("br"));
                el.appendChild(lineDiv);

                // Move caret into the new, empty line
                const range = document.createRange();
                range.setStart(lineDiv, 0);
                range.collapse(true);
                const sel = window.getSelection();
                sel?.removeAllRanges();
                sel?.addRange(range);
            }

            // It might not have changed, but in our case it does no harm
            for (const callback of this.textChangedCallbacks) {
                callback(this.getText());
            }
        })
    };

    /**
     * @param {any} func
     */
    onTextChanged(func) {
        if (typeof func !== "function") {
            throw new Error("onTextChanged callback is not a function.");
        }

        this.textChangedCallbacks.add(func);
    }
}