---
layout: post
title: Final Project Idea
date: 2017-04-26
url: http://awwalker.github.io/2017/04/26/final-idea
excerpt: This is the idea my group came up with for our final Physical Computing project
css: /blog/post.css

---
<section class="post-content">
<h3> Project Idea </h3>
<p> My past two years in Manhattan I have been living in Stuyvesant Town, a private residential development on the east side of New York City. Living here has its perks; proximity to Union Square and campus, easy subway access, as well as nice restaurants and shops nearby. Unfortunately living here can also be frustrating.</p>
<p> First a little background...I live with two other guys on the 3rd floor of one of the many buildings on 14th street. We have never gone out of our way to interact with our neighbors, or anyone else in the building for that matter. Because we are college students we often times throw parties on Friday or the weekend. Stuytown enforces what it calls 'quiet hours', 11pm - 7am Sunday night through Friday morning and Midnight - 9am Friday night to Sunday morning. Our next door neighbors are big believers in this policy and as a result have called the Stuyvesant Town Public Safety force to pay us a visit. In two years we have managed to accumulate 13 noise complaints, not something I'm proud to admit, just a fact of the situation.</p>
<p> In order to prevent future residents from accruing the same number of nooise complaints I wanted to try and create some sort of device that would monitor noise levels and control them if possible. Since our parties use a bluetooth speaker to create music I thought it would be best to use the Arduino to communicate with the speaker and monitor noise levels. If noise in the room reaches a certain noise level the Arduino would lower the speakers volume until noise falls below the threshold again.</p>
<p> There are a couple of flaws with this approach, however, the biggest and hardest to get around being the need to connect multiple bluetooth devices to a single master. Because the phone is playing music through the speaker is connected to it through bluetooth the arduino will not be able to connect as well. As a workaround we can instead use the remote the speaker comes with and a couple of servos to physically push the volume up/down buttons and control the speaker that way.</p>
