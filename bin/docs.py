"""
We use this in development to build the index.
"""

import os
import lxml.html
from docutils.core import publish_string

DIR_PATH = os.path.abspath(os.path.dirname(__file__))

if __name__ == '__main__':
    # Creates index.html from the README and the the index.template.html
    f = open(os.path.join(DIR_PATH, '../README.rst'), 'r')
    html = f.read()
    f.close()

    raw = publish_string(html, settings=None, settings_overrides={'no-doc-title': True}, writer_name='html')
    doc = lxml.html.fromstring(raw)

    document = doc.cssselect('.document')[0]

    # Fix docutils f-ed up hl.title bullshit.
    for heading in document.xpath('//h1|//h2//h3'):
        heading.tag = 'h{}'.format(int(heading.tag[1])+1)

    t = open(os.path.join(DIR_PATH, '../demo/index.template.html'), 'r')
    template = lxml.html.fromstring(t.read())
    t.close()

    placeholder = template.xpath('//div[@rel="placeholder"]')[0]

    # just take the sections, allow for our own intro.
    for section in document.cssselect('.section'):
        placeholder.append(section)

    # add the pretty print stuff.
    for pre in template.xpath('//pre'):
        pre.set('class', 'prettyprint linenums')

    index = open(os.path.join(DIR_PATH, '../demo/index.html'), 'w')
    index.write(lxml.html.tostring(template))
    index.close()
