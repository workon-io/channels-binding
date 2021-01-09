LOCAL=./
DC_LOCAL=docker-compose -f docker-compose.channels-binding.docs.localhost.yml

PROD_HOST=channels-binding.com
PROD=root@$(PROD_HOST)
DC_PROD=COMPOSE_HTTP_TIMEOUT=300 docker-compose -f docker-compose.channels-binding.docs.prod.yml
WORKDIR_PROD=/home/channels-binding/
SSH_PROD=ssh -tt $(PROD)

prod_deploy:
	de info @prod
	rsync -avz --exclude "__pycache__/" --exclude "dist/" --perms --delete  \
		$(LOCAL)* $(PROD):$(WORKDIR_PROD)
	$(SSH_PROD) "cd $(WORKDIR_PROD)  ; \
		export COMPOSE_HTTP_TIMEOUT=200 ; \
		$(DC_PROD) build ; \
		$(DC_PROD) down --remove-orphans; \
		$(DC_PROD) up -d ; \
		$(DC_PROD) exec back python manage.py migrate --no-input -v 1 ; \
	"
prod_ssh:
	ssh $(PROD)
prod_flush:
	$(SSH_PROD) "cd $(WORKDIR_PROD) ; $(DC_PROD) exec -T redis redis-cli FLUSHALL ; "
prod_backup:
	$(SSH_PROD) "cd $(WORKDIR_PROD) ; $(DC_PROD) exec postgres pg_dump -Upostgres; "  > backup.sql
prod_enter:
	$(SSH_PROD) "cd $(WORKDIR_PROD) ; $(DC_PROD) exec back bash; "
prod_init:
	$(SSH_PROD) "cd $(WORKDIR_PROD) ; $(DC_PROD) down; $(DC_PROD) up -d;"
prod_shell:
	$(SSH_PROD) "cd $(WORKDIR_PROD) ; $(DC_PROD) exec back python manage.py shell ; "
prod_debug:
	$(SSH_PROD) "cd $(WORKDIR_PROD) ; $(DC_PROD) logs -f --tail=300 back ; "
prod_psql: 
	$(SSH_PROD) "cd $(WORKDIR_PROD) ; $(DC_PROD) exec postgres psql -U postgres; "
prod_debug_worker:
	$(SSH_PROD) "cd $(WORKDIR_PROD) ; $(DC_PROD) logs -f --tail=300 worker ; "
# prod_sync:
# 	$(SSH_PROD) "cd $(WORKDIR_PROD) ; $(DC_PROD) exec postgres pg_dump -Upostgres; "  > backup.sql
# 	$(DC_LOCAL) down
# 	$(DC_LOCAL) up -d postgres
# 	$(DC_LOCAL) exec postgres psql -Upostgres -c 'drop schema public cascade; create schema public;'
# 	$(DC_LOCAL) exec -T postgres psql -Upostgres < backup.sql
# 	$(DC_LOCAL) up -d
# 	rm -f backup.sql