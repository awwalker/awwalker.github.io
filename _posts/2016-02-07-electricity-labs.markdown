---
layout: post
title: Electricity Labs
date: 2017-02-07
url: http://awwalker.github.io/blog/2017-02-07/electricity-labs
excerpt: These are the first of many labs completed for a Physical Computing class I took under Professor Amos Bloomberg at NYU.
css: /blog/post.css

---
<section class="post-content">
    <h3> Simple LED Circuit </h3>
    <img src="/images/lab0/simple_led_circuit.jpg" alt="Simple LED Circuit" width="400" height="400">
    <p> We use a resistor to limit the amount of current running through the circuit when it reaches the LED. Using Ohm's Law (V=IR) we can calculate that the current running through this circuit is 5 = I * 560 we can get that I = .0089 Amps or 8.9 mA. In order for the current to equal 15mA we have 5 = .015 * R so R = 322.6Ω. If 2.2V are dropped by the LED and we start with 5V we can see that the resistor drops 5 - 2.2 = 2.8V. </p>

    <h3> Simple LED Circuit with Switch </h3>
    <img src="/images/lab0/simple_led_with_switch.gif" alt="Simple LED with Switch">
    <p> Looking at the schematic if you moved the switch so that it was between the resistor and the LED the circuit would function the same way. If the switch was after the LED then the switch is useless. </p> 
    <h3> Simple LED Circuit with Potentiometer </h3>
    <img src="/images/lab0/simple_led_with_potentiometer.gif" alt="Simple LED with Potentiometer" width="400" height="400">
    <p> The 560Ω resistor is necessary to prevent the LED from getting more current than it can handle. With the potentiometer turned all the way up to maximum resistance 10kΩ we have 5 = I * (10560). Which gives us .47mA of current. Types of variable resistors are Rheostats, Thermistors, Photoresistors and Potentiometers. </p>

    <h3> Dueling LEDs Circuit with Potentiometer </h3>
    <img src="/images/lab0/dueling_leds_with_potentiometer.gif" alt="Dueling LEDs with Potentiometer" width="400" height="400">
    <p> The resistance to each LED is inversely affected. So when one side of the potentiometer is turned to maximum resistance the other side is allowing the full current through. One LED can be turned all the way while the other is off and vice versa.</p>

    <h3> Capacitor Charging Circuit </h3>
    <img src="/images/lab0/capacitor_charging_circuit.gif" alt="Capacitor Charging Circuit" width="400" height="400">
        <p> With a resistor involved the capacitor would take longer to charge and therefore the LED would stay lit for longer.</p>

    <h3> Capacitor Discharging Circuit with LED Decay </h3>
    <img src="/images/lab0/capacitor_discharging_circuit_with_LED_decay.gif" alt="Capacitor Discharging Circuit with LED decay" width="400" height="400">
    <p> The capacitor discharges up through the LED part of the circuit because the capacitor is still connected to the LED through a circuit without a different power source or ground being present.</p>
