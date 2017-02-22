---
layout: post
title: Visualizing How New Yorkers Utilize Citi Bikes
date: 2015-10-27
url: http://awwalker.github.io/blog/2015/10/27/citi-bikes
excerpt: Citi Bike is a New York City's bike sharing system instituted by Citi Bank and operated by Motivate. The bike sharing system is designed to
css: /blog/post.css 

---
<section class = "post-content">
  <p><a href = "https://www.citibikenyc.com/about"> Citi Bike</a> is New York City's bike sharing system instituted by Citi Bank and operated by <a href = "http://www.motivateco.com/"> Motivate</a>. The bike sharing system is designed to provide New Yorkers an additional method of transportation around the city. As a whole the system is fairly simple to understand: there is a fleet of bicycles that can be rented from and then returned to any of the hundreds of docking stationsin the city. As of May 2013 Citi had installed 332 docking stations and stocked them with 6,000 bikes. Plans were made for expansion but I could not find any publicly released data on the current number of stations or bikes. </p>
  <p>This project started as a way to begin learning to work with the Python <a href = "http://pandas.pydata.org/" >Pandas</a> library. Over the past summer after working with the Javascript <a href = "">D3</a> library I was hooked on data visualizations and looking for another project that would allow me to create another nice looking visual. Luckily for me Citi has made their data public <a href = "https://www.citibikenyc.com/system-data">here</a>. In my rush to produce I decided to only work with the data from July 2013...obviously this was a beginner mistake because there is data from as recently as September of this year now. Perhaps at some point in the future I'll revise this project to represent the data from each of the available months.</p>
  <p>Because Citi is nice enough to clean their data working with it as a CSV with Pandas was incredibly easy. In fact one of the hardest parts of this project was trying to figure out a clean and still relevant way to present the data. After looking at different visalizations online I came across this <a href= "http://bost.ocks.org/mike/uberdata/"> Uber data visualization</a> by Mike Bostock. Mike made it look so easy to represent this kind of back and forth travel relationship using the chord diagram so I figured I should give it a shot. I seriously considered using a heat matrix as well but figured a chord diagram would look cleaner with the amount of data I was going to try and represent.</p>
  <p>Speaking of the volume of data...while the csv file itself was not that large ~100MB and ~840,000 rows in Excel it is important to remember that this represents a flow of traffic between 322 stations, not the less than 30 or so neighboorhoods used by Mike. The whole idea behind the visualization was to attempt to see the traffic flow between docking stations, yet because there are so many stations it was nearly impossible to include all of them. In fact my first chord diagram looked like a completely colored in circle, just a mess of lines criss crossing the diagram making any sort of inference impossible.</p>
  <p>I decided that I needed to pick which stations to observe and which to ignore. Using Pandas it was easy to group stations by how they interacted with each other and then tally up the amount of traffic there was going between them (in both directions). Once I had the data in this format it was easy to see that many stations either had no traffic or very little traffic. Now that my data frame was formatted to look at each start station and the available end stations I created a count column that measured the amount of stops between start station and each end station.</p>
  <p>D3 is able to read in data in several forms, I decided to format my data as a two separate json files: One that listed the relavant stations in alphabetical order and one that saved the amount of traffic between each station as a list of lists. In order to filter out the less used I iterated through my list of stations looking at first a start station and then all the possible end stations.In my data frame I was able to then retrieve the count between the two stations. Then if the number of trips between the two stations was more than or equal to 10 I would add that value to a list of values representing traffic. If it was less than ten I would just add a 0. Then to further reduce the number os stations I would then iterate through the list of traffic values and if the traffic values list for a given station has more 0s in it than true trafic values I discard that station. If the station does have more true values than 0s AND it has more than 300 total trips taken from it I finally accept that station as a 'good' station and add it to one last list of final stations and take the list of traffic values for this station and add it to a list of lists representing all traffic. Check out the code below for a better understanding.</p>

</section>
<section class = "code-content">

<div class="cell border-box-sizing code_cell rendered">
<div class="input">

<div class="inner_cell">
<div class="input_area">
<div class=" highlight hl-ipython3"><pre><span class="kn">import</span> <span class="nn">csv</span>
<span class="kn">import</span> <span class="nn">json</span>
<span class="kn">import</span> <span class="nn">pandas</span> <span class="k">as</span> <span class="nn">pd</span>
<span class="kn">import</span> <span class="nn">numpy</span> <span class="k">as</span> <span class="nn">np</span>
</pre></div>

</div>
</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">

