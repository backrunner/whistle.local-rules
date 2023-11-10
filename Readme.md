# whistle.local-rules

Extend rules with local files in real time.

`whistle` now will check the file changes in at most 10s, that's not that reasonable for some scenarios, let's make it real time by file watchers.

## Usage

```
* whistle.local-rules://ABSOLUTE_PATH_TO_RULES_FILE
```

## License

MIT