#!/usr/bin/python3

import os
import sys
import re

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("usage: python3 ./gen_md.py <directory> <filename.md>")
        os._exit(1)
    directory = sys.argv[1]
    print("directory: ", directory)
    mdfile = sys.argv[2]
    print("mdfile: ", mdfile)

    if not os.path.exists(directory):
        os._exit(1)

    fhidden = open(os.path.join(directory, "hidden.txt"), "w")
    fhidden.close()
    print("create hidden.txt")

    filelist = []
    for filename in os.listdir(directory):
        filepath = os.path.join(directory, filename)
        if not os.path.isfile(filepath):
            continue
        if not re.search("mp3$", filename):
            continue
        newname = re.sub("\s+", "_", filename)
        newname = re.sub("Menschen_Berufstrainer_[A-C][1-2]_", "", newname)
        newname = re.sub(
            "Menschen_[A-C][1-2]_Intensivtrainer_Track_", "", newname)
        newname = re.sub("Menschen_[A-C][1-2]_Testtrainer_", "", newname)
        newpath = os.path.join(directory, newname)
        os.rename(filepath, newpath)
        filelist.append(newname)
    
    filelist.sort()
    fout = open(mdfile, "w")
    for filename in filelist:
        fout.write("# " + filename + "\n")
        fout.write('<audio controls loop src="' +
                   directory+'/'+filename+'"></audio>\n\n')
    fout.close()
