---
layout: "post"
title: "fractals"
date: "2016-10-26 12:39"
image: "assets/images/linnal.png"
---

About fractals :)

<!--more-->

<link href="/css/fractal.css" rel="stylesheet" type="text/css">

<div id="slider">
  <p>HUE SHIFT</p>
	<input class="bar" type="range" id="rangeinput" min="0" max="255" value="122" onchange="rangevalue.value=value; showValue(this.value)"/>
	<output id="rangevalue">122</output>
</div>

<canvas id="glcanvas" width="700" height="480">
    Your browser doesn't appear to support the
    <code>&lt;canvas&gt;</code> element.
</canvas>



<script src="/js/fractal.js"></script>
