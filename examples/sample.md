# Sample Document

This is a sample Markdown file rendered by **md-to-html-view**. Open the
generated `sample-doc.html` in a browser to see the Google-Doc-style page.

## What this demonstrates

The renderer supports a focused subset of Markdown. Everything on this page is
part of that subset, so it all renders correctly.

### Text formatting

You can use **bold**, _italic_, and `inline code`. Links work too, for example
the [CommonMark spec](https://commonmark.org).

### Lists

An unordered list:

- First point
- Second point
- Third point

An ordered list:

1. Step one
2. Step two
3. Step three

### A blockquote

> Keep the source file as the single source of truth. The HTML is just a view.

### A table

| Feature     | Supported | Notes                        |
|-------------|-----------|------------------------------|
| Headings    | Yes       | `#` through `####`           |
| Tables      | Yes       | GitHub-style pipe tables     |
| Code blocks | No        | Fenced blocks are not parsed |
| Images      | No        | Not supported yet            |

---

## Not supported

Fenced code blocks, images, and nested lists are intentionally left out to keep
the renderer tiny. For anything in the supported subset, the output is fast and
deterministic.
