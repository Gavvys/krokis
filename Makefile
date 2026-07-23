.PHONY: build dev dev-live test validate check

build:
	go build -o krokis .

dev: build
	./krokis insights && ./krokis serve --port 8080

dev-live:
	air

test:
	go test ./...

validate:
	openspec validate --all --strict

check: test validate
