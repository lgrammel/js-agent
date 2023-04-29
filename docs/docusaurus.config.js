// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "JS Agent",
  tagline: "Build AI Agents & Apps with JavaScript & TypeScript",
  favicon: "img/favicon.ico",
  url: "https://js-agent.ai",
  baseUrl: "/",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  markdown: {
    mermaid: true,
  },

  themes: ["@docusaurus/theme-mermaid"],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "api",
          path: "docs",
          sidebarPath: require.resolve("./sidebars.js"),
          lastVersion: "current",
          onlyIncludeVersions: ["current"],
          editUrl: "https://github.com/lgrammel/js-agent/tree/main/docs/docs/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "concepts",
        path: "concepts",
        routeBasePath: "concepts",
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "tutorial",
        path: "tutorial",
        routeBasePath: "tutorial",
      },
    ],
    [
      "docusaurus-plugin-typedoc",
      {
        // typedoc options:
        entryPoints: ["../packages/agent/src/index.ts"],
        tsconfig: "../packages/agent/tsconfig.json",
        groupOrder: ["Functions", "Variables", "*"],
        excludePrivate: true,
        name: "JS Agent",
        plugin: ["typedoc-plugin-zod"],

        // docusaurus options:
        out: ".",
        sidebar: {
          categoryLabel: "API",
          collapsed: false,
          fullNames: true,
        },
      },
    ],
  ],

  scripts: [
    {
      src: "https://plausible.io/js/script.js",
      defer: true,
      "data-domain": "js-agent.ai",
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      // image: "img/docusaurus-social-card.jpg",
      navbar: {
        title: "JS Agent",
        // logo: {
        //   alt: "JS Agent Logo",
        //   src: "img/logo.svg",
        // },
        items: [
          {
            to: "/concepts/",
            label: "Concepts",
            activeBaseRegex: `/concepts/`,
            sidebarId: "concepts",
            position: "left",
          },
          {
            to: "/tutorial/wikipedia-agent",
            label: "Tutorial",
            activeBaseRegex: `/tutorial/`,
            position: "left",
          },
          {
            to: "/api/modules/",
            label: "API",
            activeBaseRegex: `/api/`,
            position: "left",
          },
          {
            href: "https://github.com/lgrammel/js-agent",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Concepts",
                to: "/concepts/",
              },
              {
                label: "Tutorial",
                to: "/tutorial/wikipedia-agent",
              },
              {
                label: "API",
                to: "/api/modules/",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Twitter",
                href: "https://twitter.com/lgrammel",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/lgrammel/js-agent",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Lars Grammel. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
