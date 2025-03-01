import lumeCMS from "lume/cms/mod.ts";
import { Field } from "lume/cms/types.ts";
import GitHub from "lume/cms/storage/github.ts";
import { Octokit } from "npm:octokit";
import { Creds } from "./creds.ts";

const cms = lumeCMS();

cms.auth(Creds.auth);

const client = new Octokit({
  auth: Creds.github,
});

cms.storage(
  "gh",
  new GitHub({
    client,
    owner: "UvixCreative",
    repo: "cqec-site",
    branch: "master",
  }),
);

const url: Field = {
  name: "url",
  type: "text",
  description: "The public URL of the page. Leave empty to use the file path.",
  transform(value) {
    if (!value) {
      return;
    }

    if (!value.endsWith("/")) {
      value += "/";
    }
    if (!value.startsWith("/")) {
      value = "/" + value;
    }

    return value;
  },
};

cms.document(
  "Home data: Links and about on the homepage",
  "gh:_data/home.yml",
  [
    {
      name: "importantlinks",
      type: "object-list",
      description: "Links to highlight in the 'important links' section",
      fields: [
        "title:text",
	"url:text",
      ]
    },
    {
      name: "socials",
      type: "object-list",
      description: "Social links/icons directly under the welcome",
      fields: [
        "url:url",
	"img:text",
      ],
    },
  ]
);

cms.document(
  "settings: Global settings for the site",
  "gh:_data.yml",
  [
    {
      name: "lang",
      type: "text",
      label: "Language",
    },
    {
      name: "home",
      type: "object",
      fields: [
        {
          name: "welcome",
          type: "text",
          label: "Title",
          description: "Welcome message in the homepage",
        },
      ],
    },
    {
      name: "menu_links",
      type: "object-list",
      fields: [
        {
          name: "title",
          type: "text",
          label: "Title",
        },
        {
          name: "url",
          type: "text",
          label: "URL",
        },
      ],
    },
    {
      name: "extra_head",
      type: "code",
      description: "Extra content to include in the <head> tag",
    },
    {
      name: "metas",
      type: "object",
      description: "Meta tags configuration.",
      fields: [
        "site: text",
        "description: text",
        "title: text",
        "image: text",
        "twitter: text",
        "lang: text",
        "generator: checkbox",
      ],
    },
  ],
);

cms.collection(
  "Staging posts: Blog posts",
  "src:blog/*.md",
  [
    "title: text",
    url,
    {
      name: "author",
      type: "text",
      init(field, { data }) {
        field.options = data.site?.search.values("author");
      },
    },
    "date: date",
    {
      name: "draft",
      label: "Draft",
      type: "checkbox",
      description: "If checked, the post will not be published.",
    },
    {
      name: "tags",
      type: "list",
      label: "Tags",
      init(field, { data }) {
        field.options = data.site?.search.values("tags");
      },
    },
    {
      name: "comments",
      type: "object",
      fields: [
        {
          name: "src",
          label: "Link to Mastodon post",
          type: "url",
        },
        {
          name: "bluesky",
          label: "Link to Bluesky post",
          type: "url",
        },
      ],
    },
    {
      name: "extra_head",
      type: "code",
      description: "Extra content to include in the <head> tag",
    },
    {
      name: "content",
      type: "markdown",
      label: "Content",
    },
  ],
);

cms.collection(
  "Staging Pages: Additional pages, like about, contact, etc.",
  "src:pages/*.md",
  [
    {
      name: "layout",
      type: "hidden",
      value: "layouts/page.vto",
    },
    {
      name: "title",
      type: "text",
      label: "Title",
    },
    url,
    {
      name: "menu",
      type: "object",
      label: "Whether to include in the menu",
      fields: [
        {
          name: "visible",
          type: "checkbox",
          label: "Show in menu",
        },
        {
          name: "order",
          type: "number",
          label: "Order",
        },
	{
	  name: "title",
	  type: "text",
	},
      ],
    },
    {
      name: "sitemap",
      type: "object",
      label: "Whether to include in the sitemap (footer)",
      fields: [
        {
          name: "visible",
          type: "checkbox",
          label: "Show in sitemap",
        },
        {
          name: "order",
          type: "number",
          label: "Order",
        },
	{
	  name: "title",
	  type: "text",
	},
      ],
    },
    {
      name: "extra_head",
      type: "code",
      description: "Extra content to include in the <head> tag",
    },
    {
      name: "content",
      type: "markdown",
      label: "Content",
    },
  ],
);

cms.upload("Staging Uploads: Uploaded files", "src:uploads");

cms.collection(
  "PRODUCTION Posts: Blog posts",
  "gh:blog/*.md",
  [
    "title: text",
    url,
    {
      name: "author",
      type: "text",
      init(field, { data }) {
        field.options = data.site?.search.values("author");
      },
    },
    "date: date",
    {
      name: "draft",
      label: "Draft",
      type: "checkbox",
      description: "If checked, the post will not be published.",
    },
    {
      name: "tags",
      type: "list",
      label: "Tags",
      init(field, { data }) {
        field.options = data.site?.search.values("tags");
      },
    },
    {
      name: "comments",
      type: "object",
      fields: [
        {
          name: "src",
          label: "Link to Mastodon post",
          type: "url",
        },
        {
          name: "bluesky",
          label: "Link to Bluesky post",
          type: "url",
        },
      ],
    },
    {
      name: "extra_head",
      type: "code",
      description: "Extra content to include in the <head> tag",
    },
    {
      name: "content",
      type: "markdown",
      label: "Content",
    },
  ],
);

cms.collection(
  "PRODUCTION pages: Additional pages, like about, contact, etc.",
  "gh:pages/*.md",
  [
    {
      name: "layout",
      type: "hidden",
      value: "layouts/page.vto",
    },
    {
      name: "title",
      type: "text",
      label: "Title",
    },
    url,
    {
      name: "menu",
      type: "object",
      label: "Whether to include in the menu",
      fields: [
        {
          name: "visible",
          type: "checkbox",
          label: "Show in menu",
        },
        {
          name: "order",
          type: "number",
          label: "Order",
        },
      ],
    },
    {
      name: "extra_head",
      type: "code",
      description: "Extra content to include in the <head> tag",
    },
    {
      name: "content",
      type: "markdown",
      label: "Content",
    },
  ],
);

cms.upload("PRODUCTION Uploads: Uploaded files", "gh:uploads");

export default cms;
