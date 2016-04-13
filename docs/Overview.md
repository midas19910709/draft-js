---
id: getting-started
title: Overview
layout: docs
category: Quick Start
next: quickstart-api-basics
permalink: docs/overview.html
---

Draft.js is a framework for building rich text editors in React, powered by an immutable model and abstracting over cross-browser differences.

Draft.js makes it easy to build any type of rich text input, whether you're just looking to support a few inline text styles or building a complex text editor for composing long-form articles.

Draft.js was introduced at [React.js Conf](http://conf.reactjs.com/) in February 2016.

<iframe width="650" height="365" src="https://www.youtube.com/embed/feUYwoLhE_4" frameborder="0" allowfullscreen></iframe>

### Installation

Currently Draft.js is distributed via npm. It depends on React and React DOM which must also be installed.

```sh
npm install --save draft-js react react-dom
```

### Usage

```js
import React from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState} from 'draft-js';

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = (editorState) => this.setState({editorState});
  }
  render() {
    const {editorState} = this.state;
    return <Editor editorState={editorState} onChange={this.onChange} />;
  }
}

ReactDOM.render(
  <MyEditor />,
  document.getElementById('container')
);
```

Because Draft.js supports unicode, you must have the following meta tag in the `<head></head>` block of your HTML file:

```html
<meta charset="utf-8" />
```

Next, let's go into the basics of the API and learn what else you can do with Draft.js.
