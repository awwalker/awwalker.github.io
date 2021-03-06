---
layout: post
title: Visualizing a Path Through US Climbing Areas 
date: 2015-07-28
url: http://awwalker.github.io/2015/07/28/visualizing-a-path-through-us-climbing-areas
excerpt: Imagine for a moment that you are a dirtbag climber who wants to visit as many of the great American climbing locations in one trip. How can you
css: /blog/post.css

---
<section class="post-content">
  <p>Imagine for a moment that you are a <a href="http://www.urbandictionary.com/define.php?term=dirtbag">dirtbag climber</a>
  who wants to visit as many of the great American climbing locations in one trip. How can you plot a path through 50 
  separate locations as optimally as possible? </p>
  <p>The process starts with the acquisition of data. In order to code up a visualization I needed
  geographical coordinates in a latitude, longitude format. Before this project I had never used a scraper before.
  Luckily Beautiful Soup 4 <a href="http://www.crummy.com/software/BeautifulSoup/">(BS4)</a> makes scraping incredibly
  easy, even for a first-timer like me. Because I was working with climbing data I decided to get my data from
  <a href="http://www.mountainproject.com/">Mountain Project</a> (MP). With BS4 I was able to isolate the element on each
  climbing areas page that held the coordinates corresponding to its location, the Python code I used is below.
  Unfortunately I had to manually tell BS4 which page to visit, however, I definitely saved time pulling directly from
  MP. </p>
  <p>Now that we have our data how can we use it? Originally I simply wanted to know if I could find an efficient route
  through each of the fifty climbing areas. A simple Google search brought me to
  <a href="https://en.wikipedia.org/wiki/Travelling_salesman_problem">The Traveling Salesman Problem</a> (TSP). The TSP
  is a math problem that simply asks: given a list of cities and the distances between them what is the shortest path
  that visits each city exactly once and returns to the origin.</p>
  <p>The problem is deceptively simple. While easy to talk out the problem is in fact an
  <a href="https://en.wikipedia.org/wiki/P_versus_NP_problem"> NP-hard</a> problem. While it is possible to find the
  exact shortest path the algorithms used to perform these calculations are extremely time consuming. The most
  direct solution would be to simply try all the different permutations (path options) and see which one is the
  cheapest (shortest). However this approach yields a run time of O(n!), the factorial of the number of cities
  the salesman wishes to visit. This solution is obviously impractical once the salesman wishes to visit say 15
  or 20 cities.</p>
  <p>Several algorithms exist to work on a TSP, some being more accurate, others being faster and more efficient.
  You can see some of these algorithms in action <a href="https://www.youtube.com/watch?v=SC5CX8drAtU">here</a>.
  <a href="https://en.wikipedia.org/wiki/Simulated_annealing">Simulated Annealing</a> (SA) is a practical approach
  to "solving" a TSP. SA offers a way to use probabilities to calculate an approximaion to the global optimum of a
  given function. The way SA works is similar to the process that gave it its name. Annealing in metallurgy is a
  technique that involves heating and cooling a material to both increase its size and reduce its defects. </p>
  <p>At the most basic level the SA algorithm starts with a base solution and then at every step it looks a
  neighboring city of the current one and decides probabilistically whether to take the salesman there or
  stay put. The algorithm starts at a given temperature and then at each move the temperature is decreased until
  it reaches a given level (typically 0). Based on the current temperature the algorithm can decide to choose a
  "worse" solution in the hopes that later on it will be able to turn it into a better one. At high temperatures
  this probability is high, and likewise at lower temperatures the probability is low. This "cooling" process is
  what allows SA to provide a global approximation, rather than a local one like some other algorithms do.
  Each run of an SA algorithm provides a new approximation so different routes will be suggested, however, each suggested
  route is by far more efficient than one found through a greedy algorithm.</p>
  <p>Check out the code below to get a better idea of what the Simulated Annealing algorithm is and how to implement it.</p>
  </section>
  <section class="code-content">
    <div class="cell border-box-sizing code_cell rendered">
    <div class="input">
    <div class="prompt input_prompt">In&nbsp;[1]:</div>
    <div class="inner_cell">
    <div class="input_area">
    <div class=" highlight hl-ipython3"><pre><span class="c">#necessary imports</span>
    <span class="c">#global variable distance pairs</span>
    <span class="kn">import</span> <span class="nn">requests</span>
    <span class="kn">import</span> <span class="nn">bs4</span>
    <span class="kn">import</span> <span class="nn">re</span>
    <span class="kn">import</span> <span class="nn">math</span>
    <span class="kn">import</span> <span class="nn">random</span>
    <span class="kn">import</span> <span class="nn">folium</span>
    <span class="kn">import</span> <span class="nn">json</span>

    <span class="n">distances_pair</span> <span class="o">=</span> <span class="p">[]</span>
    </pre></div>

    </div>
    </div>
    </div>

    </div>
    <div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[2]:</div>
<div class="inner_cell">
<div class="input_area">
<div class=" highlight hl-ipython3"><pre><span class="k">class</span> <span class="nc">Crag</span><span class="p">:</span>
<span class="k">def</span> <span class="nf">__init__</span><span class="p">(</span><span class="bp">self</span><span class="p">,</span> <span class="n">name</span><span class="p">,</span> <span class="n">routes</span><span class="p">,</span> <span class="n">index</span> <span class="o">=</span> <span class="mi">0</span><span class="p">,</span> <span class="n">latitude</span> <span class="o">=</span> <span class="mi">0</span><span class="p">,</span> <span class="n">longitude</span> <span class="o">=</span> <span class="mi">0</span><span class="p">):</span>
  <span class="bp">self</span><span class="o">.</span><span class="n">id</span> <span class="o">=</span> <span class="n">name</span>
  <span class="bp">self</span><span class="o">.</span><span class="n">latitude</span> <span class="o">=</span> <span class="n">latitude</span>
  <span class="bp">self</span><span class="o">.</span><span class="n">longitude</span> <span class="o">=</span> <span class="n">longitude</span>
  <span class="bp">self</span><span class="o">.</span><span class="n">index</span> <span class="o">=</span> <span class="n">index</span>
  <span class="bp">self</span><span class="o">.</span><span class="n">routes</span> <span class="o">=</span> <span class="n">routes</span>
