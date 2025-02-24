#!/bin/bash

echo "Running tests with coverage..."
pytest --cov=api --cov-report=term-missing --cov-report=html

echo "Opening coverage report..."
xdg-open htmlcov/index.html 2>/dev/null || open htmlcov/index.html 2>/dev/null || start htmlcov/index.html
