#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Applying migrations..."
python manage.py migrate

echo "Seeding/Refreshing database..."
python seed_db.py

echo "Cleaning up ghost slots..."
# python fix_slots.py
