version="$version"
release_notes="docs/releases/v${version}-release-notes.md"

if [[ ! -s "$release_notes" ]]; then
  echo "Release notes are missing or empty: ${release_notes}"
  exit 1
fi

echo "Release notes found: ${release_notes}"