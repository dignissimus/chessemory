#!/usr/bin/env python3

import chess
import csv
import pathlib
import operator
import functools

ROOT = pathlib.Path(__file__).parent.parent
DATA_DIRECTORY = ROOT / "data"

PIECES = "rnbqkpRNBQKP"


def number_of_pieces(position):
    npieces = 0
    for character in position:
        if character == " ":
            break
        if character in PIECES:
            npieces += 1

    return npieces


def main():
    handles = {i: open(DATA_DIRECTORY / f"{i}", "w") for i in range(1, 33)}
    with open(DATA_DIRECTORY / "puzzles.csv", "r") as file:
        reader = csv.DictReader(file)
        for row in reader:
            position = row["FEN"]
            npieces = number_of_pieces(position)
            handles[npieces].write(position + "\n")

    for handle in handles.values():
        handle.close()


if __name__ == "__main__":
    main()
