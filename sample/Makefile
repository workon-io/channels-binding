start:
	docker-compose down
	docker-compose up -d
	docker-compose exec back python manage.py migrate
	docker-compose exec back python manage.py loaddata app.json

stop:
	docker-compose down

debug:
	docker-compose logs -f --tail=300 back
