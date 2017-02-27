---
layout: post
title: Musical Instrument
date: 2017-02-26
url: http://awwalker.github.io/2017/02/26/musical-instrument
excerpt: Checkout the super cool musical instrument I made using only a stress android, half an envelope box, and an arduino UNO
css: /blog/post.css

---
<section class="post-content">
    <h3> Building Materials </h3>
    <img src="/images/musical-instrument/materials.JPG" alt="Building Materials" width="400" height="400">
    <p> Because this assignment necessitated having a physical 'thing' that a musician could use to interact with the instrument I decided to wrap the force sensor my instrument uses in order to make its base tone inside a stress doll. In order to hide the majority of the circuits and the breadboard from the user I used half of an empty envelope box I had lying around.</p>
    <p> It was a little tricky positioning the doll on top of the box and positioning the push-buttons that can be used to change pitch so that they too were hidden but still accesible.</p>
    <h3> Circuit Diagrams </h3>
    <img src="/images/musical-instrument/circuits.JPG" alt="Circuit Diagram"  width="400" height="400">
    <img src="/images/musical-instrument/circuits2.JPG" alt="Other Circuit Diagram" width="400" height="400">
    <p> Here you can see the layout of the circuits used to produce the music. You can see that there are two push-buttons as well as a force sensor. What you might not be able to see is that the two buttons are actually wired together into the same Analog Pin on the Arduino. They are also separated by resistors in order to get slightly different output readings when one button is pushed versus the other. You can also see the force sensor which is wired up as part of its own circuit as well as the speaker in the back.</p> 
    <h3> Crawford's Model of Interaction </h3>
    <p>Chris Crawford's Model of Interaction suggests that interaction should follow a conversational model. I think that this musical instruments design captures some of these conversational aspects but falls short when it comes to others. The instrument listens for the input coming from the musician in the form of the force sensor as well as the two push-buttons. The instruments output is then a calculated mathematical response in the form of sound. Because the human has such a wide range of choices in terms of amount of force applied to the force sensor the conversation that can be created is almost limitless. However the downside to this sensitivity is that control is also lacking. The musician either must be extremely careful while squeezing the sensor in order to play exactly the note he intended or risk making a noise that was undesired.</p>
    <h3> Improvements </h3>
    <p> I think this instrument could be improved by making it easier for the human to interact with the computer. By this I really mean that it should be easier for the human to declare exactly what sound they wish played. I think this could most easily be achieved through more push buttons and allowing less of a range of values to be inputted into the force sensors.</p>
    <h3> Performance </h3>
        <p> I hope you enjoy the first ever performance on the Android Stress Reliever! </p>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/GfLgTNgAgoQ" frameborder="0" allowfullscreen></iframe>
