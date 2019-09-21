# nmsbhs-powertools

Power tools for travelers. Early days, so expect lots of breaking changes.

This project provides a command-line interface and additional support for
https://github.com/j50n/nmsbhs-utils, the route search engine behind the
BlackHoleSuns DaRC implementations. Its primary purpose is to provide an
accelerated research platform for new ideas. New features can be iterated
and tested much more quickly in a command-line form than in a web application.

At the outset, my intention is to provide a command-line interface that has
all of the functionality of the web applications (minus graphs and maps)
with the added ability to do some scripty things that the web apps may never
be able to do.

## Installation

```
git clone git@github.com:j50n/nmsbhs-powertools.git
cd nmsbhs-powertools
npm install -g
```

This makes the `bhs` command line tool available.

## Usage

### Get Black-Hole/Exit Data

The `bhs data` command downloads black-hole/exit pairs from the BlackHoleSuns database by
platform and galaxy and converts it to CSV format. The default galaxy is "Euclid."

```bash
bhs data --ps4 | head -10
```

results in

```csv
bh-coords,bh-region,bh-system,ex-coords,ex-region,ex-system
0000:0000:0000:0079,Thoslo Quadrant,SAS.A83,02CC:007C:0000:003D,Thnavi Void,Lafaelu-Mysit
0000:0000:0001:0079,Sea of Yiforcy,Mubskada XV,0000:0081:06D8:0001,Tejobadj Terminus,Ritann-Iovir
0000:0001:0000:0079,Riszewamya,Carlit-Muhi,0FFE:0080:0EE7:000D,Wiyosh Terminus,Usukuha
0000:0001:0001:0079,Eograb Quadrant,Yachida-Kip,0FFE:007D:045D:0049,Ladekau Mass,Motsum-Majo
0000:007B:0266:0079,Urberg Conflux,Aeguror,0FFE:007E:08C6:0036,Igwala Boundary,Baekerin
0000:007B:0915:0079,The Arm of Agybol,Sredko,0873:0083:0000:002E,Nishma,Miosber
0000:007C:01E0:0079,Gaithh Terminus,Ordnet,0248:0082:0000:0006,Sea of Nemari,Rycoktas
0000:007C:01E8:0079,Pahontie,AlyKillo I,0FFE:007E:0A94:0004,Tuylinni Cluster,Jiyuanwe
0000:007C:0915:0079,Negxian Conflux,Iazusc XIV,02B0:007E:0DFC:0076,Diophu Fringe,Omotsu-Nari
```

To load the data for PC and Eissentam to a file:

```bash
bhs data --pc --galaxy eissentam > ./data-pc-eissentam.csv
```

### Get Player Base Data

This isn't working.

```bash
bhs bases --pc -g euclid -u 'Bad Wolf'
```

### Search for the Best Route

The first coordinates is the destination. Additional coordinates
are start locations. You can specify multiple starts.

```bash
bhs search -d <( bhs data --ps4 ) 0164:007E:0596:0021 0DCD:0082:0D18:0010
```

If you have bases:

```bash
bhs search  -d <( bhs data --ps4 ) -b ./bases.txt 0164:007E:0596:0021
```

where `bases.txt` looks like this:

```text
["0000:0000:0000:0079", "Null Shrine"]
["0FF0:007F:0FF0:0079", "Delta Corner"]
["0BDB:0081:0FEB:0079", "Shrine of the Misguided"]
["0000:0083:0515:0079", "Rattle Spines at the Fade"]
["00A2:0080:0550:00FD", "Glitching Separator Moon Mine"]
["0DCD:0082:0D18:0010", "Vy'keen Shrine"]
```
