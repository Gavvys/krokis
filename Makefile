.PHONY: dev build check validate ensure-tauri

ensure-tauri:
	@cargo tauri --version >/dev/null 2>&1 || (echo "Missing Tauri CLI. Install with:"; echo "  cargo install tauri-cli --version \"^2\" --locked"; exit 1)

dev: ensure-tauri
	cargo tauri dev

build: ensure-tauri
	cargo tauri build

check:
	cd src-tauri && cargo check

validate:
	openspec validate --all --strict