<div class="inner_cell">
<div class="input_area">
<div class=" highlight hl-ipython3"><pre><span class="n">dataPath</span> <span class="o">=</span> <span class="s">&#39;../Desktop/Data/2013-07 - Citi Bike trip data.csv&#39;</span>
<span class="n">df</span> <span class="o">=</span> <span class="n">pd</span><span class="o">.</span><span class="n">read_csv</span><span class="p">(</span><span class="n">dataPath</span><span class="p">)</span>
<span class="n">start</span> <span class="o">=</span> <span class="n">df</span><span class="p">[</span><span class="s">&#39;start station name&#39;</span><span class="p">]</span>
<span class="n">end</span> <span class="o">=</span> <span class="n">df</span><span class="p">[</span><span class="s">&#39;end station name&#39;</span><span class="p">]</span>
<span class="n">startEndPair</span> <span class="o">=</span> <span class="n">start</span> <span class="o">+</span> <span class="s">&#39;--&gt;&#39;</span> <span class="o">+</span> <span class="n">end</span>
<span class="n">pairValues</span> <span class="o">=</span> <span class="n">startEndPair</span><span class="o">.</span><span class="n">value_counts</span><span class="p">()</span>

<span class="n">d</span> <span class="o">=</span> <span class="p">{</span><span class="s">&#39;start station name&#39;</span><span class="p">:</span> <span class="n">start</span><span class="p">,</span>
<span class="s">&#39;end station name&#39;</span><span class="p">:</span><span class="n">end</span><span class="p">,</span>
<span class="s">&#39;counts&#39;</span><span class="p">:</span> <span class="n">end</span>
<span class="p">}</span>

<span class="n">df</span> <span class="o">=</span> <span class="n">pd</span><span class="o">.</span><span class="n">DataFrame</span><span class="p">(</span><span class="n">d</span><span class="p">)</span>

<span class="c"># create counts column by how many times a trip is taken in the month</span>
<span class="n">grouped</span> <span class="o">=</span> <span class="n">df</span><span class="o">.</span><span class="n">groupby</span><span class="p">([</span><span class="s">&#39;start station name&#39;</span><span class="p">,</span> <span class="s">&#39;end station name&#39;</span><span class="p">])</span><span class="o">.</span><span class="n">count</span><span class="p">()</span>
<span class="c"># filter out any trip that is made 10 or less times</span>
<span class="c"># grouped_final = grouped[grouped.counts &gt; 10]</span>

<span class="c">#list of all stations in alphabetical order</span>
<span class="n">stations</span><span class="o">=</span> <span class="p">[]</span>
<span class="k">for</span> <span class="n">station</span> <span class="ow">in</span> <span class="n">start</span><span class="p">:</span>
<span class="k">if</span> <span class="n">station</span> <span class="ow">not</span> <span class="ow">in</span> <span class="n">stations</span><span class="p">:</span>
  <span class="n">stations</span><span class="o">.</span><span class="n">append</span><span class="p">(</span><span class="n">station</span><span class="p">)</span>
<span class="n">stations</span><span class="o">.</span><span class="n">sort</span><span class="p">()</span>

<span class="c">#take to json form</span>
<span class="n">grouped</span><span class="o">.</span><span class="n">reset_index</span><span class="p">()</span><span class="o">.</span><span class="n">to_json</span><span class="p">(</span><span class="n">path_or_buf</span> <span class="o">=</span> <span class="s">&#39;data.json&#39;</span><span class="p">,</span> <span class="n">orient</span><span class="o">=</span><span class="s">&quot;records&quot;</span><span class="p">)</span>

<span class="c">#arrray of values by station to station in alphabetical order</span>
<span class="n">values</span> <span class="o">=</span> <span class="p">[]</span>
<span class="n">stations_list_final</span> <span class="o">=</span> <span class="p">[]</span>
<span class="k">for</span> <span class="n">start_station</span> <span class="ow">in</span> <span class="n">stations</span><span class="p">:</span>
<span class="n">station_values</span> <span class="o">=</span> <span class="p">[]</span>
<span class="k">for</span> <span class="n">end_station</span> <span class="ow">in</span> <span class="n">stations</span><span class="p">:</span>
  <span class="k">try</span><span class="p">:</span>

      <span class="n">value</span> <span class="o">=</span> <span class="n">grouped</span><span class="p">[</span><span class="s">&#39;counts&#39;</span><span class="p">][</span><span class="n">start_station</span><span class="p">,</span> <span class="n">end_station</span><span class="p">]</span>
      <span class="c">#station_values.append(value)</span>
      <span class="k">if</span> <span class="n">value</span> <span class="o">&gt;=</span> <span class="mi">10</span><span class="p">:</span>
          <span class="n">station_values</span><span class="o">.</span><span class="n">append</span><span class="p">(</span><span class="n">value</span><span class="p">)</span>
      <span class="k">else</span><span class="p">:</span>
          <span class="n">station_values</span><span class="o">.</span><span class="n">append</span><span class="p">(</span><span class="mi">0</span><span class="p">)</span>

  <span class="k">except</span> <span class="ne">KeyError</span><span class="p">:</span>
      <span class="n">station_values</span><span class="o">.</span><span class="n">append</span><span class="p">(</span><span class="mi">0</span><span class="p">)</span>
<span class="n">num_zeroes</span> <span class="o">=</span> <span class="mi">0</span>
<span class="k">for</span> <span class="n">nums</span> <span class="ow">in</span> <span class="n">station_values</span><span class="p">:</span>
  <span class="k">if</span> <span class="n">nums</span> <span class="o">==</span> <span class="mi">0</span><span class="p">:</span>
      <span class="n">num_zeroes</span> <span class="o">+=</span> <span class="mi">1</span>
<span class="k">if</span> <span class="n">num_zeroes</span> <span class="o">&lt;</span> <span class="nb">len</span><span class="p">(</span><span class="n">station_values</span><span class="p">)</span> <span class="o">/</span> <span class="mi">2</span><span class="p">:</span>
  <span class="k">if</span> <span class="nb">sum</span><span class="p">(</span><span class="n">station_values</span><span class="p">)</span> <span class="o">&gt;=</span> <span class="mi">300</span><span class="p">:</span>
      <span class="n">values</span><span class="o">.</span><span class="n">append</span><span class="p">(</span><span class="n">station_values</span><span class="p">)</span>
      <span class="n">stations_list_final</span><span class="o">.</span><span class="n">append</span><span class="p">(</span><span class="n">start_station</span><span class="p">)</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt"></div>
<div class="output_subarea output_stream output_stdout output_text">
<pre>                                                  counts
start station name end station name                     
1 Ave &amp; E 15 St    1 Ave &amp; E 15 St                   106
             1 Ave &amp; E 18 St                    45
             1 Ave &amp; E 30 St                    51
             1 Ave &amp; E 44 St                    36
             10 Ave &amp; W 28 St                    8
             11 Ave &amp; W 27 St                    8
             11 Ave &amp; W 41 St                    3
             12 Ave &amp; W 40 St                    7
             2 Ave &amp; E 31 St                    53
             2 Ave &amp; E 58 St                    43
             5 Ave &amp; E 29 St                     9
             6 Ave &amp; Broome St                   1
             6 Ave &amp; Canal St                    3
             6 Ave &amp; W 33 St                    11
             8 Ave &amp; W 31 St                    25
             8 Ave &amp; W 33 St                    12
             8 Ave &amp; W 52 St                     7
             9 Ave &amp; W 14 St                    16
             9 Ave &amp; W 16 St                    26
             9 Ave &amp; W 18 St                    12
             9 Ave &amp; W 22 St                    12
             9 Ave &amp; W 45 St                     6
             Allen St &amp; E Houston St            30
             Allen St &amp; Hester St               29
             Allen St &amp; Rivington St            32
             Atlantic Ave &amp; Fort Greene Pl       2
             Avenue D &amp; E 12 St                 12
             Avenue D &amp; E 3 St                   6
             Avenue D &amp; E 8 St                  11
             Bank St &amp; Hudson St                 7
...                                                  ...
York St &amp; Jay St   W 22 St &amp; 10 Ave                    1
             W 22 St &amp; 8 Ave                     1
             W 26 St &amp; 8 Ave                     1
             W 27 St &amp; 7 Ave                     1
             W 33 St &amp; 7 Ave                     1
             W 34 St &amp; 11 Ave                    1
             W 37 St &amp; 10 Ave                    1
             W 38 St &amp; 8 Ave                     3
             W 4 St &amp; 7 Ave S                    3
             W 41 St &amp; 8 Ave                     2
             W 45 St &amp; 6 Ave                     1
             W 46 St &amp; 11 Ave                    1
             W 51 St &amp; 6 Ave                     1
             W 52 St &amp; 11 Ave                    4
             W 52 St &amp; 9 Ave                     2
             W Broadway &amp; Spring St              3
             W Houston St &amp; Hudson St            2
             Warren St &amp; Church St               2
             Washington Ave &amp; Greene Ave         3
             Washington Ave &amp; Park Ave          47
             Washington Park                     8
             Washington Pl &amp; Broadway            2
             Washington Square E                 2
             West St &amp; Chambers St               2
             West Thames St                      2
             Willoughby Ave &amp; Hall St            8
             Willoughby Ave &amp; Walworth St        4
             Willoughby St &amp; Fleet St            2
             Wythe Ave &amp; Metropolitan Ave       21
             York St &amp; Jay St                   41

[77880 rows x 1 columns]
</pre>
</div>
</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">

<div class="inner_cell">
<div class="input_area">
<div class=" highlight hl-ipython3"><pre><span class="k">with</span> <span class="nb">open</span><span class="p">(</span><span class="s">&quot;stations.json&quot;</span><span class="p">,</span> <span class="s">&quot;w&quot;</span><span class="p">)</span> <span class="k">as</span> <span class="n">outfile</span><span class="p">:</span>
<span class="n">json</span><span class="o">.</span><span class="n">dump</span><span class="p">(</span><span class="n">stations_list_final</span><span class="p">,</span> <span class="n">outfile</span><span class="p">)</span>
</pre></div>

</div>
</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">

<div class="inner_cell">
<div class="input_area">
<div class=" highlight hl-ipython3"><pre><span class="c"># repeat above process but only for stations we want</span>
<span class="n">vals</span> <span class="o">=</span> <span class="p">[]</span>
<span class="k">for</span> <span class="n">start_station</span> <span class="ow">in</span> <span class="n">stations_list_final</span><span class="p">:</span>
<span class="n">station_values</span> <span class="o">=</span> <span class="p">[]</span>
<span class="k">for</span> <span class="n">end_station</span> <span class="ow">in</span> <span class="n">stations_list_final</span><span class="p">:</span>
  <span class="n">value</span> <span class="o">=</span> <span class="n">grouped</span><span class="p">[</span><span class="s">&#39;counts&#39;</span><span class="p">][</span><span class="n">start_station</span><span class="p">,</span> <span class="n">end_station</span><span class="p">]</span>
  <span class="n">station_values</span><span class="o">.</span><span class="n">append</span><span class="p">(</span><span class="n">value</span><span class="p">)</span>
<span class="n">vals</span><span class="o">.</span><span class="n">append</span><span class="p">(</span><span class="n">station_values</span><span class="p">)</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt"></div>
<div class="output_subarea output_stream output_stdout output_text">
<pre>[[108, 30, 38, 55, 67, 69, 26, 57, 44, 61, 17, 50, 55, 56, 113, 43], [22, 99, 18, 50, 73, 40, 11, 40, 21, 71, 21, 41, 59, 35, 55, 50], [45, 20, 140, 66, 37, 79, 83, 29, 133, 52, 17, 37, 67, 52, 30, 32], [56, 41, 100, 101, 21, 33, 35, 120, 59, 66, 81, 34, 58, 57, 43, 23], [77, 29, 79, 39, 99, 40, 33, 205, 47, 67, 63, 43, 73, 37, 72, 31], [55, 16, 42, 34, 35, 122, 69, 38, 82, 24, 67, 42, 74, 63, 16, 82], [31, 6, 100, 28, 37, 68, 139, 69, 180, 32, 40, 23, 52, 30, 11, 26], [76, 30, 56, 65, 75, 84, 69, 116, 88, 107, 27, 69, 94, 83, 44, 26], [41, 19, 142, 43, 24, 55, 90, 156, 132, 73, 61, 48, 76, 38, 37, 35], [35, 83, 68, 71, 103, 18, 28, 78, 51, 74, 55, 43, 63, 42, 123, 20], [29, 24, 17, 43, 40, 71, 49, 26, 57, 41, 71, 32, 51, 45, 24, 31], [55, 45, 49, 37, 34, 30, 18, 106, 41, 43, 30, 48, 53, 21, 35, 28], [111, 40, 78, 65, 58, 79, 59, 114, 61, 51, 41, 68, 171, 55, 48, 156], [80, 42, 31, 38, 28, 45, 20, 63, 18, 35, 27, 8, 71, 53, 45, 29], [43, 21, 43, 48, 49, 25, 16, 39, 40, 97, 22, 30, 55, 24, 71, 35], [45, 22, 16, 35, 18, 92, 44, 14, 9, 16, 19, 21, 113, 13, 14, 421]]
</pre>
</div>
</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">

<div class="inner_cell">
<div class="input_area">
<div class=" highlight hl-ipython3"><pre><span class="c">#convert list to numpy array so that the integer transformation </span>
<span class="c">#from numpy.int64 is taken care of automatically</span>
<span class="n">array</span> <span class="o">=</span> <span class="n">np</span><span class="o">.</span><span class="n">asarray</span><span class="p">(</span><span class="n">vals</span><span class="p">)</span>
<span class="k">with</span> <span class="nb">open</span><span class="p">(</span><span class="s">&quot;data.json&quot;</span><span class="p">,</span> <span class="s">&quot;w&quot;</span><span class="p">)</span> <span class="k">as</span> <span class="n">outfile</span><span class="p">:</span>
<span class="n">json</span><span class="o">.</span><span class="n">dump</span><span class="p">(</span><span class="n">array</span><span class="o">.</span><span class="n">tolist</span><span class="p">(),</span> <span class="n">outfile</span><span class="p">)</span>
</pre></div>

</div>
</div>
</div>

</div>
</section>
