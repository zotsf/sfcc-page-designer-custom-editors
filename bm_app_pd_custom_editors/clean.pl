#!/usr/bin/perl
# usage on the command line: find . -type f | xargs perl -i path/to/clean.pl

while (<>) {

# strip out emojis

s#oldTextToReplace#newTextToReplace#g;

print;
}
