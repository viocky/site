---
layout: page
title: SvgInclude
namespace: Freesewing
tags: [class docs]
permalink: /docs/core/classdocs/src/svginclude
---
## Description 

The [`SvgInclude`](svginclude) class holds SVG code to be
included in an SVG document, no questions asked.

## Typical use

Only used by [`Part::newInclude`](part#newinclude).

## Public methods

### set

```php?start_inline=1
void set(
    string $svgContent
)
```
Stores the `string` `$svgContent` in the `content` property.

### get

```php?start_inline=1
void get()
```
Returns the contents of the `content` property.

## See also

{% include classFooter.html %}
* TOC - Do not remove this line
{:toc}

