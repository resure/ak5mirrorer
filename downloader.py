#!/usr/bin/python
# -*- coding: utf-8 -*-

import urllib


def fetch(url):
    dest = './files/' + ('/'.join(url.split('/')[3:]));
    urllib.urlretrieve (url, dest)


with open('./list.txt') as f:
    urls = f.readlines()

total = len(urls)
current = 0
print 'Total: %d' % total

for url in urls:
    if url:
        current += 1
        info = '[%d/%d] %s' % (current, total, url.strip())
        print 'START %s' % info
        fetch(url)
        print 'END   %s' % info
