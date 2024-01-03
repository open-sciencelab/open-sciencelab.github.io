msg=${1:-Regular updates.}
# echo ${msg}

git add -A
git commit -m "${msg}"
git push
