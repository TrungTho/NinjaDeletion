.PHONY: run
run:
	neu run --neu-dev-auto-reload#

.PHONY: build
build:
	neu build --release --copy-storage