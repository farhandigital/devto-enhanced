name="$name"
version="$version"
release_notes="docs/releases/v$version-release-notes.md"

[[ -s "$release_notes" ]] || {
  echo "File is missing or empty"
  exit 1
}