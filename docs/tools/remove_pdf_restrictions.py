#!/usr/bin/python3
# coding: utf-8

import os
import sys
import re
import pikepdf

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("usage: python3 ./remove_pdf_restrictions.py 1.pdf [2.pdf...]")
        os._exit(1)
    filelist = sys.argv[1:]
    for filename in filelist:
        if not os.path.isfile(filename):
            print("%s is not a file" % filename)
            continue
        if not re.search("\.(pdf|PDF)$", filename):
            print("%s is not a pdf file" % filename)
            continue
        pdf = pikepdf.open(filename, allow_overwriting_input=True)
        pdf.save(filename)
        print("remove restrictions of %s success" % filename)
