#!/bin/sh

rm data.json
rm -rf files

/usr/bin/env node mirrorer.js > data.json
mkdir files
/usr/bin/env node machinator.js > list.txt
/usr/bin/env node downloader.js
