import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import tabBlocks from "docusaurus-remark-plugin-tab-blocks";

const config: Config = {
    title: 'dot and box',
    tagline: 'Simple animations made easy',
    favicon: 'img/favicon.ico',

    // Set the production url of your site here
    url: 'https://dot-and-box.org',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/dot-and-box',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'dot-and-box',
    projectName: 'dot-and-box',

    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    scripts: [
         'https://dot-and-box.github.io/dot-and-box/dot-and-box.js'
        //'./dot-and-box.js'
    ],
    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    presets: [
        [
            'classic',
            {
                docs: {
                    sidebarPath: './sidebars.ts',
                    routeBasePath: '/',
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl:
                        'https://github.com/dot-and-box/dot-and-box/tree/main/docs',
                    remarkPlugins: [
                        [
                            tabBlocks,
                            // optional plugin configuration
                            {
                                labels: [
                                    ["dabl", "DABL"],
                                    ["html", "HTML"],
                                    ["view", "VIEW"],
                                ],
                            },
                        ],
                    ],
                },
                blog: false,
                theme: {
                    customCss: './src/css/custom.css',
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        // Replace with your project's social card
        image: 'img/docusaurus-social-card.jpg',
        navbar: {
            title: 'dot and box',
            logo: {
                alt: 'dot and box logo',
                src: 'img/logo.svg',
            },
            items: [
                {
                    href: 'https://github.com/dot-and-box/dot-and-box',
                    label: 'GitHub',
                    position: 'right',
                },

            ],
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'Docs',
                    items: [
                        {
                            label: 'Tutorial',
                            to: 'category/tutorial',
                        },
                        {
                            label: 'Controls',
                            to: 'category/controls',
                        },
                        {
                            label: 'Actions',
                            to: 'category/actions',
                        },
                    ],
                },
                {
                    title: 'More',
                    items: [
                        {
                            label: 'Github',
                            to: 'https://github.com/dot-and-box/dot-and-box',
                        },
                        {
                            label: 'Live Editor',
                            to: 'https://dot-and-box.github.io/dot-and-box-editor',
                        }
                    ],
                }

            ],
            copyright: `Copyright © ${new Date().getFullYear()} dot and box, Built with Docusaurus.`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
            additionalLanguages: ['dabl'],

        },
    } satisfies Preset.ThemeConfig,
};

export default config;
