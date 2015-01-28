# NFC Reader Ethernet Communication Spec
## UDP packet definitions from Reader
### Card Read
Sent when a NFC card is read

| Reader ID (8 bits) | Card UID (56 bits) |

A full IP4 UDP packet is
<table border="1"><thead>
<tr><th>Offsets</th><th>Octet</th><th colspan="8">0</th><th colspan="8">1</th><th colspan="8">2</th><th colspan="8">3</th></tr>
<tr><th>Octet</th><th>Bit</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th><th>13</th><th>14</th><th>15</th><th>16</th><th>17</th><th>18</th><th>19</th><th>20</th><th>21</th><th>22</th><th>23</th><th>24</th><th>25</th><th>26</th><th>27</th><th>28</th><th>29</th><th>30</th><th>31</th></tr>
</thead><tbody align="center">
<tr><td>0</td><td>0</td><td colspan="32">Source IPv4 Address</td></tr>
<tr><td>4</td><td>32</td><td colspan="32">Destination IPv4 Address</td></tr>
<tr><td>8</td><td>64</td><td colspan="8">Zeroes</td><td colspan="8">Protocol</td><td colspan="16">UDP Length</td></tr>
<tr><td>12</td><td>96</td><td colspan="16">Source Port</td><td colspan="16">Destination Port</td></tr>
<tr><td>16</td><td>128</td><td colspan="16">Length</td><td colspan="16">Checksum</td></tr>
<tr><td>24</td><td>160</td><td colspan="8">Reader ID</td><td colspan="24">Card UID</td></tr>
<tr><td>32</td><td>192</td><td colspan="32">Card UID</td></tr>
</tbody></table>

Example
<table border="1"><thead>
<tr><th>Offsets</th><th>Octet</th><th colspan="8">0</th><th colspan="8">1</th><th colspan="8">2</th><th colspan="8">3</th></tr>
<tr><th>Octet</th><th>Bit</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th><th>13</th><th>14</th><th>15</th><th>16</th><th>17</th><th>18</th><th>19</th><th>20</th><th>21</th><th>22</th><th>23</th><th>24</th><th>25</th><th>26</th><th>27</th><th>28</th><th>29</th><th>30</th><th>31</th></tr>
</thead><tbody align="center">
<tr><td>0</td><td>0</td><td colspan="8">192</td><td colspan="8">168</td><td colspan="8">255</td><td colspan="8">110</td></tr>
<tr><td>4</td><td>32</td><td colspan="8">192</td><td colspan="8">168</td><td colspan="8">255</td><td colspan="8">50</td></tr>
<tr><td>8</td><td>64</td><td colspan="8">0</td><td colspan="8">17</td><td colspan="16">48</td></tr>
<tr><td>12</td><td>96</td><td colspan="16">50000</td><td colspan="16">3000</td></tr>
<tr><td>16</td><td>128</td><td colspan="16">16</td><td colspan="16">0</td></tr>
<tr><td>24</td><td>160</td><td colspan="8">10</td><td colspan="8">AC</td><td colspan="8">6A</td><td colspan="8">CE</td></tr>
<tr><td>32</td><td>192</td><td colspan="8">23</td><td colspan="8">F5</td><td colspan="8">34</td><td colspan="8">AD</td></tr>
</tbody></table>

### Heartbeat
This is used to monitor that the reader and its network connection are working. It can also be used to detect power on or reset.

It is expected that a heartbeat is sent at least every 2 minutes and the reader will be considered offline if one is not recieved within 5 minutes.

| Reader ID (8 bits) | Status (8 bits) | Uptime (32 bits) |

Status is defined as a single byte with each true bit representing a status.

| Bit | Status |
|:-----:|:--------:|
|1|Ready to Scan Card|
|2|Accept Animation Running|
|3|Reject Animation Running|
|4|Pending Animation Running|
|5|Identify Animation Running|
|6|Reset Command Running|
|7|Reserved|
|8|Reserved|

Uptime is a 32 bit number indicating the uptime of the reading in microseconds, will roll over about every 51 days.

## UDP packet definitions to Reader
### Command
This is used to send a command to the ardunio.

| Status (8 bits) |

Status is defined as a single byte with each true bit representing a status.

| Bit | Status |
|:-----:|:--------:|
|1|Clear (Be Ready to scan a card)|
|2|Play Accept Animation|
|3|Play Reject Animation|
|4|Play Pending Animation|
|5|Play Identify Animation|
|6|Reset|
|7|Reserved|
|8|Reserved|
