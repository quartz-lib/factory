.PHONY: dev site blog pangu update FORCE

CONTENT ?= content
OUTPUT ?= public
PORT ?= 8080
QUARTZ_ARGS ?=
CONTENT_DIR := $(or $(word 2,$(MAKECMDGOALS)),$(CONTENT))

%: FORCE
	@:

FORCE:

dev:
	npx quartz build --serve

site:
	node scripts/build-content-site.mjs "$(CONTENT_DIR)" "$(OUTPUT)" $(QUARTZ_ARGS)

blog:
	node scripts/build-content-site.mjs "$(CONTENT_DIR)" "$(OUTPUT)" --serve --port "$(PORT)" $(QUARTZ_ARGS)

# 中英文间距（pangu 风格），直接写回 content/
pangu:
	npx tsx scripts/pangu.ts

update:
	npx quartz plugin install --latest