<span class="k">def</span> <span class="nf">get_name</span><span class="p">(</span><span class="bp">self</span><span class="p">):</span>
  <span class="k">return</span> <span class="bp">self</span><span class="o">.</span><span class="n">id</span>
<span class="k">def</span> <span class="nf">__str__</span><span class="p">(</span><span class="bp">self</span><span class="p">):</span>
  <span class="k">return</span> <span class="s">&quot;%s %d %f %f&quot;</span> <span class="o">%</span> <span class="p">(</span><span class="bp">self</span><span class="o">.</span><span class="n">id</span><span class="p">,</span> <span class="bp">self</span><span class="o">.</span><span class="n">index</span><span class="p">,</span> <span class="bp">self</span><span class="o">.</span><span class="n">latitude</span><span class="p">,</span> <span class="bp">self</span><span class="o">.</span><span class="n">longitude</span><span class="p">)</span>
<span class="k">def</span> <span class="nf">__repr__</span><span class="p">(</span><span class="bp">self</span><span class="p">):</span>
  <span class="k">return</span> <span class="bp">self</span><span class="o">.</span><span class="n">__str__</span><span class="p">()</span>
<span class="c">#use haversine formula to calculate &#39;as the crow flies distance</span>
<span class="c">#between crags</span>
<span class="k">def</span> <span class="nf">compute_distance_to_crag</span><span class="p">(</span><span class="bp">self</span><span class="p">,</span> <span class="n">crag</span><span class="p">):</span>
  <span class="n">lat</span> <span class="o">=</span> <span class="n">math</span><span class="o">.</span><span class="n">radians</span><span class="p">(</span><span class="bp">self</span><span class="o">.</span><span class="n">latitude</span> <span class="o">-</span> <span class="n">crag</span><span class="o">.</span><span class="n">latitude</span><span class="p">)</span>
  <span class="n">lon</span> <span class="o">=</span> <span class="n">math</span><span class="o">.</span><span class="n">radians</span><span class="p">(</span><span class="bp">self</span><span class="o">.</span><span class="n">longitude</span> <span class="o">-</span> <span class="n">crag</span><span class="o">.</span><span class="n">longitude</span><span class="p">)</span>
  <span class="n">a</span> <span class="o">=</span> <span class="n">math</span><span class="o">.</span><span class="n">pow</span><span class="p">(</span><span class="n">math</span><span class="o">.</span><span class="n">sin</span><span class="p">(</span><span class="n">lat</span><span class="o">/</span><span class="mi">2</span><span class="p">),</span> <span class="mi">2</span><span class="p">)</span> \
      <span class="o">+</span> <span class="n">math</span><span class="o">.</span><span class="n">cos</span><span class="p">(</span><span class="n">math</span><span class="o">.</span><span class="n">radians</span><span class="p">(</span><span class="bp">self</span><span class="o">.</span><span class="n">latitude</span><span class="p">))</span> <span class="o">*</span> <span class="n">math</span><span class="o">.</span><span class="n">cos</span><span class="p">(</span><span class="n">math</span><span class="o">.</span><span class="n">radians</span><span class="p">(</span><span class="n">crag</span><span class="o">.</span><span class="n">latitude</span><span class="p">))</span>\
      <span class="o">*</span> <span class="nb">pow</span><span class="p">(</span><span class="n">math</span><span class="o">.</span><span class="n">sin</span><span class="p">(</span><span class="n">lon</span><span class="o">/</span><span class="mi">2</span><span class="p">),</span> <span class="mi">2</span><span class="p">)</span>
  <span class="n">c</span> <span class="o">=</span> <span class="mi">2</span> <span class="o">*</span> <span class="n">math</span><span class="o">.</span><span class="n">atan2</span><span class="p">(</span><span class="n">math</span><span class="o">.</span><span class="n">sqrt</span><span class="p">(</span><span class="n">a</span><span class="p">),</span> <span class="n">math</span><span class="o">.</span><span class="n">sqrt</span><span class="p">(</span><span class="mi">1</span><span class="o">-</span><span class="n">a</span><span class="p">))</span>
  <span class="n">earth_radius</span> <span class="o">=</span> <span class="mf">6378.7</span> <span class="c">#km</span>
  <span class="k">return</span> <span class="n">earth_radius</span> <span class="o">*</span> <span class="n">c</span>
<span class="k">def</span> <span class="nf">distance_to_crag</span><span class="p">(</span><span class="bp">self</span><span class="p">,</span> <span class="n">crag</span><span class="p">):</span>
  <span class="k">global</span> <span class="n">distances_pair</span>
  <span class="k">if</span> <span class="bp">self</span><span class="o">.</span><span class="n">index</span> <span class="o">!=</span> <span class="n">crag</span><span class="o">.</span><span class="n">index</span><span class="p">:</span>
      <span class="n">indices</span> <span class="o">=</span> <span class="p">[</span><span class="bp">self</span><span class="o">.</span><span class="n">index</span><span class="p">,</span> <span class="n">crag</span><span class="o">.</span><span class="n">index</span><span class="p">]</span>
      <span class="k">return</span> <span class="n">distances_pair</span><span class="p">[</span><span class="nb">max</span><span class="p">(</span><span class="n">indices</span><span class="p">)][</span><span class="nb">min</span><span class="p">(</span><span class="n">indices</span><span class="p">)]</span>
  <span class="k">return</span> <span class="mi">0</span>
</pre></div>

