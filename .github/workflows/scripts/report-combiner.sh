#!/bin/bash

mkdir -p ./reports/combined-pages

# Copy Playwright report if it exists
if [ -d "./reports/html-report" ]; then
  cp -r ./reports/html-report ./reports/combined-pages/playwright
fi

# Copy Allure report if it exists
if [ -d "./reports/allure-report" ]; then
  cp -r ./reports/allure-report ./reports/combined-pages/allure
fi

# Copy your separate HTML index template to the root of the staging folder
cp -r .github/workflows/report-util/* ./reports/combined-pages/

echo "Combined report generated at ./reports/combined-pages"
ls -lrt ./reports/combined-pages