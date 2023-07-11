version=0.0.1
echo "Building version $version"
docker build -t myapp:$version .
docker push myapp:$version