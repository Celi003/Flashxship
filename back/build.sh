#!/usr/bin/env bash
# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate


python base_users.py