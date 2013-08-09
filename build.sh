#!/bin/bash
jade browser/index.jade; mv browser/index.html public; node redirect-www.js
