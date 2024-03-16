import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import tabBlocks from "docusaurus-remark-plugin-tab-blocks";

const config: Config = {
    title: 'Dots and boxes',
    tagline: 'Simple animations made easy',
    favicon: 'img/favicon.ico',

    // Set the production url of your site here
    url: 'https://your-docusaurus-site.example.com',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/dots',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'tomaszkubacki', // Usually your GitHub org/user name.
    projectName: 'dotsandboxes', // Usually your repo name.

    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    scripts: [
        './dots-and-boxes.js'
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
                        'https://github.com/tomaszkubacki/dots_and_boxes/tree/main/docs',
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
            title: 'Dots and boxes',
            logo: {
                alt: 'Dots and boxes logo',
                src: 'img/logo.svg',
            },
            items: [
                {
                    href: 'https://github.com/tomaszkubacki/dots_and_boxes',
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
                    ],
                },
                {
                    title: 'More',
                    items: [
                        {
                            label: 'Github',
                            to: 'https://github.com/tomaszkubacki/dots_and_boxes',
                        },
                        {
                            label: 'My Twitter',
                            to: 'https://twitter.com/tomaszkubacki',
                        },
                    ],
                }
            ],
            copyright: `Copyright © ${new Date().getFullYear()} Dots and Boxes, Built with Docusaurus.`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
            additionalLanguages: ['dabl'],

        },
    } satisfies Preset.ThemeConfig,
};

export default config;