</div>
</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[3]:</div>
<div class="inner_cell">
<div class="input_area">
<div class=" highlight hl-ipython3"><pre><span class="c">#use a dictionary to store the crag name along with its</span>
<span class="c">#specific url ending for mountain project</span>
<span class="n">crags_specific</span> <span class="o">=</span> <span class="p">{</span><span class="s">&quot;Owens River Gorge&quot;</span><span class="p">:</span><span class="s">&quot;owens-river-gorge/105843226&quot;</span><span class="p">,</span> <span class="s">&quot;Yosemite Valley&quot;</span><span class="p">:</span><span class="s">&quot;yosemite-valley/105833388&quot;</span><span class="p">,</span>
           <span class="s">&quot;Joshua Tree Natl. Park&quot;</span><span class="p">:</span><span class="s">&quot;joshua-tree-national-park/105720495&quot;</span><span class="p">,</span> <span class="s">&quot;Jailhouse Rock&quot;</span><span class="p">:</span><span class="s">&quot;jailhouse-rock/107027308&quot;</span><span class="p">,</span>
           <span class="s">&quot;Donner Summit&quot;</span><span class="p">:</span><span class="s">&quot;donner-summit/105733935&quot;</span><span class="p">,</span> <span class="s">&quot;Tuolumne Meadows&quot;</span><span class="p">:</span><span class="s">&quot;tuolumne-meadows/105833384&quot;</span><span class="p">,</span>
           <span class="s">&quot;Malibu Creek&quot;</span><span class="p">:</span><span class="s">&quot;malibu-creek-state-park/105870845&quot;</span><span class="p">,</span> <span class="s">&quot;Red River Gorge&quot;</span><span class="p">:</span><span class="s">&quot;red-river-gorge/105841134&quot;</span><span class="p">,</span>
           <span class="s">&quot;The New River Gorge&quot;</span><span class="p">:</span><span class="s">&quot;the-new-river-gorge/105855991&quot;</span><span class="p">,</span> <span class="s">&quot;Summersville Lake&quot;</span><span class="p">:</span><span class="s">&quot;summersville-lake/108468798&quot;</span><span class="p">,</span>
           <span class="s">&quot;Rifle&quot;</span><span class="p">:</span><span class="s">&quot;rifle/105802424&quot;</span><span class="p">,</span> <span class="s">&quot;Clear Creek Canyon&quot;</span><span class="p">:</span><span class="s">&quot;clear-creek-canyon/105744243&quot;</span><span class="p">,</span>
           <span class="s">&quot;Boulder Canyon&quot;</span><span class="p">:</span><span class="s">&quot;boulder-canyon/105744222&quot;</span><span class="p">,</span> <span class="s">&quot;Shelf Road&quot;</span><span class="p">:</span><span class="s">&quot;shelf-road/105744267&quot;</span><span class="p">,</span>
           <span class="s">&quot;Eldorado Canyon&quot;</span><span class="p">:</span><span class="s">&quot;eldorado-canyon-sp/105744246&quot;</span><span class="p">,</span> <span class="s">&quot;Flatirons&quot;</span><span class="p">:</span><span class="s">&quot;flatirons/105797700&quot;</span><span class="p">,</span>
           <span class="s">&quot;Maple Canyon&quot;</span><span class="p">:</span><span class="s">&quot;maple-canyon/105739298&quot;</span><span class="p">,</span> <span class="s">&quot;American Fork Canyon&quot;</span><span class="p">:</span><span class="s">&quot;american-fork-canyon/105739274&quot;</span><span class="p">,</span>
           <span class="s">&quot;Indian Creek&quot;</span><span class="p">:</span><span class="s">&quot;indian-creek/105716763&quot;</span><span class="p">,</span> <span class="s">&quot;Saint George&quot;</span><span class="p">:</span><span class="s">&quot;saint-george/105716826&quot;</span><span class="p">,</span>
           <span class="s">&quot;Big Cottonwood Canyon&quot;</span><span class="p">:</span><span class="s">&quot;big-cottonwood-canyon/105739280&quot;</span><span class="p">,</span> <span class="s">&quot;Turtle Wall&quot;</span><span class="p">:</span><span class="s">&quot;turtle-wall/105812573&quot;</span><span class="p">,</span>
           <span class="s">&quot;Rumney&quot;</span><span class="p">:</span><span class="s">&quot;rumney/105867829&quot;</span><span class="p">,</span> <span class="s">&quot;Smith Rock&quot;</span><span class="p">:</span><span class="s">&quot;smith-rock/105788989&quot;</span><span class="p">,</span> <span class="s">&quot;Ten Sleep Canyon&quot;</span><span class="p">:</span><span class="s">&quot;ten-sleep-canyon/105819641&quot;</span><span class="p">,</span>
           <span class="s">&quot;Wild Iris&quot;</span><span class="p">:</span><span class="s">&quot;wild-iris/105840796&quot;</span><span class="p">,</span> <span class="s">&quot;Sinks Canyon&quot;</span><span class="p">:</span><span class="s">&quot;sinks-canyon/105827053&quot;</span><span class="p">,</span> <span class="s">&quot;Obed Clear Creek&quot;</span><span class="p">:</span><span class="s">&quot;obed--clear-creek/105891970&quot;</span><span class="p">,</span>
           <span class="s">&quot;Foster Falls&quot;</span><span class="p">:</span><span class="s">&quot;foster-falls/105883248&quot;</span><span class="p">,</span> <span class="s">&quot;Castle Rock&quot;</span><span class="p">:</span><span class="s">&quot;castle-rock/108613875&quot;</span><span class="p">,</span> <span class="s">&quot;Red Rock&quot;</span><span class="p">:</span><span class="s">&quot;red-rock/105731932&quot;</span><span class="p">,</span>
           <span class="s">&quot;Mount Charleston&quot;</span><span class="p">:</span><span class="s">&quot;mount-charleston/105850026&quot;</span><span class="p">,</span> <span class="s">&quot;Virgin River Gorge&quot;</span><span class="p">:</span><span class="s">&quot;virgin-river-gorge/106062943&quot;</span><span class="p">,</span>
           <span class="s">&quot;Arrow Canyon&quot;</span><span class="p">:</span><span class="s">&quot;arrow-canyon/106385059&quot;</span><span class="p">,</span> <span class="s">&quot;Sand Rock&quot;</span><span class="p">:</span><span class="s">&quot;sand-rock/105905184&quot;</span><span class="p">,</span>
           <span class="s">&quot;Spearfish Canyon&quot;</span><span class="p">:</span><span class="s">&quot;spearfish-canyon/105714282&quot;</span><span class="p">,</span> <span class="s">&quot;The Gunks&quot;</span><span class="p">:</span><span class="s">&quot;the-gunks/105798167&quot;</span><span class="p">,</span> <span class="s">&quot;City of Rocks&quot;</span><span class="p">:</span><span class="s">&quot;city-of-rocks/105739322&quot;</span><span class="p">,</span>
           <span class="s">&quot;Massacre Rocks&quot;</span><span class="p">:</span><span class="s">&quot;massacre-rocks/105886274&quot;</span><span class="p">,</span> <span class="s">&quot;The Fins&quot;</span><span class="p">:</span><span class="s">&quot;the-fins/108134051&quot;</span><span class="p">,</span> <span class="s">&quot;Jackson Falls&quot;</span><span class="p">:</span><span class="s">&quot;jackson-falls/106017458&quot;</span><span class="p">,</span>
           <span class="s">&quot;Deep Creek&quot;</span><span class="p">:</span><span class="s">&quot;deep-creek/106272177&quot;</span><span class="p">,</span> <span class="s">&quot;Exit 38&quot;</span><span class="p">:</span><span class="s">&quot;exit-38-deception-crags--mt-washington/105791955&quot;</span><span class="p">,</span>
           <span class="s">&quot;Vantage&quot;</span><span class="p">:</span><span class="s">&quot;vantage-frenchman-coulee/105792231&quot;</span><span class="p">,</span> <span class="s">&quot;Enchanted Tower&quot;</span><span class="p">:</span><span class="s">&quot;enchanted-tower/105789938&quot;</span><span class="p">,</span>
           <span class="s">&quot;Jacks Canyon&quot;</span><span class="p">:</span><span class="s">&quot;jacks-canyon/105799277&quot;</span><span class="p">,</span> <span class="s">&quot;The Pit&quot;</span><span class="p">:</span><span class="s">&quot;the-pit/105787831&quot;</span><span class="p">,</span> <span class="s">&quot;Reimer&#39;s Ranch&quot;</span><span class="p">:</span><span class="s">&quot;reimers-ranch/105837312&quot;</span><span class="p">,</span>
           <span class="s">&quot;Devil&#39;s Lake&quot;</span><span class="p">:</span><span class="s">&quot;devils-lake/105729927&quot;</span><span class="p">,</span> <span class="s">&quot;Barn Bluff Red Wing&quot;</span><span class="p">:</span><span class="s">&quot;barn-bluff-red-wing/105812663&quot;</span><span class="p">}</span>
</pre></div>

</div>
</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[4]:</div>
<div class="inner_cell">
<div class="input_area">
<div class=" highlight hl-ipython3"><pre><span class="c">#scraper using Beautiful Soup to parse information from Mountain Project</span>
<span class="c">#specifically looking for the location of each crag in lat, lon format</span>
<span class="k">def</span> <span class="nf">get_coords</span><span class="p">(</span><span class="n">link</span><span class="p">):</span>
<span class="n">response</span> <span class="o">=</span> <span class="n">requests</span><span class="o">.</span><span class="n">get</span><span class="p">(</span><span class="n">link</span><span class="p">)</span>
<span class="n">soup</span> <span class="o">=</span> <span class="n">bs4</span><span class="o">.</span><span class="n">BeautifulSoup</span><span class="p">(</span><span class="n">response</span><span class="o">.</span><span class="n">text</span><span class="p">)</span>
<span class="n">location</span> <span class="o">=</span> <span class="n">soup</span><span class="o">.</span><span class="n">find</span><span class="p">(</span><span class="s">&quot;td&quot;</span><span class="p">,</span> <span class="n">text</span> <span class="o">=</span> <span class="n">re</span><span class="o">.</span><span class="n">compile</span><span class="p">(</span><span class="s">&quot;Location&quot;</span><span class="p">))</span>
<span class="n">string</span> <span class="o">=</span> <span class="n">location</span><span class="o">.</span><span class="n">find_next_siblings</span><span class="p">(</span><span class="s">&quot;td&quot;</span><span class="p">)</span>
<span class="n">coord</span> <span class="o">=</span> <span class="n">string</span><span class="p">[</span><span class="mi">0</span><span class="p">]</span><span class="o">.</span><span class="n">contents</span><span class="p">[</span><span class="mi">0</span><span class="p">]</span>
<span class="n">coords</span> <span class="o">=</span> <span class="n">coord</span><span class="o">.</span><span class="n">split</span><span class="p">(</span><span class="s">&quot;,&quot;</span><span class="p">)</span>
<span class="n">lat_lon</span> <span class="o">=</span> <span class="nb">float</span><span class="p">(</span><span class="n">coords</span><span class="p">[</span><span class="mi">0</span><span class="p">]),</span> <span class="nb">float</span><span class="p">(</span><span class="n">coords</span><span class="p">[</span><span class="mi">1</span><span class="p">]</span><span class="o">.</span><span class="n">replace</span><span class="p">(</span><span class="s">u&#39;</span><span class="se">\xa0</span><span class="s">&#39;</span><span class="p">,</span> <span class="s">u&#39;&#39;</span><span class="p">))</span>
<span class="k">return</span> <span class="n">lat_lon</span>

</pre></div>

</div>
</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[5]:</div>
<div class="inner_cell">
<div class="input_area">
<div class=" highlight hl-ipython3"><pre><span class="k">def</span> <span class="nf">get_quantites</span><span class="p">(</span><span class="n">link</span><span class="p">):</span>
<span class="n">response</span> <span class="o">=</span> <span class="n">requests</span><span class="o">.</span><span class="n">get</span><span class="p">(</span><span class="n">link</span><span class="p">)</span>
<span class="n">soup</span> <span class="o">=</span> <span class="n">bs4</span><span class="o">.</span><span class="n">BeautifulSoup</span><span class="p">(</span><span class="n">response</span><span class="o">.</span><span class="n">text</span><span class="p">)</span>
<span class="n">quants</span> <span class="o">=</span> <span class="n">soup</span><span class="o">.</span><span class="n">find</span><span class="p">(</span><span class="s">&#39;div&#39;</span><span class="p">,</span> <span class="p">{</span><span class="s">&#39;id&#39;</span> <span class="p">:</span> <span class="s">&quot;ratingChart&quot;</span><span class="p">})</span>
<span class="n">original</span> <span class="o">=</span> <span class="n">quants</span><span class="o">.</span><span class="n">get_text</span><span class="p">()</span>
<span class="n">new</span> <span class="o">=</span> <span class="n">original</span><span class="o">.</span><span class="n">replace</span><span class="p">(</span><span class="s">&quot;],&quot;</span><span class="p">,</span> <span class="s">&quot; &quot;</span><span class="p">)</span><span class="o">.</span><span class="n">replace</span><span class="p">(</span><span class="s">&quot;[&quot;</span><span class="p">,</span> <span class="s">&quot;&quot;</span><span class="p">)</span><span class="o">.</span><span class="n">replace</span><span class="p">(</span><span class="s">&quot;</span><span class="se">\&quot;</span><span class="s">&quot;</span><span class="p">,</span> <span class="s">&quot;&quot;</span><span class="p">)</span><span class="o">.</span><span class="n">replace</span><span class="p">(</span><span class="s">&quot;&#39;&quot;</span><span class="p">,</span><span class="s">&quot;&quot;</span><span class="p">)</span><span class="o">.</span><span class="n">replace</span><span class="p">(</span><span class="s">&quot;]&quot;</span><span class="p">,</span> <span class="s">&quot;&quot;</span><span class="p">)</span><span class="o">.</span><span class="n">replace</span><span class="p">(</span><span class="s">&quot;&#39;&quot;</span><span class="p">,</span><span class="s">&quot;&quot;</span><span class="p">)</span>
<span class="n">route_dict</span> <span class="o">=</span> <span class="p">{}</span>
<span class="k">for</span> <span class="n">item</span> <span class="ow">in</span> <span class="n">new</span><span class="o">.</span><span class="n">split</span><span class="p">(</span><span class="s">&quot; &quot;</span><span class="p">):</span>
  <span class="n">grades</span> <span class="o">=</span> <span class="n">item</span><span class="o">.</span><span class="n">split</span><span class="p">(</span><span class="s">&quot;,&quot;</span><span class="p">)</span>
  <span class="n">route_dict</span><span class="p">[</span><span class="n">grades</span><span class="p">[</span><span class="mi">0</span><span class="p">]]</span> <span class="o">=</span> <span class="n">grades</span><span class="p">[</span><span class="mi">1</span><span class="p">]</span>
<span class="k">del</span> <span class="n">route_dict</span><span class="p">[</span><span class="s">&quot;&quot;</span><span class="p">]</span>
<span class="k">return</span> <span class="n">route_dict</span>
</pre></div>

</div>
</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[6]:</div>
<div class="inner_cell">
<div class="input_area">
<div class=" highlight hl-ipython3"><pre><span class="c">#using our get_coords function and our dictionary of crag names and links</span>
<span class="c">#find the coordinates for every crag within our dictionary</span>
<span class="k">def</span> <span class="nf">get_all_coords</span><span class="p">(</span><span class="n">dict_of_crag_urls</span><span class="p">):</span>
<span class="n">base_link</span> <span class="o">=</span> <span class="s">&quot;http://www.mountainproject.com/v/&quot;</span>
<span class="n">crag_coords</span> <span class="o">=</span> <span class="p">{}</span>
<span class="n">crags_list</span> <span class="o">=</span> <span class="p">[]</span>
<span class="n">index</span> <span class="o">=</span> <span class="mi">0</span>
<span class="k">for</span> <span class="n">k</span><span class="p">,</span> <span class="n">v</span> <span class="ow">in</span> <span class="n">dict_of_crag_urls</span><span class="o">.</span><span class="n">items</span><span class="p">():</span>
  <span class="n">coordinate</span> <span class="o">=</span> <span class="n">get_coords</span><span class="p">(</span><span class="n">base_link</span> <span class="o">+</span> <span class="n">v</span><span class="p">)</span>
  <span class="n">route_quantities</span> <span class="o">=</span> <span class="n">get_quantites</span><span class="p">(</span><span class="n">base_link</span> <span class="o">+</span> <span class="n">v</span><span class="p">)</span>
  <span class="n">crag_coords</span><span class="p">[</span><span class="n">k</span><span class="p">]</span> <span class="o">=</span> <span class="n">coordinate</span>
  <span class="n">crags_list</span><span class="o">.</span><span class="n">append</span><span class="p">(</span><span class="n">Crag</span><span class="p">(</span><span class="n">k</span><span class="p">,</span> <span class="n">route_quantities</span><span class="p">,</span> <span class="n">index</span><span class="p">,</span> <span class="n">coordinate</span><span class="p">[</span><span class="mi">0</span><span class="p">],</span> <span class="n">coordinate</span><span class="p">[</span><span class="mi">1</span><span class="p">]))</span>
  <span class="n">index</span> <span class="o">+=</span> <span class="mi">1</span>
<span class="k">return</span> <span class="n">crags_list</span>
</pre></div>

</div>
</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[7]:</div>
<div class="inner_cell">
<div class="input_area">
<div class=" highlight hl-ipython3"><pre><span class="k">def</span> <span class="nf">compute_all_distance_pairs</span><span class="p">(</span><span class="n">crags</span><span class="p">):</span>
<span class="k">global</span> <span class="n">distances_pair</span>
<span class="k">for</span> <span class="n">crag_from</span> <span class="ow">in</span> <span class="n">crags</span><span class="p">:</span>
  <span class="n">distances_pair</span><span class="o">.</span><span class="n">append</span><span class="p">([</span><span class="mi">0</span> <span class="k">for</span> <span class="n">r</span> <span class="ow">in</span> <span class="nb">range</span><span class="p">(</span><span class="n">crag_from</span><span class="o">.</span><span class="n">index</span><span class="p">)])</span>
  <span class="k">for</span> <span class="n">crag_to</span> <span class="ow">in</span> <span class="n">crags</span><span class="p">[:</span><span class="n">crag_from</span><span class="o">.</span><span class="n">index</span><span class="p">]:</span>
      <span class="n">distances_pair</span><span class="p">[</span><span class="n">crag_from</span><span class="o">.</span><span class="n">index</span><span class="p">][</span><span class="n">crag_to</span><span class="o">.</span><span class="n">index</span><span class="p">]</span> <span class="o">=</span> <span class="n">crag_from</span><span class="o">.</span><span class="n">compute_distance_to_crag</span><span class="p">(</span><span class="n">crag_to</span><span class="p">)</span>

<span class="k">def</span> <span class="nf">total_distance</span><span class="p">(</span><span class="n">crags</span><span class="p">):</span>
<span class="n">distances</span> <span class="o">=</span> <span class="p">[</span><span class="n">crags</span><span class="p">[</span><span class="n">index</span><span class="p">]</span><span class="o">.</span><span class="n">distance_to_crag</span><span class="p">(</span><span class="n">crags</span><span class="p">[(</span><span class="n">index</span> <span class="o">+</span> <span class="mi">1</span><span class="p">)</span> <span class="o">%</span> <span class="nb">len</span><span class="p">(</span><span class="n">crags</span><span class="p">)])</span> <span class="k">for</span> <span class="n">index</span> <span class="ow">in</span> <span class="nb">range</span><span class="p">(</span><span class="nb">len</span><span class="p">(</span><span class="n">crags</span><span class="p">))]</span>
<span class="k">return</span> <span class="nb">sum</span><span class="p">(</span><span class="n">distances</span><span class="p">)</span>

<span class="k">def</span> <span class="nf">compute_swap_indices</span><span class="p">(</span><span class="n">index</span><span class="p">,</span> <span class="n">num_crags</span><span class="p">):</span>
<span class="n">prev_index</span> <span class="o">=</span> <span class="p">(</span><span class="n">index</span> <span class="o">-</span> <span class="mi">1</span> <span class="o">+</span> <span class="n">num_crags</span><span class="p">)</span> <span class="o">%</span> <span class="n">num_crags</span>
<span class="n">next_index</span> <span class="o">=</span> <span class="p">(</span><span class="n">index</span> <span class="o">+</span> <span class="mi">1</span><span class="p">)</span> <span class="o">%</span> <span class="n">num_crags</span>
<span class="k">return</span> <span class="p">(</span><span class="n">prev_index</span><span class="p">,</span> <span class="n">next_index</span><span class="p">)</span>

<span class="k">def</span> <span class="nf">distance_swap</span><span class="p">(</span><span class="n">crags</span><span class="p">,</span> <span class="n">index_a</span><span class="p">,</span> <span class="n">index_b</span><span class="p">):</span>
<span class="n">index_A</span> <span class="o">=</span> <span class="nb">min</span><span class="p">(</span><span class="n">index_a</span><span class="p">,</span> <span class="n">index_b</span><span class="p">)</span>
<span class="n">index_B</span> <span class="o">=</span> <span class="nb">max</span><span class="p">(</span><span class="n">index_a</span><span class="p">,</span> <span class="n">index_b</span><span class="p">)</span>

<span class="p">(</span><span class="n">index_A_previous</span><span class="p">,</span> <span class="n">index_A_next</span><span class="p">)</span> <span class="o">=</span> <span class="n">compute_swap_indices</span><span class="p">(</span><span class="n">index_A</span><span class="p">,</span> <span class="nb">len</span><span class="p">(</span><span class="n">crags</span><span class="p">))</span>
<span class="p">(</span><span class="n">index_B_previous</span><span class="p">,</span> <span class="n">index_B_next</span><span class="p">)</span> <span class="o">=</span> <span class="n">compute_swap_indices</span><span class="p">(</span><span class="n">index_B</span><span class="p">,</span> <span class="nb">len</span><span class="p">(</span><span class="n">crags</span><span class="p">))</span>

<span class="n">distances</span> <span class="o">=</span> <span class="p">[]</span>

<span class="n">distances</span><span class="o">.</span><span class="n">append</span><span class="p">(</span><span class="n">crags</span><span class="p">[</span><span class="n">index_A_previous</span><span class="p">]</span><span class="o">.</span><span class="n">distance_to_crag</span><span class="p">(</span><span class="n">crags</span><span class="p">[</span><span class="n">index_A</span><span class="p">]))</span>
<span class="n">distances</span><span class="o">.</span><span class="n">append</span><span class="p">(</span><span class="n">crags</span><span class="p">[</span><span class="n">index_B</span><span class="p">]</span><span class="o">.</span><span class="n">distance_to_crag</span><span class="p">(</span><span class="n">crags</span><span class="p">[</span><span class="n">index_B_next</span><span class="p">]))</span>
<span class="k">if</span> <span class="n">index_A</span> <span class="o">==</span> <span class="n">index_B_previous</span><span class="p">:</span>
  <span class="n">distances</span><span class="o">.</span><span class="n">append</span><span class="p">(</span><span class="n">crags</span><span class="p">[</span><span class="n">index_A</span><span class="p">]</span><span class="o">.</span><span class="n">distance_to_crag</span><span class="p">(</span><span class="n">crags</span><span class="p">[</span><span class="n">index_B</span><span class="p">]))</span>
<span class="k">else</span><span class="p">:</span>
  <span class="n">distances</span><span class="o">.</span><span class="n">append</span><span class="p">(</span><span class="n">crags</span><span class="p">[</span><span class="n">index_A</span><span class="p">]</span><span class="o">.</span><span class="n">distance_to_crag</span><span class="p">(</span><span class="n">crags</span><span class="p">[</span><span class="n">index_A_next</span><span class="p">]))</span>
  <span class="n">distances</span><span class="o">.</span><span class="n">append</span><span class="p">(</span><span class="n">crags</span><span class="p">[</span><span class="n">index_B_previous</span><span class="p">]</span><span class="o">.</span><span class="n">distance_to_crag</span><span class="p">(</span><span class="n">crags</span><span class="p">[</span><span class="n">index_B</span><span class="p">]))</span>
<span class="k">return</span> <span class="nb">sum</span><span class="p">(</span><span class="n">distances</span><span class="p">)</span>
</pre></div>

</div>
</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[8]:</div>
<div class="inner_cell">
<div class="input_area">
<div class=" highlight hl-ipython3"><pre><span class="k">def</span> <span class="nf">annealing</span><span class="p">(</span><span class="n">crags</span><span class="p">,</span> <span class="n">temp_start</span><span class="p">,</span> <span class="n">temp_end</span><span class="p">,</span> <span class="n">cooling_factor</span><span class="p">,</span> <span class="n">num_iterations</span> <span class="o">=</span> <span class="mi">1</span><span class="p">):</span>
<span class="n">crags_best</span> <span class="o">=</span> <span class="n">crags</span><span class="p">[:]</span>
<span class="n">distance_best</span> <span class="o">=</span> <span class="n">total_distance</span><span class="p">(</span><span class="n">crags_best</span><span class="p">)</span>

<span class="n">distances_current</span> <span class="o">=</span> <span class="p">[]</span>
<span class="n">distances_best</span> <span class="o">=</span> <span class="p">[]</span>

<span class="k">for</span> <span class="n">iteration</span> <span class="ow">in</span> <span class="nb">range</span><span class="p">(</span><span class="n">num_iterations</span><span class="p">):</span>
  <span class="n">temp</span> <span class="o">=</span> <span class="n">temp_start</span>
  <span class="n">crags_current</span> <span class="o">=</span> <span class="n">crags_best</span><span class="p">[:]</span>
  <span class="n">distance_current</span> <span class="o">=</span> <span class="n">distance_best</span>
  <span class="n">distance_new</span> <span class="o">=</span> <span class="n">distance_best</span>
  <span class="n">crags_new</span> <span class="o">=</span> <span class="n">crags_best</span><span class="p">[:]</span>

  <span class="k">while</span> <span class="n">temp</span> <span class="o">&gt;</span> <span class="n">temp_end</span><span class="p">:</span>

      <span class="n">index</span> <span class="o">=</span> <span class="n">random</span><span class="o">.</span><span class="n">sample</span><span class="p">(</span><span class="nb">range</span><span class="p">(</span><span class="nb">len</span><span class="p">(</span><span class="n">crags_new</span><span class="p">)</span> <span class="o">-</span> <span class="mi">1</span><span class="p">),</span> <span class="mi">2</span><span class="p">)</span>
      <span class="n">index</span><span class="p">[</span><span class="mi">0</span><span class="p">]</span> <span class="o">+=</span> <span class="mi">1</span>
      <span class="n">index</span><span class="p">[</span><span class="mi">1</span><span class="p">]</span> <span class="o">+=</span> <span class="mi">1</span>
      <span class="n">swap_before</span> <span class="o">=</span> <span class="n">distance_swap</span><span class="p">(</span><span class="n">crags_new</span><span class="p">,</span> <span class="n">index</span><span class="p">[</span><span class="mi">0</span><span class="p">],</span> <span class="n">index</span><span class="p">[</span><span class="mi">1</span><span class="p">])</span>
      <span class="n">crags_new</span><span class="p">[</span><span class="n">index</span><span class="p">[</span><span class="mi">0</span><span class="p">]],</span> <span class="n">crags_new</span><span class="p">[</span><span class="n">index</span><span class="p">[</span><span class="mi">1</span><span class="p">]]</span> <span class="o">=</span> <span class="n">crags_new</span><span class="p">[</span><span class="n">index</span><span class="p">[</span><span class="mi">1</span><span class="p">]],</span> <span class="n">crags_new</span><span class="p">[</span><span class="n">index</span><span class="p">[</span><span class="mi">0</span><span class="p">]]</span>
      <span class="n">swap_after</span> <span class="o">=</span> <span class="n">distance_swap</span><span class="p">(</span><span class="n">crags_new</span><span class="p">,</span> <span class="n">index</span><span class="p">[</span><span class="mi">0</span><span class="p">],</span> <span class="n">index</span><span class="p">[</span><span class="mi">1</span><span class="p">])</span>

      <span class="n">distance_new</span> <span class="o">=</span> <span class="n">distance_new</span> <span class="o">-</span> <span class="n">swap_before</span> <span class="o">+</span> <span class="n">swap_after</span>

      <span class="n">diff</span> <span class="o">=</span> <span class="n">distance_new</span> <span class="o">-</span> <span class="n">distance_current</span>
      <span class="k">if</span> <span class="n">diff</span> <span class="o">&lt;</span> <span class="mi">0</span> <span class="ow">or</span> <span class="n">math</span><span class="o">.</span><span class="n">exp</span><span class="p">(</span><span class="o">-</span><span class="n">diff</span> <span class="o">/</span> <span class="n">temp</span><span class="p">)</span> <span class="o">&gt;</span> <span class="n">random</span><span class="o">.</span><span class="n">random</span><span class="p">():</span>
          <span class="n">crags_current</span> <span class="o">=</span> <span class="n">crags_new</span><span class="p">[:]</span>
          <span class="n">distance_current</span> <span class="o">=</span> <span class="n">distance_new</span>
      <span class="k">else</span><span class="p">:</span>
          <span class="n">distance_new</span> <span class="o">=</span> <span class="n">distance_current</span>
          <span class="n">crags_new</span> <span class="o">=</span> <span class="n">crags_current</span><span class="p">[:]</span>

      <span class="k">if</span> <span class="n">distance_current</span> <span class="o">&lt;</span> <span class="n">distance_best</span><span class="p">:</span>
          <span class="n">crags_best</span> <span class="o">=</span> <span class="n">crags_current</span><span class="p">[:]</span>
          <span class="n">distance_best</span> <span class="o">=</span> <span class="n">distance_current</span>

      <span class="k">if</span> <span class="k">True</span><span class="p">:</span>
          <span class="n">distances_current</span><span class="o">.</span><span class="n">append</span><span class="p">(</span><span class="n">distance_current</span><span class="p">)</span>
          <span class="n">distances_best</span><span class="o">.</span><span class="n">append</span><span class="p">(</span><span class="n">distance_best</span><span class="p">)</span>
      <span class="n">temp</span> <span class="o">=</span> <span class="n">temp</span> <span class="o">*</span> <span class="n">cooling_factor</span>

<span class="n">crag_tuple</span> <span class="o">=</span> <span class="p">(</span><span class="n">crags_best</span><span class="p">,</span> <span class="n">distances_current</span><span class="p">,</span> <span class="n">distances_best</span><span class="p">)</span>
<span class="k">return</span> <span class="n">crag_tuple</span>
</pre></div>

</div>
</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[9]:</div>
<div class="inner_cell">
<div class="input_area">
<div class=" highlight hl-ipython3"><pre><span class="k">def</span> <span class="nf">make_json</span><span class="p">(</span><span class="n">dic</span><span class="p">):</span>
<span class="n">out_file</span> <span class="o">=</span> <span class="nb">open</span><span class="p">(</span><span class="s">&quot;crags_info.json&quot;</span><span class="p">,</span> <span class="s">&quot;w&quot;</span><span class="p">)</span>
<span class="n">json</span><span class="o">.</span><span class="n">dump</span><span class="p">(</span><span class="n">dic</span><span class="p">,</span> <span class="n">out_file</span><span class="p">,</span> <span class="n">indent</span> <span class="o">=</span> <span class="mi">4</span><span class="p">)</span>
<span class="n">out_file</span><span class="o">.</span><span class="n">close</span><span class="p">()</span>
</pre></div>

</div>
</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[10]:</div>
<div class="inner_cell">
<div class="input_area">
<div class=" highlight hl-ipython3"><pre><span class="k">if</span> <span class="n">__name__</span> <span class="o">==</span> <span class="s">&quot;__main__&quot;</span><span class="p">:</span>
<span class="n">crag_dict</span> <span class="o">=</span> <span class="p">{}</span>
<span class="n">crags</span> <span class="o">=</span> <span class="n">get_all_coords</span><span class="p">(</span><span class="n">crags_specific</span><span class="p">)</span>
<span class="n">num_crags</span> <span class="o">=</span> <span class="nb">len</span><span class="p">(</span><span class="n">crags</span><span class="p">)</span>
<span class="n">compute_all_distance_pairs</span><span class="p">(</span><span class="n">crags</span><span class="p">)</span>
<span class="n">crags</span> <span class="o">=</span> <span class="n">crags</span><span class="p">[:</span><span class="n">num_crags</span><span class="p">]</span>
<span class="c">#temp_start = 94</span>
<span class="n">temp_start</span> <span class="o">=</span> <span class="mi">231</span>
<span class="n">temp_end</span> <span class="o">=</span> <span class="o">.</span><span class="mi">0000001</span>
<span class="n">cooling_factor</span> <span class="o">=</span> <span class="o">.</span><span class="mi">999995</span>
<span class="n">num_iterations</span> <span class="o">=</span> <span class="mi">11</span>

<span class="p">(</span><span class="n">crags_new</span><span class="p">,</span> <span class="n">distances_current</span><span class="p">,</span> <span class="n">distances_best</span><span class="p">)</span> <span class="o">=</span> <span class="n">annealing</span><span class="p">(</span><span class="n">crags</span><span class="p">,</span> <span class="n">temp_start</span><span class="p">,</span> <span class="n">temp_end</span><span class="p">,</span> <span class="n">cooling_factor</span><span class="p">)</span>
<span class="n">distance_begin</span> <span class="o">=</span> <span class="n">total_distance</span><span class="p">(</span><span class="n">crags</span><span class="p">)</span>
<span class="nb">print</span><span class="p">(</span><span class="n">distance_begin</span><span class="p">)</span>
<span class="n">distance_end</span> <span class="o">=</span> <span class="n">total_distance</span><span class="p">(</span><span class="n">crags_new</span><span class="p">)</span>
<span class="nb">print</span><span class="p">(</span><span class="n">distance_end</span><span class="p">)</span>
<span class="n">i</span> <span class="o">=</span> <span class="mi">0</span>
<span class="k">for</span> <span class="n">crag</span> <span class="ow">in</span> <span class="n">crags_new</span><span class="p">:</span>
  <span class="n">crag_dict</span><span class="p">[</span><span class="n">i</span><span class="p">]</span> <span class="o">=</span> <span class="p">{}</span>
  <span class="n">crag_dict</span><span class="p">[</span><span class="n">i</span><span class="p">][</span><span class="s">&quot;Name&quot;</span><span class="p">]</span> <span class="o">=</span> <span class="n">crag</span><span class="o">.</span><span class="n">id</span>
  <span class="n">crag_dict</span><span class="p">[</span><span class="n">i</span><span class="p">][</span><span class="s">&quot;Routes&quot;</span><span class="p">]</span> <span class="o">=</span> <span class="n">crag</span><span class="o">.</span><span class="n">routes</span>
  <span class="n">crag_dict</span><span class="p">[</span><span class="n">i</span><span class="p">][</span><span class="s">&quot;Latitude&quot;</span><span class="p">]</span> <span class="o">=</span> <span class="n">crag</span><span class="o">.</span><span class="n">latitude</span>
  <span class="n">crag_dict</span><span class="p">[</span><span class="n">i</span><span class="p">][</span><span class="s">&quot;Longitude&quot;</span><span class="p">]</span> <span class="o">=</span> <span class="n">crag</span><span class="o">.</span><span class="n">longitude</span>
  <span class="n">i</span> <span class="o">+=</span> <span class="mi">1</span>
<span class="n">crag_dict</span><span class="p">[</span><span class="s">&quot;Best Route&quot;</span><span class="p">]</span> <span class="o">=</span> <span class="p">[(</span><span class="n">crag</span><span class="o">.</span><span class="n">id</span><span class="p">,</span> <span class="n">crag</span><span class="o">.</span><span class="n">latitude</span><span class="p">,</span> <span class="n">crag</span><span class="o">.</span><span class="n">longitude</span><span class="p">)</span> <span class="k">for</span> <span class="n">crag</span> <span class="ow">in</span> <span class="n">crags_new</span><span class="p">]</span>
<span class="n">make_json</span><span class="p">(</span><span class="n">crag_dict</span><span class="p">)</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt"></div>
<div class="output_subarea output_stream output_stdout output_text">
<pre>82328.6650572611
13903.434862045002
</pre>
</div>
</div>

</div>
</div>

</div>
  </section>


</div>
