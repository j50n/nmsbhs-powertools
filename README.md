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

`bhs data --ps4 -g euclid`

### Get Player Base Data

This isn't working.

`bhs bases --pc -g euclid -u 'Bad Wolf'`

### Search for the Best Route

The first coordinates is the destination. Additional coordinates
are start locations. You can specify multiple starts.

`bhs search -d <( bhs data --ps4 ) 0164:007E:0596:0021 0DCD:0082:0D18:0010`

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
