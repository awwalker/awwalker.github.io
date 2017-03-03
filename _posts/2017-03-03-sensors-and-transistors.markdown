---
layout: post
title: Sensors and Transistors Labs
date: 2017-03-03
url: http://awwalker.github.io/2017/03/03/sensors-and-transistors-labs
excerpt: These labs utilize some of the sensors provided by the Arduino UNO and start looking at how transistors can be used effectively.
css: /blog/post.css

---
<section class="post-content">
    <h3> Force-Sensitive Resistor and LED with Arduino </h3>
    <img src="/images/lab2/force_with_led.gif" alt="Force-Sensitive Resistor and LED" width="400" height="400">
    <p> Two applications for a sensor set up like this would be to replace the LED with some sort of speaker to alert blind people to some successful change after pressing the sensor. Or to allow those with no voice or speaking ability to signal for help. </p>

    <h3> Temperature Sensor and LED with Arduino </h3>
    <img src="/images/lab2/temp_sensor_led.gif" alt="Temperature Sensor and LED" height="400" width="400">
    <p> There is no need for a voltage divider circuit with the temperature sensor because the temperature sensor controls its own resistance based on the input temperature. Design is affected because the temperature sensor does not depend as much on a single user. It is more intune with the temperature of its overall surroundings which most often remain fairly constant. Temperature sensors like this can be used in airconditioning units or things like freezers.</p>

    <h3> Transistor As Switch </h3>
    <img src="/images/lab2/trans_as_switch.gif" alt="Transistor As Switch" width="400" height="400">
    <p> The LED turned on by the switch is dimmer than the LED turned on by the transistor because the LED connected by the switch has a 10k ohms resistor and the LED with the transistor has a 560 ohms resistor. 
    The legs connected by the 560 resistor: 
    V = I *R so I = 5V/560ohms = 8.93mA
    The legs connected by the 10k resistor:
    V = I * R so I = 5V/10k ohms = .5mA </p>

    <h3> Transistor As Amplifier </h3>
    <iframe width="560" height="315" src="https://www.youtube.com/embed/x5mDzw2H32M" frameborder="0" allowfullscreen></iframe>
    <p> With the potentiometer set to max resistance the circuit is less responsive and vice versa. So when the potentiometer is set to max resistance the photoresistor affects the LED less and vice versa.</p>

    <h3> Transistor Controlled by Arduino </h3>
    <img src="/images/lab2/slow_up_trans.gif" height="400" width="400">
    <img src="/images/lab2/fast_blink_trans.gif" height="400" width="400">


