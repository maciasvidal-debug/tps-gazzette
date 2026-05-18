import { expect, test, describe, beforeAll, afterAll } from "bun:test";
import { sanitizeHtml } from "./sanitize";

// JSDOM-like mock for DOMParser in Bun environment
class MockNode {
  nodeType: number;
  childNodes: MockNode[] = [];
  parentNode: MockNode | null = null;
  textContent: string = "";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ownerDocument: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(nodeType: number, ownerDocument: any) {
    this.nodeType = nodeType;
    this.ownerDocument = ownerDocument;
  }

  cloneNode(deep: boolean) {
    const clone = new MockNode(this.nodeType, this.ownerDocument);
    clone.textContent = this.textContent;
    if (deep) {
      clone.childNodes = this.childNodes.map(c => {
        const childClone = c.cloneNode(true);
        childClone.parentNode = clone;
        return childClone;
      });
    }
    return clone;
  }

  appendChild(node: MockNode) {
    node.parentNode = this;
    this.childNodes.push(node);
    return node;
  }
}

class MockElement extends MockNode {
  tagName: string;
  attributes: Map<string, string> = new Map();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(tagName: string, ownerDocument: any) {
    super(1, ownerDocument); // ELEMENT_NODE
    this.tagName = tagName.toUpperCase();
  }

  setAttribute(name: string, value: string) {
    this.attributes.set(name, value);
  }

  getAttribute(name: string) {
    return this.attributes.get(name) || null;
  }

  get innerHTML(): string {
    let html = "";
    const isWrapper = this.tagName === "BODY" || this.tagName === "FRAGMENT";

    if (!isWrapper && this.tagName) {
        html += `<${this.tagName.toLowerCase()}`;
        // Sort attributes for consistent test results
        const sortedAttrNames = Array.from(this.attributes.keys()).sort();
        for (const name of sortedAttrNames) {
            html += ` ${name}="${this.attributes.get(name)}"`;
        }
        html += ">";
    }

    for (const child of this.childNodes) {
      if (child instanceof MockElement) {
        html += child.innerHTML;
      } else if (child.nodeType === 3) {
        html += child.textContent;
      }
    }

    if (!isWrapper && this.tagName) {
        html += `</${this.tagName.toLowerCase()}>`;
    }
    return html;
  }
}

class MockDocumentFragment extends MockElement {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(ownerDocument: any) {
        super("FRAGMENT", ownerDocument);
        this.nodeType = 11; // DOCUMENT_FRAGMENT_NODE
    }
}

class MockDocument {
  body: MockElement;

  constructor() {
      this.body = new MockElement("body", this);
  }

  createElement(tagName: string) {
    return new MockElement(tagName, this);
  }

  createTextNode(text: string) {
    const node = new MockNode(3, this);
    node.textContent = text;
    return node;
  }

  createDocumentFragment() {
      return new MockDocumentFragment(this);
  }

  parse(html: string) {
      if (!html) return;

      // Mock parsing for specific test cases
      if (html.includes("<script")) {
          const div = this.createElement("div");
          div.appendChild(this.createTextNode("Safe"));
          this.body.appendChild(div);
          const script = this.createElement("script");
          script.appendChild(this.createTextNode("alert(1)"));
          this.body.appendChild(script);
      } else if (html.includes("onmouseover")) {
          const div = this.createElement("div");
          div.setAttribute("onmouseover", "alert(1)");
          div.setAttribute("title", "Safe title");
          div.appendChild(this.createTextNode("Content"));
          this.body.appendChild(div);
      } else if (html.includes("style")) {
          const span = this.createElement("span");
          const styleMatch = html.match(/style="([^"]*)"/);
          if (styleMatch) span.setAttribute("style", styleMatch[1]);
          span.appendChild(this.createTextNode("Styled"));
          this.body.appendChild(span);
      } else if (html.includes("<strong>")) {
          const strong = this.createElement("strong");
          strong.appendChild(this.createTextNode("Bold"));
          this.body.appendChild(strong);
      } else if (html.includes("<header>")) {
          const header = this.createElement("header");
          const h1 = this.createElement("h1");
          h1.appendChild(this.createTextNode("Title"));
          header.appendChild(h1);
          this.body.appendChild(header);
      } else {
          this.body.appendChild(this.createTextNode(html));
      }
  }
}

class MockDOMParser {
  parseFromString(html: string, type?: string) {
    // Use type if provided to avoid unused variable warning, though it's ignored
    if (type) {
      // noop
    }
    const doc = new MockDocument();
    doc.parse(html);
    return doc;
  }
}

describe("sanitizeHtml", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let originalDOMParser: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let originalWindow: any;

  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    originalDOMParser = (global as any).DOMParser;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    originalWindow = (global as any).window;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).DOMParser = MockDOMParser;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).window = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).Node = MockNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).HTMLElement = MockElement;
  });

  afterAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).DOMParser = originalDOMParser;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).window = originalWindow;
  });

  test("allows safe tags", () => {
    const input = "<strong>Bold</strong>";
    const output = sanitizeHtml(input);
    expect(output).toContain("<strong>Bold</strong>");
  });

  test("allows safe styles", () => {
    const input = '<span style="color: red; text-align: center; font-size: 1.2em;">Styled</span>';
    const output = sanitizeHtml(input);
    expect(output).toContain('style="color: red; text-align: center; font-size: 1.2em;"');
  });

  test("blocks dangerous tags", () => {
    const input = '<div>Safe</div><script>alert(1)</script>';
    const output = sanitizeHtml(input);
    expect(output).toContain("<div>Safe</div>");
    expect(output).not.toContain("<script>");
  });

  test("blocks dangerous attributes", () => {
    const input = '<div onmouseover="alert(1)" title="Safe title">Content</div>';
    const output = sanitizeHtml(input);
    expect(output).toContain("<div>Content</div>");
    expect(output).not.toContain("onmouseover");
    expect(output).not.toContain('title="Safe title"');
  });

  test("blocks dangerous styles", () => {
    const input = '<span style="color: red; position: fixed; background-image: url(javascript:alert(1))">Styled</span>';
    const output = sanitizeHtml(input);
    expect(output).toContain('style="color: red;"');
    expect(output).not.toContain("position: fixed");
    expect(output).not.toContain("background-image");
  });

  test("blocks styles with expressions or functions", () => {
    const input = '<span style="color: red; width: expression(alert(1)); background: url(\'test.png\')">Styled</span>';
    const output = sanitizeHtml(input);
    expect(output).toContain('style="color: red;"');
    expect(output).not.toContain("expression");
    expect(output).not.toContain("url");
  });

  test("unwraps disallowed tags but keeps content", () => {
    const input = '<header><h1>Title</h1></header>';
    const output = sanitizeHtml(input);
    // sanitizeHtml wraps in a <div>, so we expect that
    expect(output).toBe('<div><h1>Title</h1></div>');
  });
});
