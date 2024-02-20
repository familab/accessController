FamiLAB Access Controller NFC Reader
====================================

## Development Setup
1. Install Python 3
2. Globally install `pipenv`
```bash
python -m pip install --user pipenv
```
3. Install Python dependencies
```bash
pipenv install
```

## Development

The target device of this project is any microcontroller with CircuitPython installed. See
[Installing CircuitPython](https://learn.adafruit.com/welcome-to-circuitpython/installing-circuitpython) for
instructions on how to do so.

To deploy your code changes to the microcontroller, run the `sync.ts` script:
```bash
npm run sync
```
