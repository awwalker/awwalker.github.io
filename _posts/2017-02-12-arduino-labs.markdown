---
layout: post
title: Arduino Labs
date: 2017-02-12
url: http://awwalker.github.io/blog/2017/02/12/arduino-labs
excerpt: These are the second labs completed for a Physical Computing class I took under Professor Amos Bloomberg at NYU. Here we started using the arduino to program simple behaviors.
css: /blog/post.css

---
<section class="post-content">
    <h3> Blinking LED Circuit with Arduino </h3>
    <img src="/images/lab1/blinking_led_arduino.gif" alt="Blinking Circuit with Arduino" width="400" height="400">

    <h3> Switch and LED Circuit with Arduino </h3>
    <img src="/images/lab1/switch_led_arduino.gif" alt="Switch LED with Arduino" width="400" height="400">
    <p>If we want the LED to start on and turn off with the switch we would connect the switch to ground instead of the 5V of power and the resistor to ground.</p>

    <h3> Potentiometer and LED Circuit with Arduino </h3>
    <img src="/images/lab1/potentiometer_led_arduino.gif" alt="Potentiometer LED with Arduino" width="400" height="400">
    <p>The voltage would read 5V since the entirity of the current would be allowed to flow. The voltage would read 0V since no current would be allowed to flow through the potentiometer. 2.5V = 5V * (R / 10000 + 560) so R = 5280 ohms. We have to limit the amount of current allowed to flow through the LED because the maximum input is about 4 times the level allowed by the LED we use the .25 multiplier. </p>

    <h3> Potentiometer and Speaker Circuit with Arduino </h3>
    <iframe width="560" height="315" src="https://www.youtube.com/embed/MEWOodxwli4" frameborder="0" allowfullscreen></iframe>
    <p> Because the speaker has it's own resistance there is no risk of a short circuit. In order to increase the volume of the speaker we could increase the amount of current provided to the speaker either by lowering the resistance or increasing the voltage. Of course this is fun. </p>
    
    <h3> Photoresistor and Speaker Circuit with Arduino </h3>
    <iframe width="560" height="315" src="https://www.youtube.com/embed/PL95gU3G-dI" frameborder="0" allowfullscreen></iframe>
    <p> In order to reverse the way sound and light are related we would have the wire connnect the photoresistor to ground and the resistor connect to power as opposed to how they are already. </p>
