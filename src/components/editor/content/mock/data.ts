export const defaultState = [
  {
    name: "heading",
    meta: {
      level: 1,
    },
    text: "Inline Format",
  },
  {
    name: "paragraph",
    children: [
      {
        name: "strong",
        text: "strong",
      },
      {
        name: "plain",
        text: " ",
      },
      {
        name: "em",
        text: "emphasis",
      },
      {
        name: "plain",
        text: " ",
      },
      {
        name: "code",
        text: "inline code",
      },
      {
        name: "plain",
        text: " &gt; ",
      },
      {
        name: "underline",
        text: "underline",
      },
      {
        name: "plain",
        text: " ",
      },
      {
        name: "mark",
        text: "highlight",
      },
      {
        name: "plain",
        text: " ",
      },
      {
        name: "link",
        text: "Baidu",
        url: "http://www.baidu.com",
      },
      {
        name: "plain",
        text: " H0~2~ X^5^",
      },
    ],
  },
  {
    name: "paragraph",
    children: [
      {
        name: "plain",
        text: ":man:  ~~del~~ http://google.com $a \\ne b$",
      },
    ],
  },
];