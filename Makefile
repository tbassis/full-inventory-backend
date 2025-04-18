# Makefile to manage a pg Database

# Variables
DB_SERVICE = db

.PHONY: help up stop clean test-connection logs

help: ## dilplay all commands
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

up: ## Start the container with postgres
	docker compose up -d $(DB_SERVICE)

stop: ## Stop the container and keep the data
	docker compose stop $(DB_SERVICE)

clean: ## Remove everything (container, volumes, network)
	docker compose down -v --rmi all --remove-orphans

test-connection: ## Test connection with the db
	@echo "Testing connection with PostgresSQL..."
	docker compose exec $(DB_SERVICE) pg_isready -U admin -d inventory_db

logs: ## Display the db's container logs
	docker compose logs -f $(DB_SERVICE)
