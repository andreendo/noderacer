// Filter the projects that depend on mocha

const { readdirSync } = require('fs');
const path = require('path');
const load = require('load-pkg');

function getDirectories(source) {
    return readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
}

function hasMocha(pkg) {
    // pkg.dependencies, pkg.devDependencies
    if (pkg.devDependencies && pkg.devDependencies.mocha)
        return true;

    if (pkg.dependencies && pkg.dependencies.mocha)
        return true;

    return false;
}

console.log(['dirname', 'packagename', 'hasMocha'].join(','));

getDirectories('../benchmark').forEach(async dirname => {
    let dir = path.join('../benchmark', dirname);
    const pkg = await load(dir);

    if (pkg) 
        console.log([dirname, pkg.name, hasMocha(pkg)].join(','));
});