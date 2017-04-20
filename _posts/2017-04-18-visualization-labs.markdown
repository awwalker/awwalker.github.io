---
layout: post
title: Visualization Labs
date: 2017-04-18
url: http://awwalker.github.io/2017/04/18/visualization
excerpt: These labs are simple visualizations created using the D3.js and publicly available data
css: /blog/post.css
jsarr:
- assets/js/nyu_vs_others.js
- assets/js/nyu_pie.js

---
<section class="post-content">
<style>
    .arc text {
        font: 10px sans-serif;
        text-anchor: middle;
    }
    .arc path {
        stroke: #fff;  
    }
    .axis--x path {
        display: none;
    }

    .line {
        fill: none;
        stroke: steelblue;
        stroke-width: 1.5px;
    }
    .container {
        float: left;
    }
    </style>
<div class="container" id="chart">
<h3> One Data Source </h3>
<p> I used data from NYU to show how much money gets spent by students
each semester on just tuition based costs. </p>
</div> 

<div class="container" id="graph">
<h3> Multiple Data Sources </h3>
<p> I used data from NYU, BU and USC to show the changes in tuition costs
over the course of five years. </p>
</div>

