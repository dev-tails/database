esbuild src/test/Client.spec.ts --bundle --platform=node --outdir=built
node built/Client.spec.js