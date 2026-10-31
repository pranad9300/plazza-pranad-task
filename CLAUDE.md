@AGENTS.md

# Claude notes

Follow AGENTS.md. Do not import third-party libraries from `src/features`. Put new libraries behind `src/core` and wire them in `src/di/container.ts`.

Do not implement a feature while doing setup, and do not refactor unrelated files while implementing a feature.
