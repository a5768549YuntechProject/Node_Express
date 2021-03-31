(function() {
    /** @type {Record<string, Page>} */
    const pages = {};

    /** @type {string} */
    const route = document.documentElement.getAttribute('data-route');

    /** @type {DOMParser} */
    const domParser = new DOMParser();

    /** @type {string} */
    const url = location.origin + location.pathname;

    /** @type {string} */
    const baseUrl = url.substr(0, url.length - route.length);

    /** @type {number} */
    let lastTimerId = /** @type {any} */ (setTimeout(null));

    /**
     * 元素並非靜態
     * @param {Node|HTMLElement} node
     * @returns {boolean}
     */
    const isElementDynamic = (node) =>
        node instanceof HTMLElement && !node.hasAttribute('data-static');

    /**
     * 元素並非腳本
     * @param {Node|HTMLElement} node
     * @returns {boolean}
     */
    const isElementNotScript = (node) => !(node instanceof HTMLScriptElement);

    /**
     * 深層的複製元素
     * @param {Node} node
     * @returns {Node}
     */
    const cloneNodeDeeply = (node) => node.cloneNode(true);

    /**
     * 新增到特定節點
     * @param {Node} parentNode
     * @returns {(node: Node) => void}
     */
    const appendTo = (parentNode) => (node) => parentNode.appendChild(node);

    /**
     * 移除自特定節點
     * @param {Node} parentNode
     * @returns {(node: Node) => void}
     */
    const removeFrom = (parentNode) => (node) => parentNode.removeChild(node);

    /**
     * 解析HTML文件
     * @param {string} htmlText
     * @returns {Document}
     */
    const toDocument = (htmlText) =>
        domParser.parseFromString(htmlText, 'text/html');

    /**
     * 轉為腳本函數
     * @param {string} scriptText
     * @returns {(window: Window) => void}
     */
    const toScriptFunction = (scriptText) =>
        /** @type {(window: Window) => void} */
        (Function('window', scriptText));

    /**
     * 取得腳本文字
     * @param {HTMLScriptElement} scriptElement
     * @returns {Promise<string>}
     */
    const getScriptText = async(scriptElement) =>
        scriptElement.src ?
        (await fetch(scriptElement.src)).text() :
        scriptElement.innerText;

    /** 頁面 */
    class Page {
        /**
         * @param {Document} sourceDocument
         */
        constructor(sourceDocument) {
            /** @type {Readonly<Record<'head' | 'body', DocumentFragment>>} */
            const fragments = {
                head: document.createDocumentFragment(),
                body: document.createDocumentFragment(),
            };

            Array.from(sourceDocument.head.childNodes)
                .filter(isElementDynamic)
                .filter(isElementNotScript)
                .map(cloneNodeDeeply)
                .forEach(appendTo(fragments.head));

            Array.from(sourceDocument.body.childNodes)
                .filter(isElementDynamic)
                .filter(isElementNotScript)
                .map(cloneNodeDeeply)
                .forEach(appendTo(fragments.body));

            /** @readonly 各區塊的片段 */
            this.fragments = fragments;

            /** @type {Promise<string>[]} */
            const whenGotScriptTexts = Array.from(sourceDocument.scripts)
                .filter(isElementDynamic)
                .map(getScriptText);

            /** @readonly 所有腳本 */
            this.whenGotScriptFunction = Promise.all(whenGotScriptTexts)
                .then((scriptTexts) => scriptTexts.join('\n;\n'))
                .then(toScriptFunction);
        }

        /**
         * 顯示畫面
         */
        render() {
            const { fragments, whenGotScriptFunction } = this;
            const headFragment = fragments.head.cloneNode(true);
            const bodyFragment = fragments.body.cloneNode(true);

            const headChildNodes = Array.from(document.head.childNodes).filter(
                isElementDynamic
            );

            const bodyChildNodes = Array.from(document.body.childNodes).filter(
                isElementDynamic
            );

            document.head.appendChild(headFragment);
            document.body.appendChild(bodyFragment);

            headChildNodes.forEach(removeFrom(document.head));
            bodyChildNodes.forEach(removeFrom(document.body));

            whenGotScriptFunction.then((whenGotScriptFunction) =>
                whenGotScriptFunction.call(window, window)
            );
        }

        /**
         * 載入頁面
         * @param {string} url 頁面網址
         */
        static async load(url) {
            const response = await fetch(url);
            const htmlText = await response.text();
            const document = toDocument(htmlText);
            return new Page(document);
        }
    }

    /**
     * 切換網址
     * @param {string} url
     */
    function changeUrl(url) {
        if (location.href !== url) {
            history.pushState({}, '', url);
        }
    }

    /**
     * 切換頁面
     * @param {string} route
     */
    async function changePage(route) {
        const url = baseUrl + route;

        let timerId = lastTimerId;
        lastTimerId = setTimeout(null);

        for (; timerId < lastTimerId; timerId++) {
            clearTimeout(timerId);
        }

        if (!pages[route]) {
            const page = await Page.load(url);
            pages[route] = page;
        }

        pages[route].render();
        changeUrl(url);
    }

    /**
     * 以網址切換頁面
     * @param {string} url
     */
    function changePageByUrl(url) {
        const route = url.substr(baseUrl.length);
        changePage(route);
    }

    Object.defineProperty(window, 'route', {
        get: () => location.href.substr(baseUrl.length),
        set: changePage,
    });

    window.addEventListener('load', function() {
        const page = new Page(document);
        pages[route] = page;

        window.addEventListener('popstate', function() {
            changePageByUrl(location.href);
        });

        window.addEventListener('click', function(event) {
            /** @type {EventTarget|HTMLAnchorElement} */
            const element = event.target;

            if (element instanceof HTMLAnchorElement && element.target === '') {
                if (!event.defaultPrevented && element.href.indexOf(baseUrl) === 0) {
                    event.preventDefault();
                    changePageByUrl(element.href);
                }
            }
        });

        window.addEventListener('submit', function(event) {
            /** @type {EventTarget|HTMLFormElement} */
            const element = event.target;

            if (element instanceof HTMLFormElement && element.target === '') {
                if (!event.defaultPrevented && element.action.indexOf(baseUrl) === 0) {
                    event.preventDefault();
                    changePageByUrl(element.action);
                }
            }
        });
    });
})();