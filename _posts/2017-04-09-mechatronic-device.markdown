---
layout: post
title: Mechatronic Device
date: 2017-04-09
url: http://awwalker.github.io/2017/04/09/mechatronic-device
excerpt: Checkout the small mechatronic iPhone swiping device I built
css: /blog/post.css

---
<section class='post-content'>
<h3> Mechatronic Device </h3>
<img src='/images/mech/final.JPG' alt='Final Product' width='400' height='400'>
<img src='/images/mech/final.gif' alt='Final Gif' width='400' height='400'>
<p> 
The original idea for this project was to build a machine that would automate page turning in books. This was quickly discarded however since every example I could find used some sort of vacuum or intricate page flipping device. Since I didn't have access to those types of parts I tried to devise a way to accomplish this same idea without complex technologies. 
</p>
<p> In order to simplify the project I decided to simplify the idea itself and rather than work with paper books I thought it would be better to get it to work with touchscreens. My original concept wanted to be able to turn both back and forth however poor design and planning on my part made this much harder than I thought it would be. Eventually I settled for simple forward swiping motion only.</p>
<p> I had thought that the DC toy motor would be easy to translate into horizontal movement but this turned out to be far from the truth. Without gears it was pretty much impossible to implement and since my only building materials were tape and cardboard it remained too difficult to do.</p>
<img src='/images/mech/toy_motor.JPG' alt='Toy Motor' width='400' height='400'>
<p> As it stands the project is functional to a degree...you can see it in the GIF below making the swiping motion. Although the motion is there it is still not production ready because the force required to swipe a screen is more than this device can achieve on its own so no page turning happens.</p>

<h3>Materials Used</h3>
    <ul>
        <li> Cardboad </li>
        <li> Arduino UNO starter kit </li>
        <li> Ticonderoga #2 pencil </li>
        <li> Packing tape </li>
        <li> Toilet paper roll </li>
        <li> Power bar wrapper </li>
    </ul>

<h3> Build Process </h3>
<img src="/images/mech/build.JPG" alt="Build" height='400' width='400'>
<p> My first step was to decide how to achieve the swiping motion I desired. I picked the servo motor for this since I knew I didn't need a full 360 degrees worth of motion. In my first design iteration I had the toilet paper roll moving sideways powered by the toy motor but as I discussed abovve this design was trashed in favor of simplicity. I then needed to pick the actual 'stylus' that would be used to transfer the circular motion of the servo motor into the semi-linear, semi-circular motion that constitutes swiping. Since this was a rushed and low budget build I settled on a #2 pencil that I had and wrapped the tip in conductive foil so that the touchscreen would actually respond to its touch. Looking back on this choice to use the servo motor/pencil combonation to achieve the stylus swiping I can say that it may not have been my best bet simply because it was fairly obvious the stylus would not be able to achieve the amount of force necessary to register a touch on the phone screen.</p> 
<p> Once I had built and attached the stylus to the servo motor I needed a stand to attach it to. I picked a cardboard box I had lying around but quickly realized that the swiping motion of the stylus required that it not be flush with the stand. I found the toilet paper roll to be a quick and relatively painless patch for this issue and used it as a buffer from the 'stand' to the servo.</p>
<p> With the physical model built it was time to design the circuit. I decided to use a push button to give the user some control as to when to swipe, although it would be fairly simple to take this feature out in favor of a timed swipe occuring at regularly paced intervals for users too lazy to use the button. You can see the full circuit diagram below.</p> 
<img src='/images/mech/circuit.JPG' alt='Circuit Diagram' height='400' width='400'>
<p> With the circuit fully built it was fairly simple to write the code that asked the servo to move to a certain angle and then back to its starting position when the button was clicked. Look back at the start of this post for a gif of the project in action!</p>
