#!/usr/bin/env python3

import requests


def fetch(url):
    dest = './files/' + ('/'.join(url.split('/')[3:]));
    r = requests.get(url)
    with open(dest, 'wb') as fd:
        for chunk in r.iter_content(chunk_size=1024):
            fd.write(chunk)
    print('END   [%d/%d] %s' % (current, total, url.strip()))


with open('./list.txt') as f:
    urls = f.readlines()

total = len(urls)
current = 0
print('Total: %d' % total)

for url in urls:
    url = url.strip()
    if url:
        current += 1
        print('START [%d/%d] %s' % (current, total, url.strip()))
        fetch(url)

