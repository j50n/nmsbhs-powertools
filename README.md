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

`bhs data --ps4`

### Search for the Best Route

The first coordinates is the destination. Additional coordinates
are start locations. You can specify multiple starts.

`bhs search -d <( bhs data --ps4 ) 0164:007E:0596:0021 0DCD:0082:0D18:0010`
