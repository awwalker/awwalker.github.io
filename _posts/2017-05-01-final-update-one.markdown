---
layout: post
title: Final Project Update 1
date: 2017-05-01
url: http://awwalker.github.io/2017/05/01/final-update-one
excerpt: This is the first update on my final project status
css: /blog/post.css

---
<section class="post-content">
<h3> Update </h3>
<p> When we last checked in my group had decided to use the physical remote component of a bluetooth speaker to control the volume level. However, during our latest meeting we ran through a bunch of quick ideas and think we now have a better and final idea. Rather than attempt to control the speaker itself we will be controlling the component that sends music to the speaker namely a computer. More concretely our project will use a sound sensor attached to an arduino to monitor background noise in a room and then send communication to a Python script running on the computer playing music which will raise/lower the computers output volume by 10% until we are below the maximum threshold. </p>
<p> You can see our sound sensor working in the gif below. Here we are testing it using an LED to make sure it is registering a change in volume and snapping at it to create noise. </p>
<img src='/images/final/snapping.gif' alt='Snapping at noise sensor' height='400' width='400'>
<p> During these tests we did notice that the sound sensor seems to be registering very similar noise levels throughout its use which worries me that it might be hard to figure out a good range of acceptable to unacceptable noise levels. </p>
