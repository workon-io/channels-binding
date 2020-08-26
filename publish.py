import os
import sys
import re
import json
import subprocess

'''
    requires:
        python >= 3
        node
        npm >= 10
        pandoc
'''

npm_packages = [
    'core',
    'mui',
]

pypi_packages = [
    'django'
]

if __name__ == "__main__":

    for packages in [npm_packages, pypi_packages]:
        for package in packages:
            cwd = "packages/channels-binding-%s" % package
            print(subprocess.check_output(["pandoc", "README.rst", "-s", "-o", "README.md"]))
            print(subprocess.check_output(["cp", "LICENSE", cwd]))
            print(subprocess.check_output(["cp", "README.rst", cwd]))
            print(subprocess.check_output(["cp", "README.md", cwd]))

    try:
        revision = sys.argv[1]
    except BaseException:
        revision = 'revision'

    version = json.loads(open('package.json', 'r').read()).get('version')
    print('Current version: {}'.format(version))

    has_changes = 'la copie de travail est propre' not in str(subprocess.check_output(["git", "status"]).rstrip())
    if has_changes:

        major, minor, patch = version.split(".")

        if revision == 'patch':
            patch = int(patch) + 1

        elif revision == 'minor':
            minor = int(minor) + 1
            patch = 0

        elif revision == 'major':
            major = int(major) + 1
            minor = 0
            patch = 0

        else:
            patch = int(patch) + 1

        new_version = "{}.{}.{}".format(major, minor, patch)
        print('New version: {}'.format(new_version))

        comment = input('Comment: ')
        comment = comment.strip()
        if not comment:
            comment = 'autotagging'
        comment = comment.replace('"', '\\"')

        # Increments versions
        print(subprocess.check_output(["npm", "version", new_version, "-git-tag-version", "false", "--allow-same-version"]))
        for package in npm_packages:
            cwd = "packages/channels-binding-%s" % package
            print(subprocess.check_output(["npm", "version", new_version, "-git-tag-version", "false", "--allow-same-version"], cwd=cwd))

        for package in pypi_packages:
            cwd = "packages/channels-binding-%s" % package
            version_py = os.path.join(os.path.dirname(__file__), cwd, 'channels_binding/__init__.py')
            content = open(version_py, 'r').read()
            matches = re.search(r'__version__ = "([\d\.]+)"', content)
            content = content.replace(matches.group(0), '__version__ = "{}"'.format(new_version))
            open(version_py, 'w').write(content)

        # Git auto commit
        print(subprocess.check_output(["git", "add", "."]))
        print(subprocess.check_output(["git", "commit", "-am", '"%s"' % comment]))
        try:
            print(subprocess.check_output(["git", "tag", "-a", new_version, '-m', '"%s"' % comment]))
        except BaseException:  # Tag exists
            pass

        # Publish packages
        for package in npm_packages:
            cwd = "packages/channels-binding-%s" % package
            print(subprocess.check_output(["npm", "publish", "--access", "public"], cwd=cwd))

        for package in pypi_packages:
            cwd = "packages/channels-binding-%s" % package
            try:
                print(subprocess.check_output(["rm", "-rf", "dist/*"], cwd=cwd))
            except BaseException:  # No previous dist
                pass
            print(subprocess.check_output(["python3", "setup.py", "sdist", "bdist_wheel"], cwd=cwd))
            print(subprocess.check_output(["python3", "-m", "twine", "upload", "--repository", "pypi", "dist/*"], cwd=cwd))

        # Git push + tags
        print(subprocess.check_output(["git", "push"]))
        print(subprocess.check_output(["git", "push", "--tags"]))

    else:
        print('Aucun changement')
