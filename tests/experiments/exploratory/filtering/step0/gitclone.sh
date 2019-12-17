#Script to git clone (download) selected projects

for app in `cat list-projects.csv`
do
	echo "Downloading ${app}"
	git clone https://github.com/${app}.git
done