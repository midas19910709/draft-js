---
id: api-reference-data-conversion
title: Data Conversion
layout: docs
category: API Reference
next: api-reference-rich-utils
permalink: docs/api-reference-data-conversion.html
---

Because a text editor doesn't exist in a vacuum and it's important to save
contents for storage or transmission, you will want to be able to
convert a `ContentState` into raw JS, and vice versa.

To that end, we provide a couple of utility functions that allow you to perform
these conversions.

Note that the Draft library does not currently provide utilities to convert to
and from markdown or markup, since different clients may have different requirements
for these formats. We instead provide JavaScript objects that can be converted
to other formats as needed.

The Flow type [`RawDraftContentState`](https://github.com/facebook/draft-js/blob/master/src/model/encoding/RawDraftContentState.js)
denotes the expected structure of the raw format of the contents. The raw state
contains a list of content blocks, as well as a map of all relevant entity
objects.

## Functions

### convertFromRaw

```
convertFromRaw(rawState: RawDraftContentState): Array<ContentBlock>
```

Given a raw state, convert it to an array of `ContentBlock` objects. This is useful when
restoring contents to use within a Draft editor.

### convertToRaw

```
convertToRaw(contentState: ContentState): RawDraftContentState
```

Given a `ContentState` object, convert it to a raw JS structure. This is useful
when saving an editor state for storage, conversion to other formats, or
other usage within an application.


### convertFromHTML

```
convertFromHTML(html: string): Array<ContentBlock>
```

Given an HTML fragment, convert it to an array of `ContentBlock` objects. 
