---
layout: post
title: Final Project Update 2
date: 2017-05-06
url: https://awwalker.github.io/2017/05/06/final-update-two
excerpt: Checking back in on our final project
css: /blog/post.css

---
<section class="post-content">
<h3> Update </h3>
<p> This weekend my group and I scheduled sometime at the Leslie Elab to hopefully 3D print a nice case for our microphone device. We got our model up and working (after struggling with the design software for a bit), and prepared to load it into the printer. Luckily the printer warned us of a nasty little detail regarding our expected finish time. To just print the lid of the box that we wished to make was going to take an expected 5 and a half hours!! You can see the 3D rendered lid below. </p>
<img src="/images/final/lid.JPG" alt="3D lid" height="400" width="400">
<p> It was at this point that we decided the extra credit points that would come with 3D printing were not worth our Sunday and bailed on the idea. More recently we finished writing the software that would allow us to control the computer speakers playing the music. </p> 
<p> This was also a revealing task, and also not in good way. We learned the hard way that our microphone is fairly unreliable. The code first tries to establish a baseline noise level by listening uninterupted for a user defined number of seconds and then records the average of more than a few runs of our Arduino listening code. After establishing a baseline a user is prompted to let the computer play music and the Arduino should report the outer sound levels to the Python script which will monitor the computers output volume. Here however our code runs into problems. For some reason unbeknownst to us the microphone would sometimes report values UNDER the baseline recorded value WHILE music was playing. In fact doing just clap tests with the sensor, Python script notwithstanding, revealed that sometimes a loud noise near the device would cause volume levels to drop!</p>
<p> Another issue we noticed was that sometimes it took the microphone a long time to adjust to hearing new noise levels, but then instead of eventually lowering back down if sound was removed would continue to hear louder noise levels!</p>
<p> This is not to say our project is a failure...on a good run, a perfect run the script correctly identifies a baseline volume level and correctly, although slowly, hears increases in volume level and lowers the speaker volume accordingly. You can watch one of our better test runs down below. If your eyes are good enough you can even make out the volume levels being reported by the Arduino and see how after the volume is aggressively lowered the noise levels do not lower. This is of course definitely a bug! </p>
<iframe width="560" height="315" src="https://www.youtube.com/embed/37ch_7yVb6c" frameborder="0" allowfullscreen></iframe>

