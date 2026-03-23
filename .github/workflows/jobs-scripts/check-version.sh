tag_version="${tag_version#v}"
package_version="$package_version"
if [ "$tag_version" != "$package_version" ]; then
    echo "Version mismatch!"
    exit 1
fi