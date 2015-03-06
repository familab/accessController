PYTHON=python
FLAGS=

all: test
  
test:
	$(PYTHON) -m pytest $(FLAGS)

vtest:
	$(PYTHON) -m pytest -v $(FLAGS)

testloop:
	while sleep 1; do $(PYTHON) -m pytest $(FLAGS); done

cov coverage:
	$(PYTHON) -m pytest --cov database --cov web $(FLAGS)
