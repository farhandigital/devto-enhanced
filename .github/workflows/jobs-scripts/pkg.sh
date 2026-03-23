version=$(bun -e "console.log(require('./package.json').version)")
name=$(bun -e "console.log(require('./package.json').name)")
echo "version=${version}" >> $GITHUB_OUTPUT
echo "name=${name}" >> $GITHUB_OUTPUT
