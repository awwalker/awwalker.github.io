---
layout: post
title: Final Project Final
date: 2017-05-07
url: http://awwalker.github.io/2017/05/07/final-update-final
excerpt: This is the final update on my final project
css: /blog/post.css

---
<section class="post-content">
<h3> Update </h3>
<p> At the last update we had just uncovered some issues with our microphone. In this post we talk about some of the ways we managed to mitigate them with software. Originally our Python script would follow the following psuedo code:
    get volume from Arduino
    set new volume if volume louder than acceptable
    if new volume set sleep
However if you read through my last post you might notice that our microphone sometimes picks up wrong values...or does it? My guess was that the sleep in the Python script was causing an issue reading values from the incoming serial communication with the Arduino.
</p>
<p> In an attempt to solve this potential problem rather than causing the Python script to sleep I instead have it skip over the next N number of serial communications. This way there is no communication overlap/mishap. Although a few test runs with this new method seemed to improve performance a little while later the microphone seemed to be up to its old tricks. You can see the full script down below. As well as the Arduino code and another video demonstrating the device with this new edit. </p> 
<img src="/images/final/python1.JPG" height="800" width="500">
<img src="/images/final/python2.JPG" height="300" width="800">
<img src="/images/final/arduino.JPG" height="800" width="400">

