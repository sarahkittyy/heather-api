EXEC = npx

.PHONY: all run build clean

all: build

run: build
	node .

clean:
	rm -rf build/*
	
build:
	$(EXEC) tsc