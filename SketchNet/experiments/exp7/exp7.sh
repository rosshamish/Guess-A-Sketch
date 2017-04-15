#!/bin/bash

python exp7.py -l easy -i 1 -n smoke_test --no-save &&
echo "Smoke test passed"

ITERATIONS=1500
python exp7.py -l easy -i $ITERATIONS &&
python exp7.py -l food -i $ITERATIONS &&
python exp7.py -l animals -i $ITERATIONS &&
python exp7.py -l standard -i $ITERATIONS &&
echo "Succesfully trained low-iteration models"

ITERATIONS=15000
python exp7.py -l easy -i $ITERATIONS &&
python exp7.py -l food -i $ITERATIONS &&
python exp7.py -l animals -i $ITERATIONS &&
python exp7.py -l standard -i $ITERATIONS &&
echo "Successfully trained high-iteration models"
