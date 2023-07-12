# coding=utf-8

import os
import sys
import re
from pdf2image import convert_from_path


def get_prefix(pdf_file: str) -> str:
    prefix = os.path.basename(pdf_file)
    prefix = re.sub("\.(pdf|PDF)$", "", prefix)
    prefix = re.sub(" ", "_", prefix)
    prefix = re.sub("_+", "_", prefix)
    return prefix


def convert_file(pdf_file: str) -> None:
    output_dir = f"{pdf_file}_images"
    if os.path.exists(output_dir):
        print(f"[ignore] {pdf_file}")
        print(f"    directory already exists: {os.path.basename(output_dir)}")
        return
    os.mkdir(output_dir)
    if not os.path.exists(output_dir):
        print(f"[error] {pdf_file}")
        print(f"create directory failed: {os.path.basename(output_dir)}")
        return

    i = 1
    for page in convert_from_path(pdf_path=pdf_file, dpi=200, thread_count=6):
        filename = f"{get_prefix(pdf_file)}_{i:03}.jpg"
        page.save(os.path.join(output_dir, filename), 'JPEG')
        i = i + 1

    print(f"[success] {pdf_file}")
    return


def convert_directory(directory: str) -> None:
    for root, dirs, files in os.walk(directory):
        for f in files:
            if f.lower().endswith(".pdf"):
                convert_file(os.path.join(root, f))
        for d in dirs:
            convert_directory(os.path.join(root, d))


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("file or directory needed")
        os._exit(1)
    for path in sys.argv[1:]:
        if not os.path.exists(path):
            print(f"path not exists: {path}")
            continue
        if os.path.isfile(path):
            convert_file(path)
            continue
        if os.path.isdir(path):
            convert_directory(path)
            continue
        print(f"not file or directory: {path}")
