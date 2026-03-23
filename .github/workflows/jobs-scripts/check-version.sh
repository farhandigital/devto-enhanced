tag_version="${tag_version#v}"
package_version="$package_version"

if [ "$tag_version" != "$package_version" ]; then
  echo "Version mismatch: tag=${tag_version}, package.json=${package_version}"
  exit 1
fi

echo "Versions match: ${package_version}"