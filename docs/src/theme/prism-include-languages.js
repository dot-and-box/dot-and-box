import siteConfig from '@generated/docusaurus.config';
export default function prismIncludeLanguages(PrismObject) {
    const {
        themeConfig: { prism },
    } = siteConfig;
    const { additionalLanguages } = prism;
    // Prism components work on the Prism instance on the window, while prism-
    // react-renderer uses its own Prism instance. We temporarily mount the
    // instance onto window, import components to enhance it, then remove it to
    // avoid polluting global namespace.
    // You can mutate PrismObject: registering plugins, deleting languages... As
    // long as you don't re-assign it
    globalThis.Prism = PrismObject;
    additionalLanguages.forEach((lang) => {
        if (lang === 'php') {
            // eslint-disable-next-line global-require
            require('prismjs/components/prism-markup-templating.js');
        }
        if (lang === 'dabl') {
            Prism.languages.dabl = {
                'comment': [
                    {
                        pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
                        lookbehind: true,
                        greedy: true
                    },
                    {
                        pattern: /(^|[^\\:])\/\/.*/,
                        lookbehind: true,
                        greedy: true
                    }
                ],
                'string': {
                    pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
                    greedy: true
                },
                'class-name': {
                    pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
                    lookbehind: true,
                    inside: {
                        'punctuation': /[.\\]/
                    }
                },
                'keyword': /\b(?:id|ids|at|text|step|title|box|dot|line|dots|boxes|layout|duration|size|color|selected|camera|visible|span|colors)\b/,
                'boolean': /\b(?:false|true)\b/,
                'function': /\b\w+(?=\()/,
                'number': /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
                'operator': /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
                'punctuation': /[{}[\];(),.:]/
            };
        } else {
            // eslint-disable-next-line global-require, import/no-dynamic-require
            require(`prismjs/components/prism-${lang}`);
        }

    });
    delete globalThis.Prism;
}
