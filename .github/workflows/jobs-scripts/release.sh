name="$name"
version="$version"
# Default build output path from WXT. Configurable but should be unlikely to change.
chrome=".output/$name-$version-chrome.zip"
firefox=".output/$name-$version-firefox.zip"

prev_tag=$(git tag --sort=-version:refname | grep -v "v$version" | head -n 1)

# Generate changelog from commits since last tag (excluding merges)
if [ -n "$prev_tag" ]; then
  changelog=$(git log "$prev_tag"..HEAD --pretty=format:"- %s (%h)" --no-merges)
else
  changelog=$(git log --pretty=format:"- %s (%h)" --no-merges)
fi

# Combine manual release notes + auto changelog into a temp file
notes=$(mktemp)
cat "docs/releases/v$version-release-notes.md" >> "$notes"
printf "\n---\n\n## Changelog\n" >> "$notes"
echo "$changelog" >> "$notes"

gh release create "v$version" \
  "$chrome" \
  "$firefox" \
  --title "v$version" \
  --notes-file "$notes"